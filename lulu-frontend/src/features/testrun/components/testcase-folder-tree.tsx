import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FolderNode } from '@/features/folder/types/folder.types'

interface TestCaseFolderTreeNodeProps {
  node: FolderNode
  level: number
  selectedId: string | null
  onSelect: (node: FolderNode) => void
  expandedFolders: Set<string>
  onToggleExpand: (id: string) => void
}

function TestCaseFolderTreeNode({
  node,
  level,
  selectedId,
  onSelect,
  expandedFolders,
  onToggleExpand,
}: TestCaseFolderTreeNodeProps) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedId === node.id

  const handleClick = () => {
    onSelect(node)
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
          isSelected
            ? 'bg-primary text-primary-foreground'
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
      </div>
      {isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TestCaseFolderTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface TestCaseFolderTreeProps {
  rootNodes: FolderNode[]
  selectedId: string | null
  onSelect: (node: FolderNode) => void
  expandedFolders: Set<string>
  onToggleExpand: (id: string) => void
}

export function TestCaseFolderTree({
  rootNodes,
  selectedId,
  onSelect,
  expandedFolders,
  onToggleExpand,
}: TestCaseFolderTreeProps) {
  return (
    <div className="h-full overflow-y-auto">
      {rootNodes.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Nenhuma pasta encontrada
        </div>
      ) : (
        <div>
          {rootNodes.map((node) => (
            <TestCaseFolderTreeNode
              key={node.id}
              node={node}
              level={0}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

