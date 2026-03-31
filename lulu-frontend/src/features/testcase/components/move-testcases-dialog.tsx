import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FolderNode } from '@/features/folder/types/folder.types'

interface MoveTestCasesDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (targetFolderId: string) => void
  rootNodes: FolderNode[]
  currentFolderId: string | null
  selectedCount: number
  isLoading?: boolean
}

interface SimpleTreeNodeProps {
  node: FolderNode
  level: number
  selectedId: string | null
  onSelect: (node: FolderNode) => void
  expandedFolders: Set<string>
  onToggleExpand: (id: string) => void
  currentFolderId: string | null
}

function SimpleTreeNode({
  node,
  level,
  selectedId,
  onSelect,
  expandedFolders,
  onToggleExpand,
  currentFolderId,
}: SimpleTreeNodeProps) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedId === node.id
  const isCurrentFolder = currentFolderId === node.id

  const handleClick = () => {
    if (!isCurrentFolder) {
      onSelect(node)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.children.length > 0) {
      onToggleExpand(node.id)
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 rounded-sm cursor-pointer transition-colors',
          isSelected && !isCurrentFolder
            ? 'bg-primary text-primary-foreground'
            : isCurrentFolder
            ? 'bg-muted cursor-not-allowed opacity-50'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center justify-center w-4 h-4"
          disabled={node.children.length === 0}
        >
          {node.children.length > 0 ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>
        {isExpanded ? (
          <FolderOpen className="w-4 h-4" />
        ) : (
          <Folder className="w-4 h-4" />
        )}
        <span className="text-sm">{node.name}</span>
        {isCurrentFolder && (
          <span className="text-xs text-muted-foreground ml-auto">(Atual)</span>
        )}
      </div>
      {isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <SimpleTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
              currentFolderId={currentFolderId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function MoveTestCasesDialog({
  isOpen,
  onClose,
  onConfirm,
  rootNodes,
  currentFolderId,
  selectedCount,
  isLoading = false,
}: MoveTestCasesDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

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

  const handleSelect = (node: FolderNode) => {
    if (node.id !== currentFolderId) {
      setSelectedFolderId(node.id)
    }
  }

  const handleConfirm = () => {
    if (selectedFolderId) {
      onConfirm(selectedFolderId)
    }
  }

  const handleClose = () => {
    setSelectedFolderId(null)
    setExpandedFolders(new Set())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mover Casos de Teste</DialogTitle>
          <DialogDescription>
            Selecione a pasta destino para {selectedCount} caso(s) de teste
            selecionado(s)
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] rounded-md border p-4">
          <div className="space-y-1">
            {rootNodes.map((node) => (
              <SimpleTreeNode
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedFolderId}
                onSelect={handleSelect}
                expandedFolders={expandedFolders}
                onToggleExpand={handleToggleExpand}
                currentFolderId={currentFolderId}
              />
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedFolderId || isLoading}
          >
            {isLoading ? 'Movendo...' : 'Mover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

