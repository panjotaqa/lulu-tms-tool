import { Button } from '@/components/ui/button'
import { TestRunCaseStatus } from '../types/testrun.types'
import { CheckCircle2, XCircle, Ban, Clock } from 'lucide-react'

interface StatusActionsProps {
  currentStatus: TestRunCaseStatus
  onStatusChange: (newStatus: TestRunCaseStatus) => void
  testRunCaseId: string
}

export function StatusActions({
  onStatusChange,
}: StatusActionsProps) {

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 bg-gray-600/20 hover:bg-gray-600 text-white hover:text-white"
        onClick={() => onStatusChange(TestRunCaseStatus.PENDING)}
        title="Marcar como Untested"
      >
        <Clock className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 bg-green-600/20 hover:bg-green-600 text-white hover:text-white"
        onClick={() => onStatusChange(TestRunCaseStatus.PASSED)}
        title="Marcar como Passed"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 bg-red-600/20 hover:bg-red-600 text-white hover:text-white"
        onClick={() => onStatusChange(TestRunCaseStatus.FAILED)}
        title="Marcar como Failed"
      >
        <XCircle className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 bg-yellow-600/20 hover:bg-yellow-600 text-white hover:text-white"
        onClick={() => onStatusChange(TestRunCaseStatus.BLOCKED)}
        title="Marcar como Blocked"
      >
        <Ban className="h-4 w-4" />
      </Button>
    </div>
  )
}

