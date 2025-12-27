import { apiRequest, type ApiError } from '@/lib/api'
import type { Project } from '../types/project.types'

export interface CreateProjectRequest {
  title: string
  slug: string
  description?: string
}

export interface UpdateProjectRequest {
  title?: string
  slug?: string
  description?: string
}

export interface ProjectUser {
  id: string
  name: string
  email: string
}

export interface ProjectResponse {
  id: string
  title: string
  slug: string
  description: string | null
  isArchived: boolean
  createdBy: ProjectUser
  users: ProjectUser[]
  createdAt: string
  updatedAt: string
}

export interface PaginatedProjectResponse {
  data: ProjectResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryProjectsParams {
  page?: number
  limit?: number
  isArchived?: boolean
}

export interface LinkUserRequest {
  userId: string
}

export class ProjectService {
  static async create(data: CreateProjectRequest): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async findAll(params: QueryProjectsParams = {}): Promise<PaginatedProjectResponse> {
    const queryParams = new URLSearchParams()
    const page = params.page ?? 1
    const limit = params.limit ?? 10
    
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())
    
    // Não passa isArchived quando for false (backend usa false como padrão)
    // Isso evita problemas de conversão de string "false" para boolean
    if (params.isArchived === true) {
      queryParams.append('isArchived', 'true')
    }

    const query = queryParams.toString()
    return apiRequest<PaginatedProjectResponse>(`/projects?${query}`, {
      method: 'GET',
    })
  }

  static async findArchived(params: QueryProjectsParams = {}): Promise<PaginatedProjectResponse> {
    const queryParams = new URLSearchParams()
    const page = params.page ?? 1
    const limit = params.limit ?? 10
    
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())

    const query = queryParams.toString()
    return apiRequest<PaginatedProjectResponse>(`/projects/archived?${query}`, {
      method: 'GET',
    })
  }

  static async findOne(id: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${id}`, {
      method: 'GET',
    })
  }

  static async update(id: string, data: UpdateProjectRequest): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  static async archive(id: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${id}/archive`, {
      method: 'PATCH',
    })
  }

  static async unarchive(id: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${id}/unarchive`, {
      method: 'PATCH',
    })
  }

  static async linkUser(projectId: string, userId: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${projectId}/users`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  static async unlinkUser(projectId: string, userId: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/projects/${projectId}/users`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    })
  }
}

export function mapProjectResponseToProject(response: ProjectResponse): Project {
  return {
    id: response.id,
    title: response.title,
    slug: response.slug,
    description: response.description,
    isArchived: response.isArchived,
    createdBy: response.createdBy,
    users: response.users,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  }
}

export function handleProjectError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const apiError = error as ApiError
    if (Array.isArray(apiError.message)) {
      return apiError.message.join(', ')
    }
    return apiError.message
  }
  return 'Erro ao processar requisição. Tente novamente.'
}

