import { ProjectTable } from './project-table'
import { Button } from '@/components/ui/button'
import type { Project } from '../types/project.types'

interface ProjectListProps {
  projects: Project[]
  onArchiveToggle: (projectId: string, isArchived: boolean) => void
  showArchived?: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function ProjectList({
  projects,
  onArchiveToggle,
  currentPage,
  totalPages,
  total,
  onPageChange,
}: ProjectListProps) {

  return (
    <div className="space-y-4">
      <ProjectTable projects={projects} onArchiveToggle={onArchiveToggle} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {projects.length} de {total} projetos
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

