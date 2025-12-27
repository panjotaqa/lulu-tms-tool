import { apiRequest } from '@/lib/api'
import type {
  TestCaseResponse,
  CreateTestCaseRequest,
  UpdateTestCaseRequest,
} from '../types/testcase.types'

export interface PaginatedTestCaseResponse {
  data: TestCaseResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryTestCasesParams {
  page?: number
  limit?: number
}

export interface BulkCreateTestCasesRequest {
  titles: string[]
  testSuiteId: string
}

export interface BulkCreateTestCasesResponse {
  created: number
  failed: number
  total: number
  testCases: TestCaseResponse[]
}

export class TestCaseService {
  static async create(
    data: CreateTestCaseRequest
  ): Promise<TestCaseResponse> {
    return apiRequest<TestCaseResponse>('/testcases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async findOne(id: string): Promise<TestCaseResponse> {
    return apiRequest<TestCaseResponse>(`/testcases/${id}`)
  }

  static async findByFolder(
    folderId: string,
    params: QueryTestCasesParams = {}
  ): Promise<PaginatedTestCaseResponse> {
    const queryParams = new URLSearchParams()
    const page = params.page ?? 1
    const limit = params.limit ?? 10

    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())

    const query = queryParams.toString()
    return apiRequest<PaginatedTestCaseResponse>(
      `/testcases/folder/${folderId}?${query}`
    )
  }

  static async createBulk(
    data: BulkCreateTestCasesRequest
  ): Promise<BulkCreateTestCasesResponse> {
    return apiRequest<BulkCreateTestCasesResponse>('/testcases/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async update(
    id: string,
    data: UpdateTestCaseRequest
  ): Promise<TestCaseResponse> {
    return apiRequest<TestCaseResponse>(`/testcases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

