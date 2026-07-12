import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApplicationRepository } from '@/modules/application/repository/application.repository';
import {
  APPLICATION_REPOSITORY,
  BUG_REPOSITORY,
  TESTCASE_REPOSITORY,
} from '@/modules/core/constants/repositories.constants';
import {
  PROJECT_SERVICE,
  TAG_SERVICE,
  USER_SERVICE,
} from '@/modules/core/constants/services.constants';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import type { IProjectService } from '@/modules/project/service/project.service.interface';
import { TagService } from '@/modules/tag/service/tag.service';
import { TestCaseRepository } from '@/modules/testcase/repository/testcase.repository';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';
import { TestRunCase } from '@/modules/testrun/models/entity/testrun-case.entity';
import { UserService } from '@/modules/user/service/user.service';
import { CreateBugDto } from '../models/dto/create-bug.dto';
import { QueryBugDto } from '../models/dto/query-bug.dto';
import { UpdateBugDto } from '../models/dto/update-bug.dto';
import { BugStatus } from '../models/enums/bug-status.enum';
import { Bug } from '../models/entity/bug.entity';
import { BugTag } from '../models/entity/bug-tag.entity';
import {
  BugResponse,
  BugTagSummary,
  BugUserSummary,
  PaginatedBugResponse,
} from '../models/types/bug-response.type';
import { BugRepository } from '../repository/bug.repository';
import { IBugService } from './bug.service.interface';

@Injectable()
export class BugService implements IBugService {
  constructor(
    @Inject(BUG_REPOSITORY)
    private readonly bugRepository: BugRepository,
    @Inject(PROJECT_SERVICE)
    private readonly projectService: IProjectService,
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
    @Inject(TAG_SERVICE)
    private readonly tagService: TagService,
    @Inject(TESTCASE_REPOSITORY)
    private readonly testCaseRepository: TestCaseRepository,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @InjectRepository(TestRunCase)
    private readonly testRunCaseRepository: Repository<TestRunCase>,
    private readonly dataSource: DataSource,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createBugDto: CreateBugDto,
    userId: string,
  ): Promise<BugResponse> {
    this.debugLogger.debug('BugService', 'Criando novo bug', {
      title: createBugDto.title,
      projectId: createBugDto.projectId,
      userId,
    });
    const project = await this.projectService.findOne(createBugDto.projectId);
    const creator = await this.userService.findOne(userId);
    await this.validateOptionalLinks(createBugDto.projectId, {
      applicationId: createBugDto.applicationId,
      testCaseId: createBugDto.testCaseId,
      testRunCaseId: createBugDto.testRunCaseId,
      assignedToId: createBugDto.assignedToId,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let tags: Awaited<ReturnType<TagService['findOrCreateManyByNames']>> = [];
      if (createBugDto.tags && createBugDto.tags.length > 0) {
        tags = await this.tagService.findOrCreateManyByNames(createBugDto.tags);
      }
      const projectSlug = project.slug.toUpperCase();
      const nextNumber = await this.bugRepository.getNextBugSequence(
        createBugDto.projectId,
        queryRunner.manager,
      );
      const bugId = `${projectSlug}-BUG-${String(nextNumber).padStart(2, '0')}`;
      const bug = queryRunner.manager.create(Bug, {
        bugId,
        title: createBugDto.title,
        description: createBugDto.description ?? null,
        status: createBugDto.status ?? BugStatus.OPEN,
        severity: createBugDto.severity ?? Severity.TRIVIAL,
        priority: createBugDto.priority ?? Priority.MEDIUM,
        environment: createBugDto.environment ?? null,
        projectId: createBugDto.projectId,
        applicationId: createBugDto.applicationId ?? null,
        testCaseId: createBugDto.testCaseId ?? null,
        testRunCaseId: createBugDto.testRunCaseId ?? null,
        assignedToId: createBugDto.assignedToId ?? null,
        createdById: userId,
        createdBy: creator,
      });
      const savedBug = await queryRunner.manager.save(Bug, bug);
      if (tags.length > 0) {
        const bugTags = tags.map((tag) =>
          queryRunner.manager.create(BugTag, {
            bugId: savedBug.id,
            tagId: tag.id,
          }),
        );
        await queryRunner.manager.save(BugTag, bugTags);
      }
      await queryRunner.commitTransaction();
      const fullBug = await this.bugRepository.findOneWithRelations(savedBug.id);
      if (!fullBug) {
        throw new NotFoundException('Bug não encontrado após criação');
      }
      return this.mapToResponse(fullBug);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    queryDto: QueryBugDto,
    _userId: string,
  ): Promise<PaginatedBugResponse> {
    const { projectId, page = 1, limit = 10 } = queryDto;
    try {
      await this.projectService.findOne(projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Projeto não encontrado');
      }
      throw error;
    }
    const [bugs, total] = await this.bugRepository.findByProjectWithFilters({
      projectId: queryDto.projectId,
      status: queryDto.status,
      severity: queryDto.severity,
      priority: queryDto.priority,
      assignedToId: queryDto.assignedToId,
      search: queryDto.search,
      page,
      limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: bugs.map((bug) => this.mapToResponse(bug)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string, _userId: string): Promise<BugResponse> {
    const bug = await this.bugRepository.findOneWithRelations(id);
    if (!bug) {
      throw new NotFoundException('Bug não encontrado');
    }
    return this.mapToResponse(bug);
  }

  async update(
    id: string,
    updateBugDto: UpdateBugDto,
    _userId: string,
  ): Promise<BugResponse> {
    const bug = await this.bugRepository.findOneWithRelations(id);
    if (!bug) {
      throw new NotFoundException('Bug não encontrado');
    }
    await this.validateOptionalLinks(bug.projectId, {
      applicationId:
        updateBugDto.applicationId != null
          ? updateBugDto.applicationId
          : undefined,
      testCaseId:
        updateBugDto.testCaseId != null ? updateBugDto.testCaseId : undefined,
      testRunCaseId:
        updateBugDto.testRunCaseId != null
          ? updateBugDto.testRunCaseId
          : undefined,
      assignedToId:
        updateBugDto.assignedToId != null
          ? updateBugDto.assignedToId
          : undefined,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (updateBugDto.title !== undefined) {
        bug.title = updateBugDto.title;
      }
      if (updateBugDto.description !== undefined) {
        bug.description = updateBugDto.description;
      }
      if (updateBugDto.status !== undefined) {
        bug.status = updateBugDto.status;
      }
      if (updateBugDto.severity !== undefined) {
        bug.severity = updateBugDto.severity;
      }
      if (updateBugDto.priority !== undefined) {
        bug.priority = updateBugDto.priority;
      }
      if (updateBugDto.environment !== undefined) {
        bug.environment = updateBugDto.environment;
      }
      if (updateBugDto.applicationId !== undefined) {
        bug.applicationId = updateBugDto.applicationId;
      }
      if (updateBugDto.testCaseId !== undefined) {
        bug.testCaseId = updateBugDto.testCaseId;
      }
      if (updateBugDto.testRunCaseId !== undefined) {
        bug.testRunCaseId = updateBugDto.testRunCaseId;
      }
      if (updateBugDto.assignedToId !== undefined) {
        bug.assignedToId = updateBugDto.assignedToId;
      }
      await queryRunner.manager.save(Bug, bug);
      if (updateBugDto.tags !== undefined) {
        await queryRunner.manager.delete(BugTag, { bugId: id });
        if (updateBugDto.tags.length > 0) {
          const tags = await this.tagService.findOrCreateManyByNames(
            updateBugDto.tags,
          );
          if (tags.length > 0) {
            const bugTags = tags.map((tag) =>
              queryRunner.manager.create(BugTag, {
                bugId: id,
                tagId: tag.id,
              }),
            );
            await queryRunner.manager.save(BugTag, bugTags);
          }
        }
      }
      await queryRunner.commitTransaction();
      const updatedBug = await this.bugRepository.findOneWithRelations(id);
      if (!updatedBug) {
        throw new NotFoundException('Bug não encontrado após atualização');
      }
      return this.mapToResponse(updatedBug);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, _userId: string): Promise<void> {
    const bug = await this.bugRepository.findOne({ where: { id } });
    if (!bug) {
      throw new NotFoundException('Bug não encontrado');
    }
    await this.bugRepository.remove(bug);
  }

  private async validateOptionalLinks(
    projectId: string,
    links: {
      applicationId?: string;
      testCaseId?: string;
      testRunCaseId?: string;
      assignedToId?: string;
    },
  ): Promise<void> {
    if (links.assignedToId) {
      await this.userService.findOne(links.assignedToId);
    }
    if (links.applicationId) {
      const application = await this.applicationRepository.findOne({
        where: { id: links.applicationId },
      });
      if (!application) {
        throw new NotFoundException('Aplicação não encontrada');
      }
      if (application.projectId !== projectId) {
        throw new BadRequestException(
          'A aplicação deve pertencer ao mesmo projeto do bug',
        );
      }
    }
    if (links.testCaseId) {
      const testCase = await this.testCaseRepository.findOne({
        where: { id: links.testCaseId },
        relations: ['testSuite', 'testSuite.project'],
      });
      if (!testCase) {
        throw new NotFoundException('Caso de teste não encontrado');
      }
      if (testCase.testSuite?.projectId !== projectId) {
        throw new BadRequestException(
          'O caso de teste deve pertencer ao mesmo projeto do bug',
        );
      }
    }
    if (links.testRunCaseId) {
      const testRunCase = await this.testRunCaseRepository.findOne({
        where: { id: links.testRunCaseId },
        relations: ['testRun'],
      });
      if (!testRunCase) {
        throw new NotFoundException('Caso de execução não encontrado');
      }
      if (testRunCase.testRun.projectId !== projectId) {
        throw new BadRequestException(
          'O caso de execução deve pertencer ao mesmo projeto do bug',
        );
      }
    }
  }

  private mapToResponse(bug: Bug): BugResponse {
    const mapUser = (user: {
      id: string;
      name: string;
      email: string;
    }): BugUserSummary => ({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    const tags: BugTagSummary[] =
      bug.bugTags?.map((bugTag) => ({
        id: bugTag.tag.id,
        name: bugTag.tag.name,
      })) ?? [];
    return {
      id: bug.id,
      bugId: bug.bugId,
      title: bug.title,
      description: bug.description,
      status: bug.status,
      severity: bug.severity,
      priority: bug.priority,
      environment: bug.environment,
      projectId: bug.projectId,
      applicationId: bug.applicationId,
      testCaseId: bug.testCaseId,
      testCaseHumanId: bug.testCase?.testcaseId ?? null,
      testRunCaseId: bug.testRunCaseId,
      assignedTo: bug.assignedTo ? mapUser(bug.assignedTo) : null,
      createdBy: mapUser(bug.createdBy),
      tags,
      createdAt: bug.createdAt,
      updatedAt: bug.updatedAt,
    };
  }
}
