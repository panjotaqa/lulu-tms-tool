import { apiRequest, type ApiError } from '@/lib/api'
import type {
  CreateTestRunRequest,
  PaginatedTestRunResponse,
  TestRun,
} from '../types/testrun.types'

export interface QueryTestRunParams {
  page?: number
  limit?: number
  projectId?: string
  status?: string
}

export interface TestRunCaseResponse {
  id: string
  testRunId: string
  testCaseId: string
  assignedToId: string | null
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
  status: string
  testCaseSnapshot: object
  snapshotCreatedAt: string
  createdAt: string
  updatedAt: string
}

export interface TestRunResponse {
  id: string
  title: string
  description: string
  milestone: string | null
  status: string
  defaultAssigneeId: string | null
  defaultAssignee: {
    id: string
    name: string
    email: string
  } | null
  projectId: string
  project: {
    id: string
    title: string
    slug: string
  }
  createdById: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  testRunCases: TestRunCaseResponse[]
  createdAt: string
  updatedAt: string
}

export function handleTestRunError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const apiError = error as ApiError
    if (Array.isArray(apiError.message)) {
      return apiError.message.join(', ')
    }
    return apiError.message
  }
  return 'Erro ao processar solicitação. Tente novamente.'
}

export class TestRunService {
  static async findAll(
    params: QueryTestRunParams = {}
  ): Promise<PaginatedTestRunResponse> {
    const queryParams = new URLSearchParams()
    const page = params.page ?? 1
    const limit = params.limit ?? 10

    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())

    if (params.projectId) {
      queryParams.append('projectId', params.projectId)
    }

    if (params.status) {
      queryParams.append('status', params.status)
    }

    const query = queryParams.toString()
    return apiRequest<PaginatedTestRunResponse>(`/testruns?${query}`, {
      method: 'GET',
    })
  }

  static async create(data: CreateTestRunRequest): Promise<TestRunResponse> {
    return apiRequest<TestRunResponse>('/testruns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async findOne(id: string): Promise<TestRunResponse> {
    return apiRequest<TestRunResponse>(`/testruns/${id}`, {
      method: 'GET',
    })
  }

  static async updateTestCaseStatus(
    testRunId: string,
    testRunCaseId: string,
    status: string
  ): Promise<TestRunCaseResponse> {
    return apiRequest<TestRunCaseResponse>(
      `/testruns/${testRunId}/cases/${testRunCaseId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    )
  }
}

