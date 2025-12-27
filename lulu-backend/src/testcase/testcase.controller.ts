import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTestCaseDto } from './models/dto/create-testcase.dto';
import { CreateBulkTestCasesDto } from './models/dto/create-bulk-testcases.dto';
import { UpdateTestCaseDto } from './models/dto/update-testcase.dto';
import { QueryTestCaseDto } from './models/dto/query-testcase.dto';
import {
  BulkCreateTestCaseResponse,
  PaginatedTestCaseResponse,
  TestCaseResponse,
} from './models/types/testcase-response.type';
import { TestCaseService } from './testcase.service';

@ApiTags('testcases')
@Controller('testcases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo caso de teste' })
  @ApiResponse({
    status: 201,
    description: 'Caso de teste criado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Validar login com credenciais corretas',
        testSuiteId: '123e4567-e89b-12d3-a456-426614174001',
        testSuite: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Pasta de Testes',
        },
        severity: 'Major',
        status: 'Active',
        priority: 'High',
        type: 'Functional',
        isFlaky: false,
        milestone: 'v1.0',
        userStoryLink: 'https://jira.example.com/STORY-123',
        layer: 'E2E',
        environment: 'Integration',
        automationStatus: 'Manual',
        toBeAutomated: false,
        description: 'Este teste valida o fluxo de login...',
        preConditions: '1. Usuário deve estar cadastrado',
        steps: [
          'Given I am on the login page',
          'When I enter valid credentials',
          'Then I should be logged in',
        ],
        tags: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'UI',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async create(
    @Body() createTestCaseDto: CreateTestCaseDto,
    @CurrentUser() userId: string,
  ): Promise<TestCaseResponse> {
    return this.testCaseService.create(createTestCaseDto, userId);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar múltiplos casos de teste em massa' })
  @ApiResponse({
    status: 201,
    description: 'Casos de teste criados em massa com sucesso',
    schema: {
      example: {
        created: 3,
        failed: 0,
        total: 3,
        testCases: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Validar login com credenciais corretas',
            testSuiteId: '123e4567-e89b-12d3-a456-426614174001',
            testSuite: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              title: 'Pasta de Testes',
            },
            severity: 'Trivial',
            status: 'Active',
            priority: 'Medium',
            type: 'Functional',
            isFlaky: false,
            milestone: null,
            userStoryLink: null,
            layer: 'E2E',
            environment: 'Integration',
            automationStatus: 'Manual',
            toBeAutomated: false,
            description: null,
            preConditions: null,
            steps: null,
            tags: [],
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou nenhum título válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async createBulk(
    @Body() createBulkDto: CreateBulkTestCasesDto,
    @CurrentUser() userId: string,
  ): Promise<BulkCreateTestCaseResponse> {
    return this.testCaseService.createBulk(createBulkDto, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Editar caso de teste' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Caso de teste editado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        testcaseId: 'LULU-01',
        title: 'Validar login com credenciais corretas (atualizado)',
        testSuiteId: '123e4567-e89b-12d3-a456-426614174001',
        testSuite: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Pasta de Testes',
        },
        severity: 'Critical',
        status: 'Active',
        priority: 'High',
        type: 'Functional',
        isFlaky: false,
        milestone: 'v1.1',
        userStoryLink: 'https://jira.example.com/STORY-123',
        layer: 'E2E',
        environment: 'Integration',
        automationStatus: 'Manual',
        toBeAutomated: false,
        description: 'Este teste valida o fluxo de login atualizado...',
        preConditions: '1. Usuário deve estar cadastrado',
        steps: [
          'Given I am on the login page',
          'When I enter valid credentials',
          'Then I should be logged in',
        ],
        tags: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'UI',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Caso de teste ou pasta não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTestCaseDto,
  ): Promise<TestCaseResponse> {
    return this.testCaseService.update(id, updateDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Visualizar caso de teste por ID' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Caso de teste retornado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Validar login com credenciais corretas',
        testSuiteId: '123e4567-e89b-12d3-a456-426614174001',
        testSuite: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Pasta de Testes',
        },
        severity: 'Major',
        status: 'Active',
        priority: 'High',
        type: 'Functional',
        isFlaky: false,
        milestone: 'v1.0',
        userStoryLink: 'https://jira.example.com/STORY-123',
        layer: 'E2E',
        environment: 'Integration',
        automationStatus: 'Manual',
        toBeAutomated: false,
        description: 'Este teste valida o fluxo de login...',
        preConditions: '1. Usuário deve estar cadastrado',
        steps: [
          'Given I am on the login page',
          'When I enter valid credentials',
          'Then I should be logged in',
        ],
        tags: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'UI',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Caso de teste não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<TestCaseResponse> {
    return this.testCaseService.findOne(id);
  }

  @Get('folder/:folderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar casos de teste de uma pasta' })
  @ApiParam({
    name: 'folderId',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de casos de teste retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Validar login com credenciais corretas',
            testSuiteId: '123e4567-e89b-12d3-a456-426614174001',
            testSuite: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              title: 'Pasta de Testes',
            },
            severity: 'Major',
            status: 'Active',
            priority: 'High',
            type: 'Functional',
            isFlaky: false,
            milestone: 'v1.0',
            userStoryLink: 'https://jira.example.com/STORY-123',
            layer: 'E2E',
            environment: 'Integration',
            automationStatus: 'Manual',
            toBeAutomated: false,
            description: 'Este teste valida o fluxo de login...',
            preConditions: '1. Usuário deve estar cadastrado',
            steps: [
              'Given I am on the login page',
              'When I enter valid credentials',
              'Then I should be logged in',
            ],
            tags: [
              {
                id: '123e4567-e89b-12d3-a456-426614174002',
                name: 'UI',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
              },
            ],
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async findByFolder(
    @Param('folderId') folderId: string,
    @Query() queryDto: QueryTestCaseDto,
  ): Promise<PaginatedTestCaseResponse> {
    return this.testCaseService.findByFolder(folderId, queryDto);
  }
}

