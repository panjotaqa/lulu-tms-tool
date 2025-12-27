import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Project } from '../types/project.types'

interface ArchiveToggleProps {
  project: Project
  onToggle: (projectId: string, isArchived: boolean) => void
}

export function ArchiveToggle({ project, onToggle }: ArchiveToggleProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onToggle(project.id, !project.isArchived)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant={project.isArchived ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {project.isArchived ? 'Desarquivar' : 'Arquivar'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {project.isArchived ? 'Desarquivar Projeto' : 'Arquivar Projeto'}
            </DialogTitle>
            <DialogDescription>
              {project.isArchived
                ? `Tem certeza que deseja desarquivar o projeto "${project.title}"? Ele voltará a aparecer na lista de projetos ativos.`
                : `Tem certeza que deseja arquivar o projeto "${project.title}"? Ele será movido para a lista de projetos arquivados.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              {project.isArchived ? 'Desarquivar' : 'Arquivar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

