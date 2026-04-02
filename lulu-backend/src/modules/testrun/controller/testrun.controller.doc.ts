import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const TestRunControllerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Criar nova execução de teste' }),
      ApiResponse({
        status: 201,
        description: 'Execução de teste criada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test Run - Sprint 1',
            description:
              'Execução de testes para validação da funcionalidade de login',
            milestone: 'v1.0',
            defaultAssigneeId: '123e4567-e89b-12d3-a456-426614174001',
            defaultAssignee: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            projectId: '123e4567-e89b-12d3-a456-426614174002',
            project: {
              id: '123e4567-e89b-12d3-a456-426614174002',
              title: 'Projeto de Desenvolvimento',
              slug: 'projeto-desenvolvimento',
            },
            createdById: '123e4567-e89b-12d3-a456-426614174003',
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'Maria Santos',
              email: 'maria.santos@example.com',
            },
            testRunCases: [
              {
                id: '123e4567-e89b-12d3-a456-426614174004',
                testRunId: '123e4567-e89b-12d3-a456-426614174000',
                testCaseId: '123e4567-e89b-12d3-a456-426614174005',
                assignedToId: '123e4567-e89b-12d3-a456-426614174001',
                assignedTo: {
                  id: '123e4567-e89b-12d3-a456-426614174001',
                  name: 'João Silva',
                  email: 'joao.silva@example.com',
                },
                testCaseSnapshot: {
                  id: '123e4567-e89b-12d3-a456-426614174005',
                  testcaseId: 'LULU-01',
                  title: 'Validar login com credenciais corretas',
                  description: 'Este teste valida o fluxo de login...',
                },
                snapshotCreatedAt: '2024-01-01T00:00:00.000Z',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Dados inválidos',
      }),
      ApiResponse({
        status: 404,
        description: 'Projeto ou caso de teste não encontrado',
      }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Listar execuções de teste com estatísticas' }),
      ApiResponse({
        status: 200,
        description: 'Lista de execuções de teste retornada com sucesso',
        schema: {
          example: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Test Run - Sprint 1',
                status: 'In Progress',
                author: {
                  id: '123e4567-e89b-12d3-a456-426614174003',
                  name: 'Maria Santos',
                  email: 'maria.santos@example.com',
                },
                testRunStats: {
                  total: 10,
                  passed: 5,
                  failed: 2,
                  blocked: 1,
                  pending: 2,
                  skipped: 0,
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
      }),
    ),

  findByProject: () =>
    applyDecorators(
      ApiOperation({ summary: 'Listar execuções de teste de um projeto' }),
      ApiParam({
        name: 'projectId',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
      ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
      ApiQuery({
        name: 'status',
        required: false,
        enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
        example: 'In Progress',
      }),
      ApiResponse({
        status: 200,
        description: 'Lista de execuções de teste do projeto retornada com sucesso',
        schema: {
          example: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Test Run - Sprint 1',
                status: 'In Progress',
                author: {
                  id: '123e4567-e89b-12d3-a456-426614174003',
                  name: 'Maria Santos',
                  email: 'maria.santos@example.com',
                },
                testRunStats: {
                  total: 10,
                  passed: 5,
                  failed: 2,
                  blocked: 1,
                  pending: 2,
                  skipped: 0,
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
      }),
      ApiResponse({
        status: 404,
        description: 'Projeto não encontrado',
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Visualizar execução de teste por ID' }),
      ApiParam({
        name: 'id',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Execução de teste retornada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test Run - Sprint 1',
            description:
              'Execução de testes para validação da funcionalidade de login',
            milestone: 'v1.0',
            defaultAssigneeId: '123e4567-e89b-12d3-a456-426614174001',
            projectId: '123e4567-e89b-12d3-a456-426614174002',
            createdById: '123e4567-e89b-12d3-a456-426614174003',
            testRunCases: [],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Execução de teste não encontrada',
      }),
    ),

  updateTestCaseStatus: () =>
    applyDecorators(
      ApiOperation({ summary: 'Atualizar status de um caso de teste na execução' }),
      ApiParam({
        name: 'testRunId',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiParam({
        name: 'testRunCaseId',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174001',
      }),
      ApiResponse({
        status: 200,
        description: 'Status do caso de teste atualizado com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            testRunId: '123e4567-e89b-12d3-a456-426614174000',
            testCaseId: '123e4567-e89b-12d3-a456-426614174002',
            assignedToId: '123e4567-e89b-12d3-a456-426614174003',
            assignedTo: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            status: 'Passed',
            testCaseSnapshot: {
              id: '123e4567-e89b-12d3-a456-426614174002',
              testcaseId: 'LULU-01',
              title: 'Validar login com credenciais corretas',
            },
            snapshotCreatedAt: '2024-01-01T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Dados inválidos ou caso de teste não pertence à execução',
      }),
      ApiResponse({
        status: 404,
        description: 'Test Run ou caso de teste não encontrado',
      }),
    ),

  updateTestCaseEvidence: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Atualizar evidências de um caso de teste',
        description:
          'Atualiza as evidências (texto em Markdown) de um caso de teste na execução. As evidências podem incluir texto formatado e referências a imagens.',
      }),
      ApiParam({
        name: 'testRunCaseId',
        type: String,
        description: 'ID do caso de teste na execução',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Evidências atualizadas com sucesso',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            testRunId: { type: 'string' },
            testCaseId: { type: 'string' },
            assignedToId: { type: 'string', nullable: true },
            assignedTo: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
            status: { type: 'string' },
            testCaseSnapshot: { type: 'object' },
            snapshotCreatedAt: { type: 'string', format: 'date-time' },
            evidence: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Dados inválidos ou caso de teste não pertence à execução',
      }),
      ApiResponse({
        status: 404,
        description: 'Caso de teste não encontrado',
      }),
    ),
};
