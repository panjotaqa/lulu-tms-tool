import { Pencil, Move, FolderPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface FolderContextMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRename: () => void
  onMove: () => void
  onCreateSubfolder: () => void
  children: React.ReactNode
}

export function FolderContextMenu({
  open,
  onOpenChange,
  onRename,
  onMove,
  onCreateSubfolder,
  children,
}: FolderContextMenuProps) {
  const handleAction = (action: () => void) => {
    action()
    onOpenChange(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children}
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleAction(onRename)}>
          <Pencil className="w-4 h-4 mr-2" />
          Renomear
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onMove)}>
          <Move className="w-4 h-4 mr-2" />
          Mover
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction(onCreateSubfolder)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          Criar Subpasta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
