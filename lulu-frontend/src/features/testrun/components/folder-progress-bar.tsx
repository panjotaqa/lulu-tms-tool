import { TestRunCaseStatus } from '../types/testrun.types'
import type { TestRunCase } from '../types/testrun.types'

interface FolderProgressBarProps {
  testCases: TestRunCase[]
}

const statusColors = {
  [TestRunCaseStatus.PASSED]: 'bg-green-500',
  [TestRunCaseStatus.FAILED]: 'bg-red-500',
  [TestRunCaseStatus.BLOCKED]: 'bg-yellow-500',
  [TestRunCaseStatus.SKIPPED]: 'bg-orange-500',
  [TestRunCaseStatus.PENDING]: 'bg-gray-400',
}

export function FolderProgressBar({ testCases }: FolderProgressBarProps) {
  const total = testCases.length
  const executed = testCases.filter(
    (tc) => tc.status !== TestRunCaseStatus.PENDING
  ).length
  const percentage = total > 0 ? Math.round((executed / total) * 100) : 0

  const statusCounts = {
    [TestRunCaseStatus.PASSED]: testCases.filter((tc) => tc.status === TestRunCaseStatus.PASSED)
      .length,
    [TestRunCaseStatus.FAILED]: testCases.filter((tc) => tc.status === TestRunCaseStatus.FAILED)
      .length,
    [TestRunCaseStatus.BLOCKED]: testCases.filter((tc) => tc.status === TestRunCaseStatus.BLOCKED)
      .length,
    [TestRunCaseStatus.SKIPPED]: testCases.filter((tc) => tc.status === TestRunCaseStatus.SKIPPED)
      .length,
    [TestRunCaseStatus.PENDING]: testCases.filter((tc) => tc.status === TestRunCaseStatus.PENDING)
      .length,
  }

  // Ordem de exibição: Passed, Failed, Blocked, Skipped, Pending
  const statusOrder = [
    TestRunCaseStatus.PASSED,
    TestRunCaseStatus.FAILED,
    TestRunCaseStatus.BLOCKED,
    TestRunCaseStatus.SKIPPED,
    TestRunCaseStatus.PENDING,
  ]

  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 w-[216px] bg-secondary rounded-full overflow-hidden flex">
        {statusOrder.map((status) => {
          const count = statusCounts[status]
          const width = total > 0 ? (count / total) * 100 : 0
          
          if (count === 0) return null
          
          return (
            <div
              key={status}
              className={statusColors[status]}
              style={{ width: `${width}%` }}
            />
          )
        })}
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {percentage}%
      </span>
    </div>
  )
}

