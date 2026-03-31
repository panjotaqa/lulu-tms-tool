import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatusActions } from './status-actions'
import { TestRunCaseStatus } from '../types/testrun.types'
import type { TestRunCase } from '../types/testrun.types'

const statusConfig = {
  [TestRunCaseStatus.PENDING]: {
    label: 'Untested',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  },
  [TestRunCaseStatus.PASSED]: {
    label: 'Passed',
    color: 'bg-green-500/20 text-green-300 border-green-500/50',
  },
  [TestRunCaseStatus.FAILED]: {
    label: 'Failed',
    color: 'bg-red-500/20 text-red-300 border-red-500/50',
  },
  [TestRunCaseStatus.BLOCKED]: {
    label: 'Blocked',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  },
  [TestRunCaseStatus.SKIPPED]: {
    label: 'Skipped',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  },
}

interface ExecutionTableProps {
  testCases: TestRunCase[]
  onStatusChange: (testRunCaseId: string, newStatus: TestRunCaseStatus) => void
  onTestCaseClick?: (testCase: TestRunCase) => void
}

export function ExecutionTable({
  testCases,
  onStatusChange,
  onTestCaseClick,
}: ExecutionTableProps) {
  if (testCases.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Nenhum caso de teste nesta pasta
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">ID</TableHead>
          <TableHead style={{ maxWidth: '300px' }}>Título</TableHead>
          <TableHead className="w-[180px] text-center">Status</TableHead>
          <TableHead className="w-[180px] text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testCases.map((testCase) => {
          const snapshot = testCase.testCaseSnapshot
          const config = statusConfig[testCase.status]
          return (
            <TableRow
              key={testCase.id}
              className={onTestCaseClick ? 'cursor-pointer' : ''}
              onClick={() => onTestCaseClick?.(testCase)}
            >
              <TableCell className="font-medium">
                {snapshot.testcaseId}
              </TableCell>
              <TableCell style={{ maxWidth: '300px' }}>
                <div className="break-words">
                  {snapshot.title}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant="outline" 
                  className={`${config.color} w-[72px] justify-center`}>
                  {config.label}
                </Badge>
              </TableCell>
              <TableCell
                className="text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusActions
                  currentStatus={testCase.status}
                  onStatusChange={(newStatus) =>
                    onStatusChange(testCase.id, newStatus)
                  }
                  testRunCaseId={testCase.id}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

