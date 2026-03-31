import { apiRequest, type ApiError } from '@/lib/api'
import type {
  ApplicationResponse,
  CreateApplicationRequest,
  PaginatedApplicationResponse,
  UpdateApplicationRequest,
} from '../types/application.types'

export interface QueryApplicationsParams {
  projectId: string
  page?: number
  limit?: number
}

export class ApplicationService {
  static async create(
    data: CreateApplicationRequest,
  ): Promise<ApplicationResponse> {
    return apiRequest<ApplicationResponse>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async findAll(
    params: QueryApplicationsParams,
  ): Promise<PaginatedApplicationResponse> {
    const queryParams = new URLSearchParams()
    queryParams.append('projectId', params.projectId)
    if (params.page) {
      queryParams.append('page', params.page.toString())
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString())
    }

    const query = queryParams.toString()
    return apiRequest<PaginatedApplicationResponse>(`/applications?${query}`, {
      method: 'GET',
    })
  }

  static async findOne(id: string): Promise<ApplicationResponse> {
    return apiRequest<ApplicationResponse>(`/applications/${id}`, {
      method: 'GET',
    })
  }

  static async update(
    id: string,
    data: UpdateApplicationRequest,
  ): Promise<ApplicationResponse> {
    return apiRequest<ApplicationResponse>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  static async delete(id: string): Promise<void> {
    return apiRequest<void>(`/applications/${id}`, {
      method: 'DELETE',
    })
  }
}

export function handleApplicationError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const apiError = error as ApiError
    if (Array.isArray(apiError.message)) {
      return apiError.message.join(', ')
    }
    return apiError.message
  }
  return 'Erro ao processar requisição. Tente novamente.'
}

