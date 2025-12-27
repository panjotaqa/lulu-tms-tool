import { useState, useEffect, useCallback } from 'react'
import { TestCaseService } from '../services/testcase.service'
import type {
  TestCaseResponse,
  CreateTestCaseRequest,
} from '../types/testcase.types'
import { handleApiError } from '@/features/auth/services/auth.service'

interface UseTestCasesOptions {
  folderId: string | null
  pageSize?: number
}

export function useTestCases({
  folderId,
  pageSize: initialPageSize = 10,
}: UseTestCasesOptions) {
  const [testCases, setTestCases] = useState<TestCaseResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const loadTestCases = useCallback(
    async (page: number = 1) => {
      if (!folderId) {
        setTestCases([])
        setTotal(0)
        setTotalPages(1)
        setCurrentPage(1)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await TestCaseService.findByFolder(folderId, {
          page,
          limit: pageSize,
        })
        setTestCases(response.data)
        setTotal(response.total)
        setTotalPages(response.totalPages)
        setCurrentPage(response.page)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        setTestCases([])
        setTotal(0)
        setTotalPages(1)
        setCurrentPage(1)
      } finally {
        setIsLoading(false)
      }
    },
    [folderId, pageSize]
  )

  const createTestCase = useCallback(
    async (data: CreateTestCaseRequest): Promise<TestCaseResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const newTestCase = await TestCaseService.create(data)
        await loadTestCases(currentPage)
        return newTestCase
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadTestCases, currentPage]
  )

  const createBulkTestCases = useCallback(
    async (titles: string[]): Promise<void> => {
      if (!folderId) {
        throw new Error('Folder ID é obrigatório')
      }

      setIsLoading(true)
      setError(null)

      try {
        await TestCaseService.createBulk({
          titles,
          testSuiteId: folderId,
        })
        await loadTestCases(1)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [folderId, loadTestCases]
  )

  const refreshTestCases = useCallback(() => {
    loadTestCases(currentPage)
  }, [loadTestCases, currentPage])

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize)
      setCurrentPage(1)
    },
    []
  )

  useEffect(() => {
    loadTestCases(1)
  }, [loadTestCases])

  return {
    testCases,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    pageSize,
    loadTestCases,
    createTestCase,
    createBulkTestCases,
    refreshTestCases,
    setPageSize: handlePageSizeChange,
  }
}

