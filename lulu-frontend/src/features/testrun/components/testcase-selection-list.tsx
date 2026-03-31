import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TestCaseListItem } from '@/features/testcase/types/testcase.types'

interface TestCaseSelectionListProps {
  testCases: TestCaseListItem[]
  selectedIds: Set<string>
  onToggleSelection: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  selectedFolderId: string | null
}

export function TestCaseSelectionList({
  testCases,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  selectedFolderId,
}: TestCaseSelectionListProps) {
  // Filtrar casos pela pasta selecionada
  const filteredTestCases = selectedFolderId
    ? testCases.filter((tc) => tc.testSuiteId === selectedFolderId)
    : testCases

  const isAllSelected =
    filteredTestCases.length > 0 &&
    filteredTestCases.every((tc) => selectedIds.has(tc.id))
  const isAnySelected =
    filteredTestCases.length > 0 &&
    filteredTestCases.some((tc) => selectedIds.has(tc.id))

  if (filteredTestCases.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        {selectedFolderId
          ? 'Nenhum caso de teste nesta pasta'
          : 'Selecione uma pasta para ver os casos de teste'}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestCases.map((testCase) => (
              <TableRow key={testCase.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(testCase.id)}
                    onChange={(e) =>
                      onToggleSelection(testCase.id, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Selecionar caso de teste ${testCase.testcaseId}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {testCase.testcaseId}
                </TableCell>
                <TableCell>{testCase.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

