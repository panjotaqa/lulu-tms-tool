import { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  EllipsisVertical,
} from 'lucide-react'
import { FolderContextMenu } from './folder-context-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FolderNode } from '../types/folder.types'

export type { FolderNode }

interface TreeNodeProps {
  node: FolderNode
  level: number
  selectedId: string | null
  onSelect: (node: FolderNode) => void
  onMove: (
    draggedId: string,
    targetId: string,
    position: 'inside' | 'before' | 'after'
  ) => void
  onRename: (node: FolderNode) => void
  onCreateSubfolder: (parentNode: FolderNode) => void
  expandedFolders: Set<string>
  onToggleExpand: (id: string) => void
}

const ITEM_TYPE = 'FOLDER'

export function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  onMove,
  onRename,
  onCreateSubfolder,
  expandedFolders,
  onToggleExpand,
}: TreeNodeProps) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [dropPosition, setDropPosition] = useState<
    'inside' | 'before' | 'after' | null
  >(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedId === node.id

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string }, monitor) => {
      if (item.id === node.id) return

      const hoverBoundingRect = nodeRef.current?.getBoundingClientRect()
      if (!hoverBoundingRect) return

      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return

      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      const hoverHeight = hoverBoundingRect.height

      if (hoverClientY < hoverHeight * 0.25) {
        setDropPosition('before')
      } else if (hoverClientY > hoverHeight * 0.75) {
        setDropPosition('after')
      } else {
        setDropPosition('inside')
      }
    },
    drop: (item: { id: string }) => {
      if (item.id !== node.id && dropPosition) {
        onMove(item.id, node.id, dropPosition)
      }
      setDropPosition(null)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  })

  const attachRef = (el: HTMLDivElement | null) => {
    nodeRef.current = el
    drag(el)
    drop(el)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.children.length > 0) {
      onToggleExpand(node.id)
    }
  }

  const getDropIndicatorClass = () => {
    if (!isOver || !dropPosition) return ''

    if (dropPosition === 'before') {
      return 'border-t-2 border-primary'
    } else if (dropPosition === 'after') {
      return 'border-b-2 border-primary'
    } else {
      return 'bg-primary/10 border-2 border-primary border-dashed'
    }
  }

  return (
    <div>
      <div
        ref={attachRef}
        className={cn(
          'flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all group',
          isSelected && 'bg-primary/10 text-primary',
          !isSelected && 'hover:bg-accent',
          isDragging && 'opacity-50',
          getDropIndicatorClass()
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => onSelect(node)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 p-0 hover:bg-transparent"
          onClick={handleToggle}
        >
          {node.children.length > 0 &&
            (isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </Button>

        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-primary shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
        )}

        <span className="flex-1 truncate text-sm">{node.name}</span>

        <FolderContextMenu
            open={contextMenuOpen}
            onOpenChange={setContextMenuOpen}
            onRename={() => onRename(node)}
            onMove={() => {}}
            onCreateSubfolder={() => onCreateSubfolder(node)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
          </FolderContextMenu>
      </div>

      {isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onMove={onMove}
              onRename={onRename}
              onCreateSubfolder={onCreateSubfolder}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

