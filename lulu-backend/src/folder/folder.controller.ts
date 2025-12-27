import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateFolderDto } from './models/dto/create-folder.dto';
import { MoveFolderDto } from './models/dto/move-folder.dto';
import { ReorderFolderDto } from './models/dto/reorder-folder.dto';
import { UpdateFolderTitleDto } from './models/dto/update-folder-title.dto';
import {
  FolderResponse,
  FolderTreeResponse,
} from './models/types/folder-response.type';
import { FolderService } from './folder.service';

@ApiTags('folders')
@Controller('folders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova pasta' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto ou pasta pai não encontrada',
  })
  async create(
    @Body() createFolderDto: CreateFolderDto,
    @CurrentUser() userId: string,
  ): Promise<FolderResponse> {
    return this.folderService.create(createFolderDto, userId);
  }

  @Patch(':id/title')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renomear pasta' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível alterar o título da pasta ROOT',
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async updateTitle(
    @Param('id') id: string,
    @Body() updateDto: UpdateFolderTitleDto,
  ): Promise<FolderResponse> {
    return this.folderService.updateTitle(id, updateDto);
  }

  @Patch(':id/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mover pasta (alterar pai e/ou ordem)' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao mover pasta (referência circular, pasta ROOT, etc)',
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async move(
    @Param('id') id: string,
    @Body() moveDto: MoveFolderDto,
  ): Promise<FolderResponse> {
    return this.folderService.move(id, moveDto);
  }

  @Patch(':id/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reordenar pasta dentro do mesmo pai' })
  @ApiParam({ name: 'id', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Ordem inválida ou pasta ROOT',
  })
  @ApiResponse({
    status: 404,
    description: 'Pasta não encontrada',
  })
  async reorder(
    @Param('id') id: string,
    @Body() reorderDto: ReorderFolderDto,
  ): Promise<FolderResponse> {
    return this.folderService.reorder(id, reorderDto);
  }

  @Get('projects/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as pastas de um projeto (estrutura hierárquica)' })
  @ApiParam({ name: 'projectId', type: String, example: '123e4567-e89b-12d3-a456-426614174001' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  async findByProject(
    @Param('projectId') projectId: string,
  ): Promise<FolderTreeResponse> {
    return this.folderService.findByProject(projectId);
  }
}

