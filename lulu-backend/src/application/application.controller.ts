import {
  Body,
  Controller,
  Delete,
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
import { CreateApplicationDto } from './models/dto/create-application.dto';
import { QueryApplicationDto } from './models/dto/query-application.dto';
import { UpdateApplicationDto } from './models/dto/update-application.dto';
import {
  ApplicationResponse,
  PaginatedApplicationResponse,
} from './models/types/application-response.type';
import { ApplicationService } from './application.service';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar nova aplicação',
    description:
      'Cria uma nova aplicação vinculada a um projeto. O nome deve ser único dentro do projeto.',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma aplicação com este nome no projeto',
  })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.create(createApplicationDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar aplicações',
    description:
      'Lista todas as aplicações de um projeto específico. Requer projectId como query parameter.',
  })
  @ApiQuery({
    name: 'projectId',
    type: String,
    description: 'ID do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  async findAll(
    @Query() queryDto: QueryApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedApplicationResponse> {
    return this.applicationService.findAll(queryDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar aplicação por ID',
    description: 'Retorna os detalhes de uma aplicação específica.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da aplicação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: 'Aplicação não encontrada',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.findOne(id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar aplicação',
    description: 'Atualiza o nome de uma aplicação existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da aplicação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: 'Aplicação não encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma aplicação com este nome no projeto',
  })
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @CurrentUser() userId: string,
  ): Promise<ApplicationResponse> {
    return this.applicationService.update(id, updateApplicationDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar aplicação',
    description:
      'Remove uma aplicação. Não é possível deletar se a aplicação estiver sendo usada em casos de teste.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da aplicação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Aplicação deletada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar aplicação em uso',
  })
  @ApiResponse({
    status: 404,
    description: 'Aplicação não encontrada',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.applicationService.remove(id, userId);
  }
}

