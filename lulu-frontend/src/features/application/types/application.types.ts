export interface Application {
  id: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationRequest {
  name: string
  projectId: string
}

export interface UpdateApplicationRequest {
  name?: string
}

export interface ApplicationResponse {
  id: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedApplicationResponse {
  data: ApplicationResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

