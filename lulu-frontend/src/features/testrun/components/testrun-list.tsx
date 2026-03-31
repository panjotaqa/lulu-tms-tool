import { TestRunTable } from './testrun-table'
import { Button } from '@/components/ui/button'
import type { TestRunListItem } from '../types/testrun.types'

interface TestRunListProps {
  testRuns: TestRunListItem[]
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function TestRunList({
  testRuns,
  currentPage,
  totalPages,
  total,
  onPageChange,
}: TestRunListProps) {
  return (
    <div className="space-y-4">
      <TestRunTable testRuns={testRuns} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {testRuns.length} de {total} test runs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

