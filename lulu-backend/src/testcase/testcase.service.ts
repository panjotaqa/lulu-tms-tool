import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { Folder } from '../folder/models/folder.entity';
import { Tag } from '../tag/models/tag.entity';
import { TagService } from '../tag/tag.service';
import { UserService } from '../user/user.service';
import { CreateTestCaseDto } from './models/dto/create-testcase.dto';
import { CreateBulkTestCasesDto } from './models/dto/create-bulk-testcases.dto';
import { UpdateTestCaseDto } from './models/dto/update-testcase.dto';
import { QueryTestCaseDto } from './models/dto/query-testcase.dto';
import { TestCase } from './models/testcase.entity';
import { TestCaseTag } from './models/testcase-tag.entity';
import { AutomationStatus } from './models/enums/automation-status.enum';
import { Environment } from './models/enums/environment.enum';
import { Layer } from './models/enums/layer.enum';
import { Priority } from './models/enums/priority.enum';
import { Severity } from './models/enums/severity.enum';
import { Status } from './models/enums/status.enum';
import { TestType } from './models/enums/test-type.enum';
import {
  BulkCreateTestCaseResponse,
  PaginatedTestCaseResponse,
  TestCaseResponse,
} from './models/types/testcase-response.type';

@Injectable()
export class TestCaseService {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
    @InjectRepository(TestCaseTag)
    private readonly testCaseTagRepository: Repository<TestCaseTag>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createTestCaseDto: CreateTestCaseDto,
    userId: string,
  ): Promise<TestCaseResponse> {
    this.debugLogger.debug('TestCaseService', 'Criando novo caso de teste', {
      title: createTestCaseDto.title,
      testSuiteId: createTestCaseDto.testSuiteId,
      userId,
    });

    // Validar que a pasta existe e buscar o projeto
    const folder = await this.folderRepository.findOne({
      where: { id: createTestCaseDto.testSuiteId },
      relations: ['project'],
    });
    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }
    if (!folder.project) {
      throw new NotFoundException('Projeto não encontrado para esta pasta');
    }

    // Buscar criador
    const creator = await this.userService.findOne(userId);
    if (!creator) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar tags se fornecidas
      let tags: Tag[] = [];
      if (createTestCaseDto.tags && createTestCaseDto.tags.length > 0) {
        tags = await this.tagService.findOrCreateManyByNames(
          createTestCaseDto.tags,
        );
      }

      // Gerar testcaseId: SLUG-01, SLUG-02, etc.
      const projectSlug = folder.project.slug.toUpperCase();
      const countResult = await queryRunner.manager
        .createQueryBuilder(TestCase, 'tc')
        .innerJoin('tc.testSuite', 'folder')
        .innerJoin('folder.project', 'project')
        .where('project.id = :projectId', { projectId: folder.projectId })
        .getCount();
      const nextNumber = countResult + 1;
      const testcaseId = `${projectSlug}-${String(nextNumber).padStart(2, '0')}`;

      // Criar caso de teste
      const testCase = queryRunner.manager.create(TestCase, {
        testcaseId,
        title: createTestCaseDto.title,
        testSuiteId: createTestCaseDto.testSuiteId,
        severity: createTestCaseDto.severity || Severity.TRIVIAL,
        status: createTestCaseDto.status || Status.ACTIVE,
        priority: createTestCaseDto.priority || Priority.MEDIUM,
        type: createTestCaseDto.type || TestType.FUNCTIONAL,
        isFlaky: createTestCaseDto.isFlaky ?? false,
        milestone: createTestCaseDto.milestone || null,
        userStoryLink: createTestCaseDto.userStoryLink || null,
        layer: createTestCaseDto.layer || Layer.E2E,
        environment: createTestCaseDto.environment || Environment.INTEGRATION,
        automationStatus:
          createTestCaseDto.automationStatus || AutomationStatus.MANUAL,
        toBeAutomated: createTestCaseDto.toBeAutomated ?? false,
        description: createTestCaseDto.description || null,
        preConditions: createTestCaseDto.preConditions || null,
        steps: createTestCaseDto.steps || null,
        createdById: userId,
        createdBy: creator as any,
      });

      const savedTestCase = await queryRunner.manager.save(TestCase, testCase);

      // Criar relacionamentos com tags
      if (tags.length > 0) {
        const testCaseTags = tags.map((tag) =>
          queryRunner.manager.create(TestCaseTag, {
            testCaseId: savedTestCase.id,
            tagId: tag.id,
          }),
        );
        await queryRunner.manager.save(TestCaseTag, testCaseTags);
      }

      await queryRunner.commitTransaction();

      this.debugLogger.debug(
        'TestCaseService',
        'Caso de teste criado com sucesso',
        {
          id: savedTestCase.id,
        },
      );

      // Buscar caso de teste com relações para retornar
      return this.findOne(savedTestCase.id);
    } catch (error) {
      this.debugLogger.debug(
        'TestCaseService',
        'Erro ao criar caso de teste',
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateDto: UpdateTestCaseDto,
  ): Promise<TestCaseResponse> {
    this.debugLogger.debug('TestCaseService', 'Atualizando caso de teste', {
      id,
      updateDto,
    });

    // Buscar caso de teste existente
    const testCase = await this.testCaseRepository.findOne({
      where: { id },
      relations: ['testSuite', 'testCaseTags', 'testCaseTags.tag'],
    });

    if (!testCase) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    // Validar pasta se testSuiteId for fornecido
    if (updateDto.testSuiteId) {
      const folder = await this.folderRepository.findOne({
        where: { id: updateDto.testSuiteId },
      });
      if (!folder) {
        throw new NotFoundException('Pasta não encontrada');
      }
    }

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualizar campos fornecidos
      if (updateDto.title !== undefined) {
        testCase.title = updateDto.title;
      }
      if (updateDto.testSuiteId !== undefined) {
        testCase.testSuiteId = updateDto.testSuiteId;
      }
      if (updateDto.severity !== undefined) {
        testCase.severity = updateDto.severity;
      }
      if (updateDto.status !== undefined) {
        testCase.status = updateDto.status;
      }
      if (updateDto.priority !== undefined) {
        testCase.priority = updateDto.priority;
      }
      if (updateDto.type !== undefined) {
        testCase.type = updateDto.type;
      }
      if (updateDto.isFlaky !== undefined) {
        testCase.isFlaky = updateDto.isFlaky;
      }
      if (updateDto.milestone !== undefined) {
        testCase.milestone = updateDto.milestone;
      }
      if (updateDto.userStoryLink !== undefined) {
        testCase.userStoryLink = updateDto.userStoryLink;
      }
      if (updateDto.layer !== undefined) {
        testCase.layer = updateDto.layer;
      }
      if (updateDto.environment !== undefined) {
        testCase.environment = updateDto.environment;
      }
      if (updateDto.automationStatus !== undefined) {
        testCase.automationStatus = updateDto.automationStatus;
      }
      if (updateDto.toBeAutomated !== undefined) {
        testCase.toBeAutomated = updateDto.toBeAutomated;
      }
      if (updateDto.description !== undefined) {
        testCase.description = updateDto.description;
      }
      if (updateDto.preConditions !== undefined) {
        testCase.preConditions = updateDto.preConditions;
      }
      if (updateDto.steps !== undefined) {
        testCase.steps = updateDto.steps;
      }

      // Salvar caso de teste atualizado
      const updatedTestCase = await queryRunner.manager.save(TestCase, testCase);

      // Gerenciar tags se fornecido
      if (updateDto.tags !== undefined) {
        // Remover relacionamentos antigos
        await queryRunner.manager.delete(TestCaseTag, {
          testCaseId: id,
        });

        // Criar novos relacionamentos se houver tags
        if (updateDto.tags.length > 0) {
          const tags = await this.tagService.findOrCreateManyByNames(
            updateDto.tags,
          );

          if (tags.length > 0) {
            const testCaseTags = tags.map((tag) =>
              queryRunner.manager.create(TestCaseTag, {
                testCaseId: id,
                tagId: tag.id,
              }),
            );
            await queryRunner.manager.save(TestCaseTag, testCaseTags);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.debugLogger.debug(
        'TestCaseService',
        'Caso de teste atualizado com sucesso',
        {
          id: updatedTestCase.id,
        },
      );

      // Buscar caso de teste atualizado com relações
      return this.findOne(updatedTestCase.id);
    } catch (error) {
      this.debugLogger.debug(
        'TestCaseService',
        'Erro ao atualizar caso de teste',
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createBulk(
    createBulkDto: CreateBulkTestCasesDto,
    userId: string,
  ): Promise<BulkCreateTestCaseResponse> {
    this.debugLogger.debug('TestCaseService', 'Criando casos de teste em massa', {
      titlesCount: createBulkDto.titles.length,
      testSuiteId: createBulkDto.testSuiteId,
      userId,
    });

    // Validar que a pasta existe e buscar o projeto
    const folder = await this.folderRepository.findOne({
      where: { id: createBulkDto.testSuiteId },
      relations: ['project'],
    });
    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }
    if (!folder.project) {
      throw new NotFoundException('Projeto não encontrado para esta pasta');
    }

    // Buscar criador
    const creator = await this.userService.findOne(userId);
    if (!creator) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Filtrar e normalizar títulos
    const validTitles = createBulkDto.titles
      .map((title) => title.trim())
      .filter((title) => title.length > 0);

    if (validTitles.length === 0) {
      throw new BadRequestException(
        'Nenhum título válido fornecido. Títulos não podem estar vazios.',
      );
    }

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createdTestCases: TestCaseResponse[] = [];
    let failedCount = 0;

    const savedTestCaseIds: string[] = [];
    const projectSlug = folder.project.slug.toUpperCase();

    // Obter contagem inicial de casos de teste do projeto
    const initialCount = await queryRunner.manager
      .createQueryBuilder(TestCase, 'tc')
      .innerJoin('tc.testSuite', 'folder')
      .innerJoin('folder.project', 'project')
      .where('project.id = :projectId', { projectId: folder.projectId })
      .getCount();

    try {
      let sequenceNumber = initialCount;
      for (const title of validTitles) {
        try {
          sequenceNumber++;
          const testcaseId = `${projectSlug}-${String(sequenceNumber).padStart(2, '0')}`;

          // Criar caso de teste com valores padrão
          const testCase = queryRunner.manager.create(TestCase, {
            testcaseId,
            title,
            testSuiteId: createBulkDto.testSuiteId,
            severity: Severity.TRIVIAL,
            status: Status.ACTIVE,
            priority: Priority.MEDIUM,
            type: TestType.FUNCTIONAL,
            isFlaky: false,
            milestone: null,
            userStoryLink: null,
            layer: Layer.E2E,
            environment: Environment.INTEGRATION,
            automationStatus: AutomationStatus.MANUAL,
            toBeAutomated: false,
            description: null,
            preConditions: null,
            steps: null,
            createdById: userId,
            createdBy: creator as any,
          });

          const savedTestCase = await queryRunner.manager.save(TestCase, testCase);
          savedTestCaseIds.push(savedTestCase.id);
        } catch (error) {
          this.debugLogger.debug('TestCaseService', 'Erro ao criar caso de teste', {
            title,
            error: error instanceof Error ? error.message : String(error),
          });
          failedCount++;
        }
      }

      await queryRunner.commitTransaction();

      // Buscar casos de teste criados após o commit
      for (const id of savedTestCaseIds) {
        try {
          const testCaseResponse = await this.findOne(id);
          createdTestCases.push(testCaseResponse);
        } catch (error) {
          this.debugLogger.debug('TestCaseService', 'Erro ao buscar caso de teste criado', {
            id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      this.debugLogger.debug('TestCaseService', 'Casos de teste criados em massa', {
        created: createdTestCases.length,
        failed: failedCount,
        total: validTitles.length,
      });

      return {
        created: createdTestCases.length,
        failed: failedCount,
        total: validTitles.length,
        testCases: createdTestCases,
      };
    } catch (error) {
      this.debugLogger.debug('TestCaseService', 'Erro ao criar casos de teste em massa', {
        error: error instanceof Error ? error.message : String(error),
      });
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<TestCaseResponse> {
    const testCase = await this.testCaseRepository.findOne({
      where: { id },
      relations: ['testSuite', 'createdBy', 'testCaseTags', 'testCaseTags.tag'],
      select: {
        id: true,
        testcaseId: true,
        title: true,
        testSuiteId: true,
        severity: true,
        status: true,
        priority: true,
        type: true,
        isFlaky: true,
        milestone: true,
        userStoryLink: true,
        layer: true,
        environment: true,
        automationStatus: true,
        toBeAutomated: true,
        description: true,
        preConditions: true,
        steps: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        testSuite: {
          id: true,
          title: true,
        },
        createdBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!testCase) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    return this.mapToResponse(testCase);
  }

  async findByFolder(
    folderId: string,
    queryDto: QueryTestCaseDto,
  ): Promise<PaginatedTestCaseResponse> {
    const { page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.testCaseRepository
      .createQueryBuilder('testCase')
      .leftJoinAndSelect('testCase.testSuite', 'testSuite')
      .leftJoinAndSelect('testCase.createdBy', 'createdBy')
      .leftJoinAndSelect('testCase.testCaseTags', 'testCaseTags')
      .leftJoinAndSelect('testCaseTags.tag', 'tag')
      .where('testCase.testSuiteId = :folderId', { folderId })
      .orderBy('testCase.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const testCases = await queryBuilder.skip(skip).take(limit).getMany();

    return {
      data: testCases.map((testCase) => this.mapToResponse(testCase)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapToResponse(testCase: TestCase): TestCaseResponse {
    return {
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
  }
}

