import { Button } from '@/components/ui/button'
import { TestRunCaseStatus } from '../types/testrun.types'
import { CheckCircle2, XCircle, Ban, Clock } from 'lucide-react'

interface StatusActionsProps {
  currentStatus: TestRunCaseStatus
  onStatusChange: (newStatus: TestRunCaseStatus) => void
  testRunCaseId: string
}

const statusConfig = {
  [TestRunCaseStatus.PENDING]: {
    label: 'Untested',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  },
  [TestRunCaseStatus.PASSED]: {
    label: 'Passed',
    color: 'bg-green-500/20 text-green-300 border-green-500/50',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  [TestRunCaseStatus.FAILED]: {
    label: 'Failed',
    color: 'bg-red-500/20 text-red-300 border-red-500/50',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
  [TestRunCaseStatus.BLOCKED]: {
    label: 'Blocked',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
  [TestRunCaseStatus.SKIPPED]: {
    label: 'Skipped',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
  },
}

export function StatusActions({
  currentStatus,
  onStatusChange,
  testRunCaseId,
}: StatusActionsProps) {
  const config = statusConfig[currentStatus]

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

