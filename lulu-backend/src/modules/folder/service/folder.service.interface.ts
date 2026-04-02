import { CreateFolderDto } from '../models/dto/create-folder.dto';
import { MoveFolderDto } from '../models/dto/move-folder.dto';
import { ReorderFolderDto } from '../models/dto/reorder-folder.dto';
import { UpdateFolderTitleDto } from '../models/dto/update-folder-title.dto';
import {
  FolderResponse,
  FolderTreeResponse,
} from '../models/types/folder-response.type';

export interface IFolderService {
  create(
    createFolderDto: CreateFolderDto,
    userId: string,
  ): Promise<FolderResponse>;
  updateTitle(
    id: string,
    updateDto: UpdateFolderTitleDto,
  ): Promise<FolderResponse>;
  move(id: string, moveDto: MoveFolderDto): Promise<FolderResponse>;
  reorder(id: string, reorderDto: ReorderFolderDto): Promise<FolderResponse>;
  findByProject(projectId: string): Promise<FolderTreeResponse>;
  getFolderHierarchy(folderId: string): Promise<FolderResponse[]>;
}
