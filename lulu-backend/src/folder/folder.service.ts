import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { DebugLoggerService } from '../core/logger/debug-logger.service';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { CreateFolderDto } from './models/dto/create-folder.dto';
import { MoveFolderDto } from './models/dto/move-folder.dto';
import { ReorderFolderDto } from './models/dto/reorder-folder.dto';
import { UpdateFolderTitleDto } from './models/dto/update-folder-title.dto';
import { Folder } from './models/folder.entity';
import {
  FolderResponse,
  FolderTreeResponse,
} from './models/types/folder-response.type';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
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

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar última position no nível atual
      const maxPositionResult = await queryRunner.manager
        .createQueryBuilder(Folder, 'folder')
        .where('folder.projectId = :projectId', {
          projectId: createFolderDto.projectId,
        })
        .andWhere(
          parentFolderId
            ? 'folder.parentFolderId = :parentId'
            : 'folder.parentFolderId IS NULL',
          parentFolderId ? { parentId: parentFolderId } : {},
        )
        .select('COALESCE(MAX(folder.position), -1)', 'max')
        .getRawOne();

      const maxPosition = parseInt(maxPositionResult?.max || '-1', 10);
      const newPosition = maxPosition + 1;

      this.debugLogger.debug('FolderService', 'Position calculada', {
        maxPosition,
        newPosition,
        parentFolderId,
      });

      // Buscar criador
      const creator = await this.userService.findOne(userId);

      // Criar pasta
      const folder = queryRunner.manager.create(Folder, {
        title: createFolderDto.title,
        projectId: createFolderDto.projectId,
        parentFolderId: parentFolderId,
        position: newPosition,
        createdById: userId,
        createdBy: creator as any,
      });

      const savedFolder = await queryRunner.manager.save(Folder, folder);

      await queryRunner.commitTransaction();

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
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
    this.debugLogger.debug('FolderService', `Iniciando movimentação de pasta: ${id}`, {
      targetParentId: moveDto.targetParentId,
      newPosition: moveDto.newPosition,
    });

    // Usar transação para garantir atomicidade
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar pasta a ser movida
      const folder = await queryRunner.manager.findOne(Folder, {
        where: { id },
        select: ['id', 'title', 'position', 'projectId', 'parentFolderId'],
      });

      if (!folder) {
        throw new NotFoundException('Pasta não encontrada');
      }

      // Determinar novo pai
      let newParentId: string | null = folder.parentFolderId;
      if (moveDto.targetParentId !== undefined) {
        // Se targetParentId é null, significa que está movendo para raiz
        newParentId = moveDto.targetParentId;

        if (newParentId === folder.id) {
          throw new BadRequestException('Pasta não pode ser filha de si mesma');
        }

        // Se forneceu um pai, validar que existe e pertence ao mesmo projeto
        if (newParentId !== null) {
          const targetParent = await queryRunner.manager.findOne(Folder, {
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

          // Verificar se não está tentando mover para dentro de si mesma ou descendentes
          const isDescendant = await this.isDescendant(
            folder.id,
            newParentId,
            queryRunner.manager,
          );
          if (isDescendant) {
            throw new BadRequestException(
              'Pasta não pode ser filha de seus descendentes',
            );
          }
        }
      }

      const oldParentId = folder.parentFolderId;
      const oldPosition = folder.position;
      const newPosition = moveDto.newPosition;
      const parentChanged = oldParentId !== newParentId;

      this.debugLogger.debug('FolderService', 'Dados da movimentação', {
        oldParentId,
        newParentId,
        oldPosition,
        newPosition,
        parentChanged,
      });

      // Validar newPosition
      if (newPosition < 0) {
        throw new BadRequestException('Posição deve ser maior ou igual a 0');
      }

      // 1. Se mudou de pai, recalcular posições no pai antigo (decrementar)
      if (parentChanged) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Folder)
          .set({ position: () => 'position - 1' })
          .where('projectId = :projectId', { projectId: folder.projectId })
          .andWhere(
            oldParentId
              ? 'parentFolderId = :oldParentId'
              : 'parentFolderId IS NULL',
            oldParentId ? { oldParentId } : {},
          )
          .andWhere('position > :oldPosition', { oldPosition })
          .execute();

        this.debugLogger.debug('FolderService', 'Posições decrementadas no pai antigo');
      }

      // 2. Re-ranking no pai novo (ou mesmo pai): incrementar posições >= newPosition
      // Primeiro, verificar quantos irmãos existem no novo nível
      const siblingsCount = await queryRunner.manager
        .createQueryBuilder(Folder, 'f')
        .where('f.projectId = :projectId', { projectId: folder.projectId })
        .andWhere(
          newParentId
            ? 'f.parentFolderId = :newParentId'
            : 'f.parentFolderId IS NULL',
          newParentId ? { newParentId } : {},
        )
        .andWhere('f.id != :folderId', { folderId: folder.id })
        .getCount();

      if (newPosition > siblingsCount) {
        throw new BadRequestException(
          `Posição ${newPosition} é inválida. Máximo permitido: ${siblingsCount}`,
        );
      }

      // Incrementar posições >= newPosition (exceto a pasta sendo movida)
      await queryRunner.manager
        .createQueryBuilder()
        .update(Folder)
        .set({ position: () => 'position + 1' })
        .where('projectId = :projectId', { projectId: folder.projectId })
        .andWhere(
          newParentId
            ? 'parentFolderId = :newParentId'
            : 'parentFolderId IS NULL',
          newParentId ? { newParentId } : {},
        )
        .andWhere('position >= :newPosition', { newPosition })
        .andWhere('id != :folderId', { folderId: folder.id })
        .execute();

      this.debugLogger.debug('FolderService', 'Posições incrementadas no pai novo');

      // 3. Atualizar pasta movida
      await queryRunner.manager.update(
        Folder,
        { id: folder.id },
        {
          parentFolderId: newParentId,
          position: newPosition,
        },
      );

      await queryRunner.commitTransaction();

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
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
    const allFolders = await this.folderRepository
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.createdBy', 'createdBy')
      .where('folder.projectId = :projectId', { projectId })
      .orderBy('folder.parentFolderId', 'ASC', 'NULLS FIRST')
      .addOrderBy('folder.position', 'ASC')
      .getMany();

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


  /**
   * Verifica se uma pasta é descendente de outra usando recursive query
   */
  private async isDescendant(
    ancestorId: string,
    descendantId: string,
    entityManager?: any,
  ): Promise<boolean> {
    const manager = entityManager || this.folderRepository.manager;

    // Se são a mesma pasta, não é descendente
    if (ancestorId === descendantId) {
      return false;
    }

    // Usar recursive CTE para verificar se descendantId está na árvore de ancestorId
    const result = await manager.query(
      `
      WITH RECURSIVE folder_tree AS (
        -- Base: pasta ancestral
        SELECT id, "parentFolderId"
        FROM folders
        WHERE id = $1
        
        UNION ALL
        
        -- Recursivo: filhos
        SELECT f.id, f."parentFolderId"
        FROM folders f
        INNER JOIN folder_tree ft ON f."parentFolderId" = ft.id
      )
      SELECT COUNT(*) as count
      FROM folder_tree
      WHERE id = $2
    `,
      [ancestorId, descendantId],
    );

    return parseInt(result[0]?.count || '0', 10) > 0;
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

