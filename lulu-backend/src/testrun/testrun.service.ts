import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { Project } from '../project/models/project.entity';
import { TestCase } from '../testcase/models/testcase.entity';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { CreateTestRunDto } from './models/dto/create-testrun.dto';
import { QueryTestRunDto } from './models/dto/query-testrun.dto';
import { UpdateTestRunCaseStatusDto } from './models/dto/update-testrun-case-status.dto';
import { TestRunCaseStatus } from './models/enums/testrun-case-status.enum';
import { TestRunStatus } from './models/enums/testrun-status.enum';
import { TestRun } from './models/testrun.entity';
import { TestRunCase } from './models/testrun-case.entity';
import {
  PaginatedTestRunListItemResponse,
  PaginatedTestRunResponse,
  TestRunCaseResponse,
  TestRunListItemResponse,
  TestRunResponse,
  TestRunStats,
} from './models/types/testrun-response.type';

@Injectable()
export class TestRunService {
  constructor(
    @InjectRepository(TestRun)
    private readonly testRunRepository: Repository<TestRun>,
    @InjectRepository(TestRunCase)
    private readonly testRunCaseRepository: Repository<TestRunCase>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createTestRunDto: CreateTestRunDto,
    userId: string,
  ): Promise<TestRunResponse> {
    this.debugLogger.debug('TestRunService', 'Criando nova Test Run', {
      title: createTestRunDto.title,
      projectId: createTestRunDto.projectId,
      testCaseIdsCount: createTestRunDto.testCaseIds?.length || 0,
      userId,
    });

    // Validar projeto existe
    const project = await this.projectRepository.findOne({
      where: { id: createTestRunDto.projectId },
      relations: ['users'],
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Validar que o usuário tem acesso ao projeto
    const isUserInProject =
      project.users.some((user) => user.id === userId) ||
      project.createdBy?.id === userId;

    if (!isUserInProject) {
      throw new BadRequestException(
        'Usuário não tem acesso a este projeto',
      );
    }

    // Validar defaultAssigneeId se fornecido
    if (createTestRunDto.defaultAssigneeId) {
      const defaultAssignee = await this.userService.findOne(
        createTestRunDto.defaultAssigneeId,
      );
      const isAssigneeInProject =
        project.users.some(
          (user) => user.id === createTestRunDto.defaultAssigneeId,
        ) || project.createdBy?.id === createTestRunDto.defaultAssigneeId;

      if (!isAssigneeInProject) {
        throw new BadRequestException(
          'Usuário atribuído por padrão não pertence ao projeto',
        );
      }
    }

    // Validar casos de teste (se fornecidos)
    const testCaseIds = createTestRunDto.testCaseIds || [];
    let testCases: TestCase[] = [];

    if (testCaseIds.length > 0) {
      testCases = await this.testCaseRepository.find({
        where: testCaseIds.map((id) => ({ id })),
        relations: [
          'testSuite',
          'testSuite.project',
          'createdBy',
          'testCaseTags',
          'testCaseTags.tag',
        ],
      });

      if (testCases.length !== testCaseIds.length) {
        throw new NotFoundException(
          'Um ou mais casos de teste não foram encontrados',
        );
      }

      // Validar que todos os casos de teste pertencem ao mesmo projeto
      const allInSameProject = testCases.every(
        (testCase) => testCase.testSuite.projectId === createTestRunDto.projectId,
      );

      if (!allInSameProject) {
        throw new BadRequestException(
          'Todos os casos de teste devem pertencer ao mesmo projeto',
        );
      }
    }

    // Buscar criador
    const creator = await this.userService.findOne(userId);

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar TestRun
      const testRun = queryRunner.manager.create(TestRun, {
        title: createTestRunDto.title,
        description: createTestRunDto.description,
        milestone: createTestRunDto.milestone || null,
        defaultAssigneeId: createTestRunDto.defaultAssigneeId || null,
        projectId: createTestRunDto.projectId,
        status: TestRunStatus.NOT_STARTED,
        createdById: userId,
        createdBy: creator as any,
      });

      const savedTestRun = await queryRunner.manager.save(TestRun, testRun);

      // Criar TestRunCases com snapshot JSON
      const testRunCases: TestRunCase[] = [];

      for (const testCase of testCases) {
        // Serializar TestCase completo para JSON
        const testCaseSnapshot = {
          id: testCase.id,
          testcaseId: testCase.testcaseId,
          title: testCase.title,
          testSuiteId: testCase.testSuiteId,
          testSuite: {
            id: testCase.testSuite.id,
            title: testCase.testSuite.title,
          },
          severity: testCase.severity,
          status: testCase.status,
          priority: testCase.priority,
          type: testCase.type,
          isFlaky: testCase.isFlaky,
          milestone: testCase.milestone,
          userStoryLink: testCase.userStoryLink,
          layer: testCase.layer,
          environment: testCase.environment,
          automationStatus: testCase.automationStatus,
          toBeAutomated: testCase.toBeAutomated,
          description: testCase.description,
          preConditions: testCase.preConditions,
          steps: testCase.steps,
          tags:
            testCase.testCaseTags?.map((testCaseTag) => ({
              id: testCaseTag.tag.id,
              name: testCaseTag.tag.name,
              createdAt: testCaseTag.tag.createdAt,
              updatedAt: testCaseTag.tag.updatedAt,
            })) || [],
          createdBy: {
            id: testCase.createdBy.id,
            name: testCase.createdBy.name,
            email: testCase.createdBy.email,
          },
          createdAt: testCase.createdAt,
          updatedAt: testCase.updatedAt,
        };

        const testRunCase = queryRunner.manager.create(TestRunCase, {
          testRunId: savedTestRun.id,
          testCaseId: testCase.id,
          assignedToId: createTestRunDto.defaultAssigneeId || null,
          status: TestRunCaseStatus.PENDING,
          testCaseSnapshot: testCaseSnapshot as object,
          snapshotCreatedAt: new Date(),
        });

        testRunCases.push(testRunCase);
      }

      await queryRunner.manager.save(TestRunCase, testRunCases);

      await queryRunner.commitTransaction();

      this.debugLogger.debug('TestRunService', 'Test Run criada com sucesso', {
        testRunId: savedTestRun.id,
        testRunCasesCount: testRunCases.length,
      });

      // Buscar TestRun completo para retornar
      return this.findOne(savedTestRun.id);
    } catch (error) {
      this.debugLogger.debug('TestRunService', 'Erro ao criar Test Run', {
        error: error instanceof Error ? error.message : String(error),
      });
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<TestRunResponse> {
    const testRun = await this.testRunRepository.findOne({
      where: { id },
      relations: [
        'project',
        'createdBy',
        'defaultAssignee',
        'testRunCases',
        'testRunCases.assignedTo',
      ],
    });

    if (!testRun) {
      throw new NotFoundException('Test Run não encontrada');
    }

    return this.mapToResponse(testRun);
  }

  async updateTestCaseStatus(
    testRunId: string,
    testRunCaseId: string,
    updateDto: UpdateTestRunCaseStatusDto,
  ): Promise<TestRunCaseResponse> {
    this.debugLogger.debug('TestRunService', 'Atualizando status do caso de teste', {
      testRunId,
      testRunCaseId,
      newStatus: updateDto.status,
    });

    // Verificar se TestRun existe
    const testRun = await this.testRunRepository.findOne({
      where: { id: testRunId },
    });

    if (!testRun) {
      throw new NotFoundException('Test Run não encontrada');
    }

    // Buscar TestRunCase e verificar se pertence ao TestRun
    const testRunCase = await this.testRunCaseRepository.findOne({
      where: { id: testRunCaseId },
      relations: ['assignedTo'],
    });

    if (!testRunCase) {
      throw new NotFoundException('Caso de teste não encontrado na execução');
    }

    if (testRunCase.testRunId !== testRunId) {
      throw new BadRequestException(
        'Caso de teste não pertence a esta execução de teste',
      );
    }

    // Atualizar status
    testRunCase.status = updateDto.status;
    const updatedTestRunCase = await this.testRunCaseRepository.save(testRunCase);

    // Mapear para resposta
    return {
      id: updatedTestRunCase.id,
      testRunId: updatedTestRunCase.testRunId,
      testCaseId: updatedTestRunCase.testCaseId,
      assignedToId: updatedTestRunCase.assignedToId,
      assignedTo: updatedTestRunCase.assignedTo
        ? {
            id: updatedTestRunCase.assignedTo.id,
            name: updatedTestRunCase.assignedTo.name,
            email: updatedTestRunCase.assignedTo.email,
          }
        : null,
      status: updatedTestRunCase.status,
      testCaseSnapshot: updatedTestRunCase.testCaseSnapshot,
      snapshotCreatedAt: updatedTestRunCase.snapshotCreatedAt,
      createdAt: updatedTestRunCase.createdAt,
      updatedAt: updatedTestRunCase.updatedAt,
    };
  }

  async findByProject(
    projectId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedTestRunResponse> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.testRunRepository
      .createQueryBuilder('testRun')
      .leftJoinAndSelect('testRun.project', 'project')
      .leftJoinAndSelect('testRun.createdBy', 'createdBy')
      .leftJoinAndSelect('testRun.defaultAssignee', 'defaultAssignee')
      .where('testRun.projectId = :projectId', { projectId })
      .orderBy('testRun.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const testRuns = await queryBuilder.skip(skip).take(limit).getMany();

    return {
      data: testRuns.map((testRun) => this.mapToResponse(testRun)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedTestRunResponse> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.testRunRepository
      .createQueryBuilder('testRun')
      .leftJoinAndSelect('testRun.project', 'project')
      .leftJoinAndSelect('testRun.createdBy', 'createdBy')
      .leftJoinAndSelect('testRun.defaultAssignee', 'defaultAssignee')
      .leftJoinAndSelect('testRun.testRunCases', 'testRunCases')
      .orderBy('testRun.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const testRuns = await queryBuilder.skip(skip).take(limit).getMany();

    return {
      data: testRuns.map((testRun) => this.mapToResponse(testRun)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllList(
    queryDto: QueryTestRunDto,
  ): Promise<PaginatedTestRunListItemResponse> {
    const { page = 1, limit = 10, projectId, status } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.testRunRepository
      .createQueryBuilder('testRun')
      .leftJoinAndSelect('testRun.createdBy', 'createdBy')
      .leftJoinAndSelect('testRun.testRunCases', 'testRunCases')
      .orderBy('testRun.createdAt', 'DESC');

    if (projectId) {
      queryBuilder.where('testRun.projectId = :projectId', { projectId });
    }

    if (status) {
      if (projectId) {
        queryBuilder.andWhere('testRun.status = :status', { status });
      } else {
        queryBuilder.where('testRun.status = :status', { status });
      }
    }

    const total = await queryBuilder.getCount();
    const testRuns = await queryBuilder.skip(skip).take(limit).getMany();

    // Calcular estatísticas para cada TestRun
    const listItems: TestRunListItemResponse[] = [];

    for (const testRun of testRuns) {
      const stats = this.calculateTestRunStats(testRun.testRunCases || []);
      listItems.push({
        id: testRun.id,
        title: testRun.title,
        status: testRun.status,
        author: {
          id: testRun.createdBy.id,
          name: testRun.createdBy.name,
          email: testRun.createdBy.email,
        },
        testRunStats: stats,
        createdAt: testRun.createdAt,
        updatedAt: testRun.updatedAt,
      });
    }

    return {
      data: listItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private calculateTestRunStats(testRunCases: TestRunCase[]): TestRunStats {
    const stats: TestRunStats = {
      total: testRunCases.length,
      passed: 0,
      failed: 0,
      blocked: 0,
      pending: 0,
      skipped: 0,
    };

    for (const testRunCase of testRunCases) {
      switch (testRunCase.status) {
        case TestRunCaseStatus.PASSED:
          stats.passed++;
          break;
        case TestRunCaseStatus.FAILED:
          stats.failed++;
          break;
        case TestRunCaseStatus.BLOCKED:
          stats.blocked++;
          break;
        case TestRunCaseStatus.PENDING:
          stats.pending++;
          break;
        case TestRunCaseStatus.SKIPPED:
          stats.skipped++;
          break;
      }
    }

    return stats;
  }

  private mapToResponse(testRun: TestRun): TestRunResponse {
    return {
      id: testRun.id,
      title: testRun.title,
      description: testRun.description,
      milestone: testRun.milestone,
      status: testRun.status,
      defaultAssigneeId: testRun.defaultAssigneeId,
      defaultAssignee: testRun.defaultAssignee
        ? {
            id: testRun.defaultAssignee.id,
            name: testRun.defaultAssignee.name,
            email: testRun.defaultAssignee.email,
          }
        : null,
      projectId: testRun.projectId,
      project: {
        id: testRun.project.id,
        title: testRun.project.title,
        slug: testRun.project.slug,
      },
      createdById: testRun.createdById,
      createdBy: {
        id: testRun.createdBy.id,
        name: testRun.createdBy.name,
        email: testRun.createdBy.email,
      },
      testRunCases:
        testRun.testRunCases?.map((testRunCase) => ({
          id: testRunCase.id,
          testRunId: testRunCase.testRunId,
          testCaseId: testRunCase.testCaseId,
          assignedToId: testRunCase.assignedToId,
          assignedTo: testRunCase.assignedTo
            ? {
                id: testRunCase.assignedTo.id,
                name: testRunCase.assignedTo.name,
                email: testRunCase.assignedTo.email,
              }
            : null,
          status: testRunCase.status,
          testCaseSnapshot: testRunCase.testCaseSnapshot,
          snapshotCreatedAt: testRunCase.snapshotCreatedAt,
          createdAt: testRunCase.createdAt,
          updatedAt: testRunCase.updatedAt,
        })) || [],
      createdAt: testRun.createdAt,
      updatedAt: testRun.updatedAt,
    };
  }
}

