import { Link } from 'react-router-dom'
import { Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArchiveToggle } from './archive-toggle'
import type { Project } from '../types/project.types'

interface ProjectTableProps {
  projects: Project[]
  onArchiveToggle: (projectId: string, isArchived: boolean) => void
}

export function ProjectTable({ projects, onArchiveToggle }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum projeto encontrado
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Usuários</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>
              <code className="text-xs bg-muted px-2 py-1 rounded">{project.slug}</code>
            </TableCell>
            <TableCell className="max-w-md truncate">
              {project.description || '-'}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  project.isArchived
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {project.isArchived ? 'Arquivado' : 'Ativo'}
              </span>
            </TableCell>
            <TableCell>{project.users.length} usuário(s)</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/app/projects/${project.id}/folders`}>
                    <Folder className="w-4 h-4 mr-2" />
                    Pastas
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/app/projects/${project.id}/edit`}>Editar</Link>
                </Button>
                <ArchiveToggle project={project} onToggle={onArchiveToggle} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

