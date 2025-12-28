import { useState, useCallback, useEffect } from 'react'
import { TestRunService, handleTestRunError } from '../services/testrun.service'
import type { TestRunListItem, CreateTestRunRequest } from '../types/testrun.types'
import { useToast } from '@/hooks/use-toast'

interface UseTestRunsOptions {
  pageSize?: number
  projectId?: string
  status?: string
}

interface UseTestRunsReturn {
  testRuns: TestRunListItem[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  total: number
  loadTestRuns: (page?: number) => Promise<void>
  createTestRun: (data: CreateTestRunRequest) => Promise<void>
  refreshTestRuns: () => Promise<void>
}

export function useTestRuns({
  pageSize = 10,
  projectId,
  status,
}: UseTestRunsOptions = {}): UseTestRunsReturn {
  const [testRuns, setTestRuns] = useState<TestRunListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  const loadTestRuns = useCallback(
    async (page: number = 1) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await TestRunService.findAll({
          page,
          limit: pageSize,
          projectId,
          status,
        })

        setTestRuns(response.data)
        setTotalPages(response.totalPages)
        setTotal(response.total)
        setCurrentPage(response.page)
      } catch (err) {
        setError(handleTestRunError(err))
      } finally {
        setIsLoading(false)
      }
    },
    [pageSize, projectId, status]
  )

  const createTestRun = useCallback(
    async (data: CreateTestRunRequest) => {
      try {
        await TestRunService.create(data)
        toast({
          title: 'Sucesso!',
          description: 'Test Run criada com sucesso.',
        })
        await loadTestRuns(currentPage)
      } catch (err) {
        const errorMessage = handleTestRunError(err)
        setError(errorMessage)
        toast({
          title: 'Erro ao criar Test Run',
          description: errorMessage,
          variant: 'destructive',
        })
        throw err
      }
    },
    [currentPage, loadTestRuns, toast]
  )

  const refreshTestRuns = useCallback(async () => {
    await loadTestRuns(currentPage)
  }, [currentPage, loadTestRuns])

  useEffect(() => {
    loadTestRuns(1)
  }, [loadTestRuns])

  return {
    testRuns,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    loadTestRuns,
    createTestRun,
    refreshTestRuns,
  }
}

