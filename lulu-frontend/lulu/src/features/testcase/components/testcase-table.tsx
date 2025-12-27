import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TestCasePagination } from './testcase-pagination'
import type { TestCaseResponse } from '../types/testcase.types'

interface TestCaseTableProps {
  testCases: TestCaseResponse[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  total?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onEdit?: (testCase: TestCaseResponse) => void
}

export function TestCaseTable({
  testCases,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onEdit,
}: TestCaseTableProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 text-muted-foreground">
            Carregando casos de teste...
          </div>
        </div>
      </div>
    )
  }

  if (testCases.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 text-muted-foreground">
            Nenhum caso de teste encontrado
          </div>
        </div>
      </div>
    )
  }

  const tableContent = (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead style={{ maxWidth: '300px' }}>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testCases.map((testCase) => (
          <TableRow
            key={testCase.id}
            onClick={() => onEdit?.(testCase)}
            className={onEdit ? 'cursor-pointer' : ''}
          >
            <TableCell className="font-mono text-sm font-medium">
              <div className="break-words">
                {testCase.testcaseId}
              </div>
            </TableCell>
            <TableCell className="font-medium" style={{ maxWidth: '300px' }}>
              <div className="break-words">
                {testCase.title}
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  testCase.status === 'Active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : testCase.status === 'Draft'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}
              >
                {testCase.status}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  testCase.severity === 'Blocker' || testCase.severity === 'Critical'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : testCase.severity === 'Major'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}
              >
                {testCase.severity}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  testCase.priority === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : testCase.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                {testCase.priority}
              </span>
            </TableCell>
            <TableCell>
              <div className="break-words">
                {testCase.type}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {testCase.tags.length > 0 ? (
                  testCase.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
                {testCase.tags.length > 3 && (
                  <span className="text-muted-foreground text-xs">
                    +{testCase.tags.length - 3}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              {new Date(testCase.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {tableContent}
      </ScrollArea>
      {(onPageChange || onPageSizeChange) && (
        <div className="shrink-0 bg-background">
          <TestCasePagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            itemsCount={testCases.length}
            pageSize={pageSize}
            onPageChange={onPageChange || (() => {})}
            onPageSizeChange={onPageSizeChange || (() => {})}
          />
        </div>
      )}
    </div>
  )
}

