import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useFolders } from '../hooks/use-folders'
import { useTestCases } from '@/features/testcase/hooks/use-testcases'
import { FolderTreeSidebar } from '../components/folder-tree-sidebar'
import { FolderContentArea } from '../components/folder-content-area'
import { CreateFolderDialog } from '../components/create-folder-dialog'
import { CreateTestCasePanel } from '@/features/testcase/components/create-testcase-panel'
import { EditTestCasePanel } from '@/features/testcase/components/edit-testcase-panel'
import { BulkCreateTestCaseDialog } from '@/features/testcase/components/bulk-create-testcase-dialog'
import { MoveTestCasesDialog } from '@/features/testcase/components/move-testcases-dialog'
import {
  findNodeById,
  isDescendant,
  buildBreadcrumbs,
} from '../utils/folder-helpers'
import type { FolderNode } from '../types/folder.types'

/**
 * Valida os IDs expandidos contra a árvore atual, removendo IDs que não existem mais
 */
function validateExpandedFolders(
  expandedFolders: Set<string>,
  rootNodes: FolderNode[],
): Set<string> {
  const allIds = new Set<string>()
  const collectIds = (node: FolderNode) => {
    allIds.add(node.id)
    node.children.forEach(collectIds)
  }
  rootNodes.forEach(collectIds)

  // Retornar apenas IDs que ainda existem
  return new Set([...expandedFolders].filter((id) => allIds.has(id)))
}

export function FoldersPage() {
  const { id: projectId } = useParams<{ id: string }>()
  const {
    rootNodes: rootNodesFromHook,
    isLoading,
    createFolder,
    updateFolderTitle,
    moveFolder,
  } = useFolders({ projectId: projectId || '' })

  const [selectedNode, setSelectedNode] = useState<FolderNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  )
  const [dialog, setDialog] = useState<{
    type: 'new' | 'rename' | 'subfolder'
    node?: FolderNode
  } | null>(null)
  const [isTestCasePanelOpen, setIsTestCasePanelOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(
    null
  )

  const {
    testCases,
    isLoading: isLoadingTestCases,
    currentPage,
    totalPages,
    total,
    pageSize,
    selectedTestCaseIds,
    loadTestCases,
    createBulkTestCases,
    refreshTestCases,
    setPageSize,
    toggleTestCaseSelection,
    selectAllTestCases,
    moveTestCases,
  } = useTestCases({
    folderId: selectedNode?.id || null,
    pageSize: 10,
  })

  // Ref para rastrear se é a primeira carga
  const isFirstLoad = useRef(true)

  // Atualizar selectedNode quando rootNodes mudar, preservando estado de expansão
  useEffect(() => {
    setSelectedNode((prev) => {
      // Manter seleção se o nó ainda existir
      if (prev) {
        const stillExists = findNodeById(rootNodesFromHook, prev.id)
        if (stillExists) {
          return stillExists
        }
      }
      // Se há pastas, selecionar a primeira pasta raiz
      if (rootNodesFromHook.length > 0) {
        return rootNodesFromHook[0]
      }
      // Caso contrário, não selecionar nada
      return null
    })

    // Validar e preservar expandedFolders
    setExpandedFolders((prev) => {
      // Na primeira carga, resetar para vazio
      if (isFirstLoad.current) {
        isFirstLoad.current = false
        return new Set()
      }

      // Validar IDs existentes
      const validated = validateExpandedFolders(prev, rootNodesFromHook)

      // Retornar estado validado
      return validated
    })
  }, [rootNodesFromHook])

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

  const getAllFolderIds = (nodes: FolderNode[]): string[] => {
    const ids: string[] = []
    const collectIds = (node: FolderNode) => {
      ids.push(node.id)
      node.children.forEach(collectIds)
    }
    nodes.forEach(collectIds)
    return ids
  }

  const handleExpandAll = () => {
    const allIds = getAllFolderIds(rootNodesFromHook)
    setExpandedFolders(new Set(allIds))
  }

  const handleCollapseAll = () => {
    setExpandedFolders(new Set())
  }

  const handleMove = async (
    draggedId: string,
    targetId: string,
    position: 'inside' | 'before' | 'after'
  ) => {
    // Validações no frontend
    if (draggedId === targetId) {
      return
    }

    if (isDescendant(draggedId, targetId, rootNodesFromHook)) {
      return
    }

    // Preservar estado atual antes da operação
    const previousExpanded = new Set(expandedFolders)
    const shouldExpandTarget = position === 'inside'

    try {
      await moveFolder(draggedId, targetId, position)

      // Restaurar estado preservado
      setExpandedFolders(previousExpanded)

      // Expandir pasta de destino se for 'inside'
      if (shouldExpandTarget) {
        setExpandedFolders((prev) => {
          const newSet = new Set(prev)
          newSet.add(targetId)
          return newSet
        })
      }
    } catch (error) {
      // Em caso de erro, restaurar estado anterior
      setExpandedFolders(previousExpanded)
      // Erro já tratado no hook
    }
  }

  const handleCreateFolder = () => {
    setDialog({ type: 'new' })
  }

  const handleCreateSubfolder = (parentNode: FolderNode) => {
    setDialog({ type: 'subfolder', node: parentNode })
  }

  const handleRename = (node: FolderNode) => {
    setDialog({ type: 'rename', node })
  }

  const handleSaveFolder = async (name: string) => {
    if (!dialog) return

    // Preservar estado atual antes da operação
    const previousExpanded = new Set(expandedFolders)
    const previousSelected = selectedNode?.id

    try {
      if (dialog.type === 'new') {
        // Criar pasta na raiz (sem parentId)
        await createFolder(name)
        // Estado será preservado automaticamente pelo useEffect
      } else if (dialog.type === 'subfolder' && dialog.node) {
        await createFolder(name, dialog.node.id)
        // Expandir pasta pai e preservar resto do estado
        setExpandedFolders((prev) => {
          const newSet = new Set(prev)
          newSet.add(dialog.node!.id)
          return newSet
        })
      } else if (dialog.type === 'rename' && dialog.node) {
        await updateFolderTitle(dialog.node.id, name)
        // Atualizar selectedNode se for o mesmo
        if (selectedNode?.id === dialog.node.id) {
          const updatedNode = findNodeById(rootNodesFromHook, dialog.node.id)
          if (updatedNode) {
            setSelectedNode(updatedNode)
          }
        }
        // Estado será preservado automaticamente pelo useEffect
      }
      setDialog(null)
    } catch (error) {
      // Em caso de erro, restaurar estado anterior
      setExpandedFolders(previousExpanded)
      if (previousSelected) {
        const node = findNodeById(rootNodesFromHook, previousSelected)
        if (node) {
          setSelectedNode(node)
        }
      }
      // Erro já tratado no hook
    }
  }

  const handleNavigate = (id: string) => {
    const node = findNodeById(rootNodesFromHook, id)
    if (node) {
      setSelectedNode(node)
    }
  }

  const handleEditTestCase = (testCase: any) => {
    setEditingTestCaseId(testCase.id)
  }

  const handleTestCaseUpdated = () => {
    setEditingTestCaseId(null)
    refreshTestCases()
  }

  const handleMoveTestCases = () => {
    setIsMoveDialogOpen(true)
  }

  const handleConfirmMove = async (targetFolderId: string) => {
    try {
      await moveTestCases(targetFolderId)
      setIsMoveDialogOpen(false)
    } catch (error) {
      // Erro já tratado no hook com toast
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando pastas...</div>
      </div>
    )
  }

  // Se selectedNode não estiver definido e houver pastas, selecionar a primeira
  const displayNode = selectedNode || (rootNodesFromHook.length > 0 ? rootNodesFromHook[0] : null)

  // Se não há pastas e nenhuma selecionada, mostrar área vazia
  if (!displayNode) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex -m-6 overflow-hidden min-h-0">
          <FolderTreeSidebar
            rootNodes={rootNodesFromHook}
            selectedId={null}
            onSelect={setSelectedNode}
            onMove={handleMove}
            onRename={handleRename}
            onCreateFolder={handleCreateFolder}
            onCreateSubfolder={handleCreateSubfolder}
            expandedFolders={expandedFolders}
            onToggleExpand={handleToggleExpand}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            projectName="Projeto de Testes"
          />
        <FolderContentArea
          folderName=""
          folderId={null}
          breadcrumbs={[]}
          onNavigate={handleNavigate}
          onCreateTestCase={() => setIsTestCasePanelOpen(true)}
          onCreateBulkTestCases={() => setIsBulkDialogOpen(true)}
          testCases={[]}
          isLoadingTestCases={false}
          currentPage={1}
          totalPages={1}
          total={0}
        />
          <CreateFolderDialog
            isOpen={dialog !== null}
            onClose={() => setDialog(null)}
            onSave={handleSaveFolder}
            title={
              dialog?.type === 'new'
                ? 'Nova Pasta'
                : dialog?.type === 'subfolder'
                ? 'Nova Subpasta'
                : 'Renomear Pasta'
            }
            initialValue={dialog?.type === 'rename' ? dialog.node?.name : ''}
          />
        </div>
      </DndProvider>
    )
  }

  const breadcrumbs = buildBreadcrumbs(displayNode, rootNodesFromHook)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex -m-6 overflow-hidden min-h-0">
        <FolderTreeSidebar
          rootNodes={rootNodesFromHook}
          selectedId={displayNode.id}
          onSelect={setSelectedNode}
          onMove={handleMove}
          onRename={handleRename}
          onCreateFolder={handleCreateFolder}
          onCreateSubfolder={handleCreateSubfolder}
          expandedFolders={expandedFolders}
          onToggleExpand={handleToggleExpand}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          projectName="Projeto de Testes"
        />

        <FolderContentArea
          folderName={displayNode.name}
          folderId={displayNode.id}
          breadcrumbs={breadcrumbs}
          onNavigate={handleNavigate}
          onCreateTestCase={() => setIsTestCasePanelOpen(true)}
          onCreateBulkTestCases={() => setIsBulkDialogOpen(true)}
          onEditTestCase={handleEditTestCase}
          onMoveTestCases={handleMoveTestCases}
          testCases={testCases}
          isLoadingTestCases={isLoadingTestCases}
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={loadTestCases}
          onPageSizeChange={setPageSize}
          selectedTestCaseIds={selectedTestCaseIds}
          onSelectionChange={toggleTestCaseSelection}
          onSelectAll={selectAllTestCases}
        />

        <CreateFolderDialog
          isOpen={dialog !== null}
          onClose={() => setDialog(null)}
          onSave={handleSaveFolder}
          title={
            dialog?.type === 'new'
              ? 'Nova Pasta'
              : dialog?.type === 'subfolder'
              ? 'Nova Subpasta'
              : 'Renomear Pasta'
          }
          initialValue={dialog?.type === 'rename' ? dialog.node?.name : ''}
        />

        {selectedNode && (
          <>
            <CreateTestCasePanel
              isOpen={isTestCasePanelOpen}
              onClose={() => setIsTestCasePanelOpen(false)}
              folderId={selectedNode.id}
              onCreateSuccess={() => {
                refreshTestCases()
              }}
            />
            <BulkCreateTestCaseDialog
              isOpen={isBulkDialogOpen}
              onClose={() => setIsBulkDialogOpen(false)}
              onSave={async (titles) => {
                await createBulkTestCases(titles)
              }}
              isLoading={isLoadingTestCases}
            />
            {editingTestCaseId && (
              <EditTestCasePanel
                isOpen={!!editingTestCaseId}
                onClose={() => setEditingTestCaseId(null)}
                testCaseId={editingTestCaseId}
                onUpdateSuccess={handleTestCaseUpdated}
              />
            )}
            <MoveTestCasesDialog
              isOpen={isMoveDialogOpen}
              onClose={() => setIsMoveDialogOpen(false)}
              onConfirm={handleConfirmMove}
              rootNodes={rootNodesFromHook}
              currentFolderId={selectedNode?.id || null}
              selectedCount={selectedTestCaseIds.size}
              isLoading={isLoadingTestCases}
            />
          </>
        )}
      </div>
    </DndProvider>
  )
}


