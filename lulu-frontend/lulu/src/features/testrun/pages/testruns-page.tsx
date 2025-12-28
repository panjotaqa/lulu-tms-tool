import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TestRunList } from '../components/testrun-list'
import { CreateTestRunDialog } from '../components/create-testrun-dialog'
import { useTestRuns } from '../hooks/use-testruns'
import type { CreateTestRunRequest } from '../types/testrun.types'

export function TestRunsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const testRuns = useTestRuns({ pageSize: 10 })

  const handleCreateTestRun = async (data: CreateTestRunRequest) => {
    await testRuns.createTestRun(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Runs</h1>
          <p className="text-muted-foreground">
            Gerencie suas execuções de teste
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nova Test Run
        </Button>
      </div>

      {testRuns.error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {testRuns.error}
        </div>
      )}

      {testRuns.isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando...
        </div>
      ) : (
        <TestRunList
          testRuns={testRuns.testRuns}
          currentPage={testRuns.currentPage}
          totalPages={testRuns.totalPages}
          total={testRuns.total}
          onPageChange={testRuns.loadTestRuns}
        />
      )}

      <CreateTestRunDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTestRun}
        isLoading={testRuns.isLoading}
      />
    </div>
  )
}

