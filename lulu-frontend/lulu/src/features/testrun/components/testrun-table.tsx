import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import type { TestRunListItem, TestRunStatus } from '../types/testrun.types'

interface TestRunTableProps {
  testRuns: TestRunListItem[]
}

function getStatusBadgeClass(status: TestRunStatus): string {
  switch (status) {
    case 'Not Started':
      return 'bg-muted text-muted-foreground'
    case 'In Progress':
      return 'bg-blue-500/10 text-blue-500'
    case 'Completed':
      return 'bg-green-500/10 text-green-500'
    case 'Cancelled':
      return 'bg-red-500/10 text-red-500'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TestRunTable({ testRuns }: TestRunTableProps) {
  const navigate = useNavigate()

  if (testRuns.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma Test Run encontrada
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Estatísticas</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testRuns.map((testRun) => (
          <TableRow key={testRun.id}>
            <TableCell className="font-medium">{testRun.title}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                  testRun.status
                )}`}
              >
                {testRun.status}
              </span>
            </TableCell>
            <TableCell>{testRun.author.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 flex-wrap">
                {testRun.testRunStats.total > 0 && (
                  <>
                    {testRun.testRunStats.passed > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                        ✓ {testRun.testRunStats.passed}
                      </span>
                    )}
                    {testRun.testRunStats.failed > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500">
                        ✗ {testRun.testRunStats.failed}
                      </span>
                    )}
                    {testRun.testRunStats.blocked > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-orange-500/10 text-orange-500">
                        ⊗ {testRun.testRunStats.blocked}
                      </span>
                    )}
                    {testRun.testRunStats.pending > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-500/10 text-gray-500">
                        ⏳ {testRun.testRunStats.pending}
                      </span>
                    )}
                    {testRun.testRunStats.skipped > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-500">
                        ⊘ {testRun.testRunStats.skipped}
                      </span>
                    )}
                  </>
                )}
                {testRun.testRunStats.total === 0 && (
                  <span className="text-xs text-muted-foreground">Sem casos</span>
                )}
              </div>
            </TableCell>
            <TableCell>{formatDate(testRun.createdAt)}</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="default"
                onClick={() => navigate(`/app/testruns/${testRun.id}/execute`)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Executar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

