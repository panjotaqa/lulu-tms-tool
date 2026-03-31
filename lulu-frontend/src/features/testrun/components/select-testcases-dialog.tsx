import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TestCaseFolderTree } from './testcase-folder-tree'
import { TestCaseSelectionList } from './testcase-selection-list'
import { useFolders } from '@/features/folder/hooks/use-folders'
import { TestCaseService } from '@/features/testcase/services/testcase.service'
import type { TestCaseListItem } from '@/features/testcase/types/testcase.types'
import type { FolderNode } from '@/features/folder/types/folder.types'

interface SelectTestCasesDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  projectId: string
  initialSelectedIds?: string[]
}

export function SelectTestCasesDialog({
  isOpen,
  onClose,
  onConfirm,
  projectId,
  initialSelectedIds = [],
}: SelectTestCasesDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  )
  const [testCases, setTestCases] = useState<TestCaseListItem[]>([])
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const { rootNodes, isLoading: isLoadingFolders } = useFolders({ projectId })

  useEffect(() => {
    if (isOpen && projectId) {
      loadTestCases()
      // Reset seleção de pasta ao abrir
      setSelectedFolderId(null)
      // Restaurar seleção inicial
      setSelectedIds(new Set(initialSelectedIds))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId])

  const loadTestCases = async () => {
    if (!projectId) return

    setIsLoadingTestCases(true)
    try {
      const cases = await TestCaseService.findByProjectForSelection(projectId)
      setTestCases(cases)
    } catch (error) {
      console.error('Erro ao carregar casos de teste:', error)
      setTestCases([])
    } finally {
      setIsLoadingTestCases(false)
    }
  }

  const handleToggleSelection = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected: boolean) => {
    const filteredTestCases = selectedFolderId
      ? testCases.filter((tc) => tc.testSuiteId === selectedFolderId)
      : testCases

    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        filteredTestCases.forEach((tc) => newSet.add(tc.id))
      } else {
        filteredTestCases.forEach((tc) => newSet.delete(tc.id))
      }
      return newSet
    })
  }

  const handleToggleExpand = (id: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleFolderSelect = (folder: FolderNode) => {
    console.log('Pasta selecionada:', {
      folderId: folder.id,
      folderName: folder.name,
      totalTestCases: testCases.length,
      testCasesInFolder: testCases.filter((tc) => tc.testSuiteId === folder.id).length,
      allTestSuiteIds: [...new Set(testCases.map((tc) => tc.testSuiteId))],
    })
    setSelectedFolderId(folder.id)
  }

  const handleConfirm = () => {
    onConfirm(Array.from(selectedIds))
    onClose()
  }

  const selectedCount = selectedIds.size
  const totalCount = testCases.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Casos de Teste</DialogTitle>
          <DialogDescription>
            Selecione os casos de teste que serão incluídos nesta execução
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex gap-4 min-h-0">
          {/* Tree View - Lado Esquerdo */}
          <div className="w-64 border-r flex flex-col">
            <div className="p-2 border-b">
              <h3 className="text-sm font-medium">Pastas</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoadingFolders ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Carregando pastas...
                </div>
              ) : (
                <TestCaseFolderTree
                  rootNodes={rootNodes}
                  selectedId={selectedFolderId}
                  onSelect={handleFolderSelect}
                  expandedFolders={expandedFolders}
                  onToggleExpand={handleToggleExpand}
                />
              )}
            </div>
          </div>

          {/* Case List - Painel Central */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-2 border-b flex items-center justify-between">
              <h3 className="text-sm font-medium">Casos de Teste</h3>
              {selectedFolderId && (
                <span className="text-xs text-muted-foreground">
                  Filtrado por pasta
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoadingTestCases ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Carregando casos de teste...
                </div>
              ) : (
                <>
                  {selectedFolderId && (
                    <div className="p-2 text-xs text-muted-foreground border-b">
                      Debug: Pasta selecionada: {selectedFolderId} | Total: {testCases.length} | Filtrados: {testCases.filter((tc) => tc.testSuiteId === selectedFolderId).length}
                    </div>
                  )}
                  <TestCaseSelectionList
                    testCases={testCases}
                    selectedIds={selectedIds}
                    onToggleSelection={handleToggleSelection}
                    onSelectAll={handleSelectAll}
                    selectedFolderId={selectedFolderId}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {selectedCount} selecionado(s) / {totalCount} total
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

