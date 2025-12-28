import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TestRunService, type TestRunResponse } from '../services/testrun.service'
import { FolderAccordion } from '../components/folder-accordion'
import { TestRunStatsPanel } from '../components/testrun-stats-panel'
import { FolderService } from '@/features/folder/services/folder.service'
import { TestRunCaseStatus } from '../types/testrun.types'
import type { TestRunCase, TestCaseSnapshot } from '../types/testrun.types'
import type { FolderResponse } from '@/features/folder/types/folder.types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface FolderGroup {
  folderId: string
  folderTitle: string
  folderHierarchy?: FolderResponse[]
  testCases: TestRunCase[]
}

export function TestRunExecutionPage() {
  const { id: testRunId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [testRun, setTestRun] = useState<TestRunResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [folderGroups, setFolderGroups] = useState<FolderGroup[]>([])

  useEffect(() => {
    if (testRunId) {
      loadTestRun()
    }
  }, [testRunId])

  const loadTestRun = async () => {
    if (!testRunId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await TestRunService.findOne(testRunId)
        setTestRun(data)
        await groupTestCasesByFolder(data.testRunCases)
    } catch (err) {
      setError('Erro ao carregar execução de teste')
      console.error('Erro ao carregar Test Run:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const groupTestCasesByFolder = async (testRunCases: any[]) => {
    const groupsMap = new Map<string, FolderGroup>()

    testRunCases.forEach((testCase) => {
      const snapshot = testCase.testCaseSnapshot as TestCaseSnapshot
      const folderId = snapshot.testSuiteId
      const folderTitle = snapshot.testSuite?.title || 'Sem pasta'

      if (!groupsMap.has(folderId)) {
        groupsMap.set(folderId, {
          folderId,
          folderTitle,
          testCases: [],
        })
      }

      groupsMap.get(folderId)!.testCases.push(testCase)
    })

    // Buscar hierarquia para cada pasta
    const groupsWithHierarchy = await Promise.all(
      Array.from(groupsMap.values()).map(async (group) => {
        try {
          const hierarchy = await FolderService.getHierarchy(group.folderId)
          return {
            ...group,
            folderHierarchy: hierarchy,
          }
        } catch (error) {
          console.error(
            `Erro ao buscar hierarquia da pasta ${group.folderId}:`,
            error
          )
          return {
            ...group,
            folderHierarchy: undefined,
          }
        }
      })
    )

    setFolderGroups(groupsWithHierarchy)
  }

  const handleUpdateStatus = async (
    testRunCaseId: string,
    newStatus: TestRunCaseStatus
  ) => {
    if (!testRunId || !testRun) return

    try {
      // Otimistic update
      const updatedTestRun = { ...testRun }
      const testCaseIndex = updatedTestRun.testRunCases.findIndex(
        (tc) => tc.id === testRunCaseId
      )

      if (testCaseIndex !== -1) {
        updatedTestRun.testRunCases[testCaseIndex] = {
          ...updatedTestRun.testRunCases[testCaseIndex],
          status: newStatus,
        }
        setTestRun(updatedTestRun)
        await groupTestCasesByFolder(updatedTestRun.testRunCases as any[])
      }

      // Atualizar no backend
      await TestRunService.updateTestCaseStatus(testRunId, testRunCaseId, newStatus)
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      // Reverter em caso de erro
      if (testRunId) {
        loadTestRun()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          Carregando execução de teste...
        </div>
      </div>
    )
  }

  if (error || !testRun) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error || 'Execução de teste não encontrada'}
        </div>
        <Button variant="outline" onClick={() => navigate('/app/testruns')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Test Runs
        </Button>
      </div>
    )
  }

  const defaultOpenFolders = folderGroups.map((fg) => fg.folderId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/testruns')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{testRun.title}</h1>
            <p className="text-muted-foreground">{testRun.description}</p>
          </div>
        </div>
      </div>

      {folderGroups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum caso de teste encontrado nesta execução
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FolderAccordion
              folderGroups={folderGroups}
              onStatusChange={handleUpdateStatus}
              defaultOpenFolders={defaultOpenFolders}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
              {testRun && (
                <TestRunStatsPanel testRunCases={testRun.testRunCases as any} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

