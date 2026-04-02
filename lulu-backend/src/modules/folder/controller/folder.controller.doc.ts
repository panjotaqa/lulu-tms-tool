import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const FolderControllerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Criar nova pasta' }),
      ApiResponse({
        status: 201,
        description: 'Pasta criada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Pasta de Testes',
            order: 1,
            isRoot: false,
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            parentFolderId: '123e4567-e89b-12d3-a456-426614174002',
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
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
        description: 'Projeto ou pasta pai não encontrada',
      }),
    ),

  updateTitle: () =>
    applyDecorators(
      ApiOperation({ summary: 'Renomear pasta' }),
      ApiParam({
        name: 'id',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pasta renomeada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Pasta Renomeada',
            order: 1,
            isRoot: false,
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            parentFolderId: '123e4567-e89b-12d3-a456-426614174002',
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Não é possível alterar o título da pasta ROOT',
      }),
      ApiResponse({
        status: 404,
        description: 'Pasta não encontrada',
      }),
    ),

  move: () =>
    applyDecorators(
      ApiOperation({ summary: 'Mover pasta (alterar pai e/ou ordem)' }),
      ApiParam({
        name: 'id',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pasta movida com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Pasta de Testes',
            order: 2,
            isRoot: false,
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            parentFolderId: '123e4567-e89b-12d3-a456-426614174004',
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 400,
        description:
          'Erro ao mover pasta (referência circular, pasta ROOT, etc)',
      }),
      ApiResponse({
        status: 404,
        description: 'Pasta não encontrada',
      }),
    ),

  reorder: () =>
    applyDecorators(
      ApiOperation({ summary: 'Reordenar pasta dentro do mesmo pai' }),
      ApiParam({
        name: 'id',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pasta reordenada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Pasta de Testes',
            order: 0,
            isRoot: false,
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            parentFolderId: '123e4567-e89b-12d3-a456-426614174002',
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Ordem inválida ou pasta ROOT',
      }),
      ApiResponse({
        status: 404,
        description: 'Pasta não encontrada',
      }),
    ),

  findByProject: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar todas as pastas de um projeto (estrutura hierárquica)',
      }),
      ApiParam({
        name: 'projectId',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174001',
      }),
      ApiResponse({
        status: 200,
        description: 'Lista de pastas retornada com sucesso',
        schema: {
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              title: 'ROOT',
              order: 0,
              isRoot: true,
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              parentFolderId: null,
              createdBy: {
                id: '123e4567-e89b-12d3-a456-426614174003',
                name: 'João Silva',
                email: 'joao.silva@example.com',
              },
              children: [
                {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  title: 'Pasta de Testes',
                  order: 1,
                  isRoot: false,
                  projectId: '123e4567-e89b-12d3-a456-426614174001',
                  parentFolderId: '123e4567-e89b-12d3-a456-426614174002',
                  createdBy: {
                    id: '123e4567-e89b-12d3-a456-426614174003',
                    name: 'João Silva',
                    email: 'joao.silva@example.com',
                  },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z',
                },
              ],
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Projeto não encontrado',
      }),
    ),

  getHierarchy: () =>
    applyDecorators(
      ApiOperation({ summary: 'Buscar hierarquia de uma pasta (breadcrumb)' }),
      ApiParam({
        name: 'id',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Hierarquia de pastas retornada com sucesso',
        schema: {
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              title: 'ROOT',
              order: 0,
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              parentFolderId: null,
              createdBy: {
                id: '123e4567-e89b-12d3-a456-426614174003',
                name: 'João Silva',
                email: 'joao.silva@example.com',
              },
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174004',
              title: 'Pasta Pai',
              order: 1,
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              parentFolderId: '123e4567-e89b-12d3-a456-426614174002',
              createdBy: {
                id: '123e4567-e89b-12d3-a456-426614174003',
                name: 'João Silva',
                email: 'joao.silva@example.com',
              },
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Pasta Atual',
              order: 2,
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              parentFolderId: '123e4567-e89b-12d3-a456-426614174004',
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
      }),
      ApiResponse({
        status: 404,
        description: 'Pasta não encontrada',
      }),
    ),
};
