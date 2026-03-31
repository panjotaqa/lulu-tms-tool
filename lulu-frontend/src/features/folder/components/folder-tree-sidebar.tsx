import { useState, useRef, useEffect } from 'react'
import { Plus, Search, MoreVertical } from 'lucide-react'
import { TreeNode, type FolderNode } from './treeNode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FolderTreeSidebarProps {
  rootNodes: FolderNode[]
  selectedId: string | null
  onSelect: (node: FolderNode) => void
  onMove: (
    draggedId: string,
    targetId: string,
    position: 'inside' | 'before' | 'after'
  ) => void
  onRename: (node: FolderNode) => void
  onCreateFolder: () => void
  onCreateSubfolder: (parentNode: FolderNode) => void
  expandedFolders: Set<string>
  onToggleExpand: (id: string) => void
  onExpandAll: () => void
  onCollapseAll: () => void
  projectName: string
}

export function FolderTreeSidebar({
  rootNodes,
  selectedId,
  onSelect,
  onMove,
  onRename,
  onCreateFolder,
  onCreateSubfolder,
  expandedFolders,
  onToggleExpand,
  onExpandAll,
  onCollapseAll,
  projectName,
}: FolderTreeSidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
        setSearchValue('')
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isSearchOpen])

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  return (
    <div className="h-full bg-background border-r flex flex-col w-80 shrink-0 overflow-hidden">
      <div className="p-4 shrink-0">
        <h1 className="mb-3 font-semibold">{projectName}</h1>
        <div className="flex items-center gap-2 min-h-[40px]" ref={searchContainerRef}>
          {isSearchOpen ? (
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar pasta..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
          ) : (
            <>
              <Button onClick={onCreateFolder} className="flex-1 max-w-[48%]">
                <Plus className="w-4 h-4 mr-2" />
                Nova Pasta
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="ml-auto"
                onClick={handleSearchClick}
              >
                <Search className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExpandAll}>
                    Expandir todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCollapseAll}>
                    Recolher todos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 min-h-0">
        {rootNodes.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Nenhuma pasta criada ainda. Clique em "Nova Pasta" para começar.
          </div>
        ) : (
          rootNodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedId={selectedId}
              onSelect={onSelect}
              onMove={onMove}
              onRename={onRename}
              onCreateSubfolder={onCreateSubfolder}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))
        )}
      </div>
    </div>
  )
}

