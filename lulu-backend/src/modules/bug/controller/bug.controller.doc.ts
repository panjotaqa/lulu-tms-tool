import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

const bugExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  bugId: 'LULU-BUG-01',
  title: 'Botão de login não responde',
  description: 'Ao clicar em entrar, nada acontece',
  status: 'Open',
  severity: 'Major',
  priority: 'High',
  environment: 'Integration',
  projectId: '123e4567-e89b-12d3-a456-426614174001',
  applicationId: null,
  testCaseId: null,
  testCaseHumanId: null,
  testRunCaseId: null,
  assignedTo: null,
  createdBy: {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'João Silva',
    email: 'joao.silva@example.com',
  },
  tags: [{ id: '123e4567-e89b-12d3-a456-426614174003', name: 'UI' }],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const BugControllerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Cadastrar novo bug',
        description:
          'Cria um bug vinculado a um projeto. Gera bugId automaticamente (ex: LULU-BUG-01).',
      }),
      ApiResponse({ status: 201, description: 'Bug criado com sucesso', schema: { example: bugExample } }),
      ApiResponse({ status: 400, description: 'Dados inválidos ou vínculo de outro projeto' }),
      ApiResponse({ status: 404, description: 'Projeto ou recurso vinculado não encontrado' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar bugs',
        description: 'Lista bugs de um projeto com paginação e filtros opcionais.',
      }),
      ApiQuery({ name: 'projectId', type: String, required: true }),
      ApiQuery({ name: 'page', type: Number, required: false }),
      ApiQuery({ name: 'limit', type: Number, required: false }),
      ApiQuery({ name: 'status', required: false }),
      ApiQuery({ name: 'severity', required: false }),
      ApiQuery({ name: 'priority', required: false }),
      ApiQuery({ name: 'assignedToId', required: false }),
      ApiQuery({ name: 'search', required: false }),
      ApiResponse({
        status: 200,
        schema: {
          example: {
            data: [bugExample],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      }),
      ApiResponse({ status: 404, description: 'Projeto não encontrado' }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Buscar bug por ID' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, schema: { example: bugExample } }),
      ApiResponse({ status: 404, description: 'Bug não encontrado' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Atualizar bug' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, schema: { example: bugExample } }),
      ApiResponse({ status: 400, description: 'Dados inválidos' }),
      ApiResponse({ status: 404, description: 'Bug não encontrado' }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remover bug' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 204, description: 'Bug removido com sucesso' }),
      ApiResponse({ status: 404, description: 'Bug não encontrado' }),
    ),
};
