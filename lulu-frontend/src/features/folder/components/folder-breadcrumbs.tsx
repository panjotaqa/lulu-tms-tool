import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BreadcrumbItem } from '../types/folder.types'

interface FolderBreadcrumbsProps {
  items: BreadcrumbItem[]
  onNavigate: (id: string) => void
}

export function FolderBreadcrumbs({
  items,
  onNavigate,
}: FolderBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={
              index === items.length - 1
                ? 'font-semibold text-foreground'
                : ''
            }
          >
            {item.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

