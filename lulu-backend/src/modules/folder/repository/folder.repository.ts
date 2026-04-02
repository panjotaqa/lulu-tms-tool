import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '../../core/database/base.repository';
import { Folder } from '../models/entity/folder.entity';
import { IFolderRepository } from './folder.repository.interface';
import { User } from '@/modules/user/models/entity/user.entity';

export interface RawCountResult {
  count: string | number;
}

export interface RawMaxPositionResult {
  max: string | number | null;
}

@Injectable()
export class FolderRepository
  extends BaseRepository<Folder>
  implements IFolderRepository
{
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {
    super(folderRepository);
  }

  async findTreeByProject(projectId: string): Promise<Folder[]> {
    return this.folderRepository
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.createdBy', 'createdBy')
      .where('folder.projectId = :projectId', { projectId })
      .orderBy('folder.parentFolderId', 'ASC', 'NULLS FIRST')
      .addOrderBy('folder.position', 'ASC')
      .getMany();
  }

  async getMaxPosition(
    projectId: string,
    parentFolderId: string | null,
    entityManager?: EntityManager,
  ): Promise<number> {
    const manager = entityManager || this.folderRepository.manager;
    const result = await manager
      .createQueryBuilder(Folder, 'folder')
      .where('folder.projectId = :projectId', { projectId })
      .andWhere(
        parentFolderId
          ? 'folder.parentFolderId = :parentId'
          : 'folder.parentFolderId IS NULL',
        parentFolderId ? { parentId: parentFolderId } : {},
      )
      .select('COALESCE(MAX(folder.position), -1)', 'max')
      .getRawOne<RawMaxPositionResult>();

    const maxPositionStringOrNumber = result?.max ?? '-1';
    return parseInt(String(maxPositionStringOrNumber), 10);
  }

  async isDescendant(
    ancestorId: string,
    descendantId: string,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    const manager = entityManager || this.folderRepository.manager;

    if (ancestorId === descendantId) {
      return false;
    }

    const result = await manager.query<RawCountResult[]>(
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

    const countResult = result[0];
    const countStringOrNumber = countResult?.count ?? '0';
    return parseInt(String(countStringOrNumber), 10) > 0;
  }

  async moveFolderWithReordering(
    folderId: string,
    newParentId: string | null,
    newPosition: number,
    entityManager?: EntityManager,
  ): Promise<Folder> {
    const manager = entityManager || this.folderRepository.manager;

    const executeMove = async (txManager: EntityManager) => {
      // Buscar pasta a ser movida
      const folder = await txManager.findOne(Folder, {
        where: { id: folderId },
        select: ['id', 'title', 'position', 'projectId', 'parentFolderId'],
      });

      if (!folder) {
        throw new NotFoundException('Pasta não encontrada');
      }

      const oldParentId = folder.parentFolderId;
      const oldPosition = folder.position;
      const parentChanged = oldParentId !== newParentId;

      // 1. Se mudou de pai, recalcular posições no pai antigo (decrementar)
      if (parentChanged) {
        await txManager
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
      }

      // 2. Re-ranking no pai novo (ou mesmo pai): incrementar posições >= newPosition
      // Primeiro, verificar quantos irmãos existem no novo nível
      const siblingsCount = await txManager
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
      await txManager
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

      // 3. Atualizar pasta movida
      await txManager.update(
        Folder,
        { id: folder.id },
        {
          parentFolderId: newParentId,
          position: newPosition,
        },
      );

      // Return updated entity lightly, full fetch should be done by service if needed.
      folder.parentFolderId = newParentId;
      folder.position = newPosition;
      return folder;
    };

    if (entityManager) {
      return executeMove(entityManager);
    } else {
      return manager.transaction(async (txManager) => {
        return executeMove(txManager);
      });
    }
  }

  async createFolderWithPosition(
    title: string,
    projectId: string,
    parentFolderId: string | null,
    userId: string,
    creator: User,
    entityManager?: EntityManager,
  ): Promise<Folder> {
    const manager = entityManager || this.folderRepository.manager;

    const executeCreate = async (txManager: EntityManager) => {
      const maxPosition = await this.getMaxPosition(
        projectId,
        parentFolderId,
        txManager,
      );
      const newPosition = maxPosition + 1;

      const folder = txManager.create(Folder, {
        title,
        projectId,
        parentFolderId,
        position: newPosition,
        createdById: userId,
        createdBy: creator,
      });

      return txManager.save(Folder, folder);
    };

    if (entityManager) {
      return executeCreate(entityManager);
    } else {
      return manager.transaction(async (txManager) => {
        return executeCreate(txManager);
      });
    }
  }
}
