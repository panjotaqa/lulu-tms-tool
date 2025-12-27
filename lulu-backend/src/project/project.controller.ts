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
import { CreateProjectDto } from './models/dto/create-project.dto';
import { LinkUserDto } from './models/dto/link-user.dto';
import { QueryProjectDto } from './models/dto/query-project.dto';
import { UpdateProjectDto } from './models/dto/update-project.dto';
import {
  PaginatedProjectResponse,
  ProjectResponse,
} from './models/types/project-response.type';
import { ProjectService } from './project.service';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar novo projeto' })
  @ApiResponse({
    status: 201,
    description: 'Projeto criado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'João Silva',
            email: 'joao.silva@example.com',
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['Título é obrigatório', 'Slug é obrigatório'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Título ou slug já existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um projeto com este título',
        error: 'Conflict',
      },
    },
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() userId: string,
  ): Promise<ProjectResponse> {
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar projetos não arquivados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Projeto de Desenvolvimento',
            slug: 'projeto-desenvolvimento',
            description: 'Projeto para desenvolvimento de sistema de gestão',
            isArchived: false,
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            users: [],
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
  async findAll(
    @Query() queryDto: QueryProjectDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedProjectResponse> {
    return this.projectService.findAll(queryDto, userId);
  }

  @Get('archived')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar projetos arquivados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos arquivados retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Projeto Arquivado',
            slug: 'projeto-arquivado',
            description: 'Projeto arquivado',
            isArchived: true,
            createdBy: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'João Silva',
              email: 'joao.silva@example.com',
            },
            users: [],
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
  async findArchived(
    @Query() queryDto: QueryProjectDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedProjectResponse> {
    return this.projectService.findArchived(queryDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Projeto encontrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Projeto não encontrado',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Editar projeto' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Projeto editado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento Atualizado',
        slug: 'projeto-desenvolvimento-atualizado',
        description: 'Projeto atualizado',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [],
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
    description: 'Projeto não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Título ou slug já existe',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arquivar projeto' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Projeto arquivado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: true,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  async archive(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.archive(id);
  }

  @Patch(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desarquivar projeto' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Projeto desarquivado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  async unarchive(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.unarchive(id);
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vincular usuário ao projeto' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Usuário vinculado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'João Silva',
            email: 'joao.silva@example.com',
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Maria Santos',
            email: 'maria.santos@example.com',
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto ou usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já está vinculado ao projeto',
    schema: {
      example: {
        statusCode: 409,
        message: 'Usuário já está vinculado ao projeto',
        error: 'Conflict',
      },
    },
  })
  async linkUser(
    @Param('id') id: string,
    @Body() linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    return this.projectService.linkUser(id, linkUserDto);
  }

  @Delete(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desvincular usuário do projeto' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Usuário desvinculado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Projeto de Desenvolvimento',
        slug: 'projeto-desenvolvimento',
        description: 'Projeto para desenvolvimento de sistema de gestão',
        isArchived: false,
        createdBy: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao.silva@example.com',
        },
        users: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'João Silva',
            email: 'joao.silva@example.com',
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário não está vinculado ao projeto',
    schema: {
      example: {
        statusCode: 400,
        message: 'Usuário não está vinculado ao projeto',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto ou usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Projeto não encontrado',
        error: 'Not Found',
      },
    },
  })
  async unlinkUser(
    @Param('id') id: string,
    @Body() linkUserDto: LinkUserDto,
  ): Promise<ProjectResponse> {
    return this.projectService.unlinkUser(id, linkUserDto);
  }
}

