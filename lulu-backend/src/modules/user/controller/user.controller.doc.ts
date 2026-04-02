import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const UserControllerDoc = {
  create: () => {
    return applyDecorators(
      ApiOperation({ summary: 'Cadastrar novo usuário' }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Usuário criado com sucesso',
        schema: {
          example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'João Silva',
            email: 'joao.silva@example.com',
            createdAt: '2026-04-02T17:00:00.000Z',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados de entrada inválidos',
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'E-mail já cadastrado no sistema',
      }),
    );
  },
};
