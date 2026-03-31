import { apiRequest } from '@/lib/api'
import type {
  FolderResponse,
  FolderTreeResponse,
  CreateFolderRequest,
  UpdateFolderTitleRequest,
  MoveFolderRequest,
  ReorderFolderRequest,
} from '../types/folder.types'

export class FolderService {
  static async create(data: CreateFolderRequest): Promise<FolderResponse> {
    return apiRequest<FolderResponse>('/folders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateTitle(
    id: string,
    data: UpdateFolderTitleRequest
  ): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(`/folders/${id}/title`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  static async move(id: string, data: MoveFolderRequest): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(`/folders/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  static async reorder(
    id: string,
    data: ReorderFolderRequest
  ): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(`/folders/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  static async findByProject(projectId: string): Promise<FolderTreeResponse> {
    return apiRequest<FolderTreeResponse>(`/folders/projects/${projectId}`)
  }

  static async getHierarchy(folderId: string): Promise<FolderResponse[]> {
    return apiRequest<FolderResponse[]>(`/folders/${folderId}/hierarchy`)
  }
}

