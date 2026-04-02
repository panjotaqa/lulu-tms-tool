import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DebugLoggerService } from '@/modules/core/logger/debug-logger.service';
import type { IProjectService } from '@/modules/project/service/project.service.interface';
import type { IUserService } from '@/modules/user/service/user.service.interface';
import { CreateFolderDto } from '../models/dto/create-folder.dto';
import { MoveFolderDto } from '../models/dto/move-folder.dto';
import { ReorderFolderDto } from '../models/dto/reorder-folder.dto';
import { UpdateFolderTitleDto } from '../models/dto/update-folder-title.dto';
import { Folder } from '../models/entity/folder.entity';
import type { IFolderRepository } from '../repository/folder.repository.interface';
import {
  FolderResponse,
  FolderTreeResponse,
} from '../models/types/folder-response.type';
import { IFolderService } from './folder.service.interface';

@Injectable()
export class FolderService implements IFolderService {
  constructor(
    @Inject('IFolderRepository')
    private readonly folderRepository: IFolderRepository,
    @Inject('IProjectService')
    private readonly projectService: IProjectService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    private readonly dataSource: DataSource,
    private readonly debugLogger: DebugLoggerService,
  ) {}

  async create(
    createFolderDto: CreateFolderDto,
    userId: string,
  ): Promise<FolderResponse> {
    this.debugLogger.debug('FolderService', 'Criando nova pasta', {
      title: createFolderDto.title,
      projectId: createFolderDto.projectId,
      parentFolderId: createFolderDto.parentFolderId,
      userId,
    });

    // Validar projeto existe
    await this.projectService.findOne(createFolderDto.projectId);

    // Validar pasta pai se fornecida
    let parentFolderId: string | null = null;
    if (createFolderDto.parentFolderId) {
      const parentFolder = await this.folderRepository.findOne({
        where: { id: createFolderDto.parentFolderId },
        select: ['id', 'projectId'],
      });
      if (!parentFolder) {
        throw new NotFoundException('Pasta pai não encontrada');
      }
      if (parentFolder.projectId !== createFolderDto.projectId) {
        throw new BadRequestException(
          'Pasta pai deve pertencer ao mesmo projeto',
        );
      }
      parentFolderId = parentFolder.id;
    }

    try {
      // Buscar criador
      const creator = await this.userService.findOne(userId);

      // Criar pasta usando método transacional do repositório
      const savedFolder = await this.folderRepository.createFolderWithPosition(
        createFolderDto.title,
        createFolderDto.projectId,
        parentFolderId,
        userId,
        creator,
      );

      this.debugLogger.debug('FolderService', 'Pasta criada com sucesso', {
        id: savedFolder.id,
        position: savedFolder.position,
      });

      // Buscar pasta com relações para retornar
      const folderWithRelations = await this.folderRepository.findOne({
        where: { id: savedFolder.id },
        relations: ['createdBy'],
        select: {
          id: true,
          title: true,
          position: true,
          projectId: true,
          parentFolderId: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            id: true,
            name: true,
            email: true,
          },
        },
      });

      if (!folderWithRelations) {
        throw new NotFoundException('Pasta não encontrada após criação');
      }

      return this.mapToResponse(folderWithRelations);
    } catch (error) {
      this.debugLogger.debug('FolderService', 'Erro ao criar pasta', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async updateTitle(
    id: string,
    updateDto: UpdateFolderTitleDto,
  ): Promise<FolderResponse> {
    const folder = await this.folderRepository.findOne({ where: { id } });
    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }
    folder.title = updateDto.title;
    const updatedFolder = await this.folderRepository.save(folder);
    const folderWithRelations = await this.folderRepository.findOne({
      where: { id: updatedFolder.id },
      relations: ['createdBy'],
    });
    return this.mapToResponse(folderWithRelations);
  }

  async move(id: string, moveDto: MoveFolderDto): Promise<FolderResponse> {
    this.debugLogger.debug(
      'FolderService',
      `Iniciando movimentação de pasta: ${id}`,
      {
        targetParentId: moveDto.targetParentId,
        newPosition: moveDto.newPosition,
      },
    );

    try {
      // Buscar pasta a ser movida para validações iniciais
      const folder = await this.folderRepository.findOne({
        where: { id },
        select: ['id', 'title', 'position', 'projectId', 'parentFolderId'],
      });

      if (!folder) {
        throw new NotFoundException('Pasta não encontrada');
      }

      // Determinar novo pai e validar
      let newParentId: string | null = folder.parentFolderId;
      if (moveDto.targetParentId !== undefined) {
        newParentId = moveDto.targetParentId;

        if (newParentId === folder.id) {
          throw new BadRequestException('Pasta não pode ser filha de si mesma');
        }

        if (newParentId !== null) {
          const targetParent = await this.folderRepository.findOne({
            where: { id: newParentId },
            select: ['id', 'projectId'],
          });

          if (!targetParent) {
            throw new NotFoundException('Pasta pai de destino não encontrada');
          }

          if (targetParent.projectId !== folder.projectId) {
            throw new BadRequestException(
              'Pasta pai de destino deve pertencer ao mesmo projeto',
            );
          }

          // Verificar descendência sem transaction específica (a transação ocorre só na escrita)
          const isDescendant = await this.folderRepository.isDescendant(
            folder.id,
            newParentId,
          );
          if (isDescendant) {
            throw new BadRequestException(
              'Pasta não pode ser filha de seus descendentes',
            );
          }
        }
      }

      if (moveDto.newPosition < 0) {
        throw new BadRequestException('Posição deve ser maior ou igual a 0');
      }

      // Repassar re-ranking e transação para o Repository
      await this.folderRepository.moveFolderWithReordering(
        folder.id,
        newParentId,
        moveDto.newPosition,
      );

      this.debugLogger.debug('FolderService', 'Pasta movida com sucesso');

      // Buscar pasta atualizada com relações
      const folderWithRelations = await this.folderRepository.findOne({
        where: { id: folder.id },
        relations: ['createdBy'],
        select: {
          id: true,
          title: true,
          position: true,
          projectId: true,
          parentFolderId: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            id: true,
            name: true,
            email: true,
          },
        },
      });

      if (!folderWithRelations) {
        throw new NotFoundException('Pasta não encontrada após movimentação');
      }

      return this.mapToResponse(folderWithRelations);
    } catch (error) {
      this.debugLogger.debug('FolderService', 'Erro ao mover pasta', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async reorder(
    id: string,
    reorderDto: ReorderFolderDto,
  ): Promise<FolderResponse> {
    // Reorder usa move() mantendo o mesmo pai
    const folder = await this.folderRepository.findOne({
      where: { id },
      select: ['id', 'parentFolderId'],
    });

    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }

    // Usar move() para reordenar (mantém o mesmo pai, apenas muda a posição)
    return this.move(id, {
      targetParentId: folder.parentFolderId ?? null,
      newPosition: reorderDto.newOrder,
    });
  }

  async findByProject(projectId: string): Promise<FolderTreeResponse> {
    await this.projectService.findOne(projectId);

    // Buscar todas as pastas do projeto ordenadas por parentFolderId e position
    const allFolders = await this.folderRepository.findTreeByProject(projectId);

    if (allFolders.length === 0) {
      return [];
    }

    // Construir mapa de pastas por parentId
    const foldersByParent = new Map<string | null, Folder[]>();
    allFolders.forEach((folder) => {
      const parentId = folder.parentFolderId;
      if (!foldersByParent.has(parentId)) {
        foldersByParent.set(parentId, []);
      }
      foldersByParent.get(parentId)!.push(folder);
    });

    // Função para construir árvore recursivamente
    const buildTree = (parentId: string | null): FolderResponse[] => {
      const children = foldersByParent.get(parentId) || [];
      return children.map((folder) => {
        const response = this.mapToResponse(folder);
        response.order = folder.position; // Usar position como order
        const subChildren = buildTree(folder.id);
        if (subChildren.length > 0) {
          response.children = subChildren;
        }
        return response;
      });
    };

    // Construir árvore a partir das pastas raiz (parentFolderId IS NULL)
    return buildTree(null);
  }

  async getFolderHierarchy(folderId: string): Promise<FolderResponse[]> {
    this.debugLogger.debug('FolderService', 'Buscando hierarquia de pasta', {
      folderId,
    });

    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      select: ['id', 'title', 'parentFolderId'],
    });

    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }

    const hierarchy: FolderResponse[] = [];
    let currentFolderId: string | null = folderId;

    // Construir hierarquia do root até a pasta atual
    while (currentFolderId) {
      const currentFolder = await this.folderRepository.findOne({
        where: { id: currentFolderId },
        relations: ['createdBy'],
        select: {
          id: true,
          title: true,
          position: true,
          projectId: true,
          parentFolderId: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            id: true,
            name: true,
            email: true,
          },
        },
      });

      if (!currentFolder) {
        break;
      }

      hierarchy.unshift(this.mapToResponse(currentFolder));
      currentFolderId = currentFolder.parentFolderId;
    }

    return hierarchy;
  }

  private mapToResponse(folder: Folder | null): FolderResponse {
    if (!folder) {
      throw new NotFoundException('Pasta não encontrada');
    }

    return {
      id: folder.id,
      title: folder.title,
      order: folder.position, // Mapear position para order
      projectId: folder.projectId,
      parentFolderId: folder.parentFolderId,
      createdBy: {
        id: folder.createdBy.id,
        name: folder.createdBy.name,
        email: folder.createdBy.email,
      },
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }
}
