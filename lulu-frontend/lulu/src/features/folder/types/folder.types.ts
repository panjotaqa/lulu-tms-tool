export interface FolderNode {
  id: string
  name: string
  parentId: string | null
  order: number
  children: FolderNode[]
}

export interface BreadcrumbItem {
  id: string
  name: string
}

// Tipos de resposta do backend
export interface FolderResponse {
  id: string
  title: string
  order: number
  projectId: string
  parentFolderId: string | null
  createdBy: {
    id: string
    name: string
    email: string
  }
  children?: FolderResponse[]
  createdAt: string
  updatedAt: string
}

export type FolderTreeResponse = FolderResponse[]

// DTOs para requisições
export interface CreateFolderRequest {
  title: string
  projectId: string
  parentFolderId?: string
}

export interface UpdateFolderTitleRequest {
  title: string
}

export interface MoveFolderRequest {
  targetParentId?: string | null
  newPosition: number
}

export interface ReorderFolderRequest {
  newOrder: number
}
