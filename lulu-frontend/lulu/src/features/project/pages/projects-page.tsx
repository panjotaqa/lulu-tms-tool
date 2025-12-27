import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProjectList } from '../components/project-list'
import { useProjectFilters } from '../hooks/use-project-filters'
import { useProjects } from '../hooks/use-projects'
import { useProjectArchive } from '../hooks/use-project-archive'

export function ProjectsPage() {
  const { showArchived, setActiveFilter, setArchivedFilter } = useProjectFilters()
  const projects = useProjects({ isArchived: showArchived, pageSize: 10 })
  const { handleArchiveToggle } = useProjectArchive({ projects })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {showArchived ? 'Projetos Arquivados' : 'Projetos'}
          </h1>
          <p className="text-muted-foreground">
            {showArchived
              ? 'Gerencie seus projetos arquivados'
              : 'Gerencie seus projetos ativos'}
          </p>
        </div>
        {!showArchived && (
          <Button asChild>
            <Link to="/app/projects/create">Novo Projeto</Link>
          </Button>
        )}
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant={!showArchived ? 'default' : 'ghost'}
          onClick={setActiveFilter}
        >
          Ativos
        </Button>
        <Button
          variant={showArchived ? 'default' : 'ghost'}
          onClick={setArchivedFilter}
        >
          Arquivados
        </Button>
      </div>

      {projects.error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {projects.error}
        </div>
      )}

      {projects.isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : (
        <ProjectList
          projects={projects.projects}
          onArchiveToggle={handleArchiveToggle}
          showArchived={showArchived}
          currentPage={projects.currentPage}
          totalPages={projects.totalPages}
          total={projects.total}
          onPageChange={projects.loadProjects}
        />
      )}
    </div>
  )
}

