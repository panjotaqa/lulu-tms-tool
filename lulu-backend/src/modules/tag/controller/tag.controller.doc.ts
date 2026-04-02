import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const TagControllerDocs = {
  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Buscar tags' }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Termo de busca para filtrar tags por nome',
        example: 'automação',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de tags retornada com sucesso',
        schema: {
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'automação',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'regressão',
            },
          ],
        },
      }),
    ),
};
