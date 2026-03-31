import { FolderOpen, Plus, FileStack, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FolderBreadcrumbs } from './folder-breadcrumbs'
import { TestCaseTable } from '@/features/testcase/components/testcase-table'
import type { BreadcrumbItem } from '../types/folder.types'

interface FolderContentAreaProps {
  folderName: string
  folderId: string | null
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (id: string) => void
  onCreateTestCase?: () => void
  onCreateBulkTestCases?: () => void
  onEditTestCase?: (testCase: any) => void
  onMoveTestCases?: () => void
  testCases?: any[]
  isLoadingTestCases?: boolean
  currentPage?: number
  totalPages?: number
  total?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  selectedTestCaseIds?: Set<string>
  onSelectionChange?: (id: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
}

export function FolderContentArea({
  folderName,
  folderId,
  breadcrumbs,
  onNavigate,
  onCreateTestCase,
  onCreateBulkTestCases,
  onEditTestCase,
  onMoveTestCases,
  testCases = [],
  isLoadingTestCases = false,
  currentPage = 1,
  totalPages = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  selectedTestCaseIds = new Set(),
  onSelectionChange,
  onSelectAll,
}: FolderContentAreaProps) {
  const hasTestCases = total > 0 || isLoadingTestCases
  const hasSelection = selectedTestCaseIds.size > 0

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      <div className="bg-background p-6 shrink-0">
        <FolderBreadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{folderName}</h2>
          <div className="flex gap-2">
            {onCreateTestCase && (
              <Button onClick={onCreateTestCase}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Caso de Teste
              </Button>
            )}
            {onCreateBulkTestCases && (
              <Button variant="outline" onClick={onCreateBulkTestCases}>
                <FileStack className="w-4 h-4 mr-2" />
                + em Massa
              </Button>
            )}
            {onMoveTestCases && (
              <Button
                variant="outline"
                onClick={onMoveTestCases}
                disabled={!hasSelection}
              >
                <Move className="w-4 h-4 mr-2" />
                Mover ({selectedTestCaseIds.size})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {hasTestCases ? (
          <TestCaseTable
            testCases={testCases}
            isLoading={isLoadingTestCases}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onEdit={onEditTestCase}
            selectedIds={selectedTestCaseIds}
            onSelectionChange={onSelectionChange}
            onSelectAll={onSelectAll}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pasta vazia</h3>
              <p className="text-muted-foreground mb-4">
                Esta pasta ainda não possui casos de teste. Crie seu primeiro
                caso de teste para começar.
              </p>
              <div className="flex gap-2 justify-center">
                {onCreateTestCase && (
                  <Button onClick={onCreateTestCase}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Caso de Teste
                  </Button>
                )}
                {onCreateBulkTestCases && (
                  <Button variant="outline" onClick={onCreateBulkTestCases}>
                    <FileStack className="w-4 h-4 mr-2" />
                    + em Massa
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
