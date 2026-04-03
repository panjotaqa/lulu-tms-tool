import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const ApplicationControllerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Cadastrar nova aplicação',
        description:
          'Cria uma nova aplicação vinculada a um projeto. O nome deve ser único dentro do projeto.',
      }),
      ApiResponse({
        status: 201,
        description: 'Aplicação criada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Sistema de Vendas',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
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
        description: 'Projeto não encontrado',
      }),
      ApiResponse({
        status: 409,
        description: 'Já existe uma aplicação com este nome no projeto',
      }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar aplicações',
        description:
          'Lista todas as aplicações de um projeto específico. Requer projectId como query parameter.',
      }),
      ApiQuery({
        name: 'projectId',
        type: String,
        description: 'ID do projeto',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiQuery({
        name: 'page',
        type: Number,
        required: false,
        description: 'Número da página',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Quantidade de itens por página',
        example: 10,
      }),
      ApiResponse({
        status: 200,
        description: 'Lista de aplicações retornada com sucesso',
        schema: {
          example: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Sistema de Vendas',
                projectId: '123e4567-e89b-12d3-a456-426614174001',
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
      ApiOperation({
        summary: 'Buscar aplicação por ID',
        description: 'Retorna os detalhes de uma aplicação específica.',
      }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'ID da aplicação',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Aplicação encontrada',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Sistema de Vendas',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Aplicação não encontrada',
      }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Atualizar aplicação',
        description: 'Atualiza o nome de uma aplicação existente.',
      }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'ID da aplicação',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 200,
        description: 'Aplicação atualizada com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Sistema de Vendas Atualizado',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Aplicação não encontrada',
      }),
      ApiResponse({
        status: 409,
        description: 'Já existe uma aplicação com este nome no projeto',
      }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Deletar aplicação',
        description:
          'Remove uma aplicação. Não é possível deletar se a aplicação estiver sendo usada em casos de teste.',
      }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'ID da aplicação',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      ApiResponse({
        status: 204,
        description: 'Aplicação deletada com sucesso',
      }),
      ApiResponse({
        status: 400,
        description: 'Não é possível deletar aplicação em uso',
      }),
      ApiResponse({
        status: 404,
        description: 'Aplicação não encontrada',
      }),
    ),
};
