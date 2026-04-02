import { EntityManager } from 'typeorm';
import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { Folder } from '../models/entity/folder.entity';

import { User } from '@/modules/user/models/entity/user.entity';

export interface IFolderRepository extends IBaseRepository<Folder> {
  findTreeByProject(projectId: string): Promise<Folder[]>;
  getMaxPosition(
    projectId: string,
    parentFolderId: string | null,
    entityManager?: EntityManager,
  ): Promise<number>;
  isDescendant(
    ancestorId: string,
    descendantId: string,
    entityManager?: EntityManager,
  ): Promise<boolean>;
  moveFolderWithReordering(
    folderId: string,
    newParentId: string | null,
    newPosition: number,
    entityManager?: EntityManager,
  ): Promise<Folder>;
  createFolderWithPosition(
    title: string,
    projectId: string,
    parentFolderId: string | null,
    userId: string,
    creator: User,
    entityManager?: EntityManager,
  ): Promise<Folder>;
}
