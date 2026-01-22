'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { ProjectService } from '@/features/project/services/project.service'
import type { ProjectResponse } from '@/features/project/services/project.service'
import { ApplicationFormDialog } from '../components/application-form-dialog'
import {
  ApplicationService,
  handleApplicationError,
} from '../services/application.service'
import type { ApplicationResponse } from '../types/application.types'
import { Pencil, Trash2, Plus } from 'lucide-react'

export function ApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<ApplicationResponse[]>([])
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<ApplicationResponse | null>(null)
  const [deletingApplication, setDeletingApplication] =
    useState<ApplicationResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      loadApplications()
    } else {
      setApplications([])
    }
  }, [selectedProjectId])

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const response = await ProjectService.findAll({ page: 1, limit: 100 })
      setProjects(response.data)
      if (response.data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(response.data[0].id)
      }
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar projetos',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const loadApplications = async () => {
    if (!selectedProjectId) return

    setIsLoading(true)
    try {
      const response = await ApplicationService.findAll({
        projectId: selectedProjectId,
        page: 1,
        limit: 100,
      })
      setApplications(response.data)
    } catch (err) {
      toast({
        title: 'Erro',
        description: handleApplicationError(err),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingApplication(null)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (application: ApplicationResponse) => {
    setEditingApplication(application)
    setIsFormDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingApplication) return

    setIsDeleting(true)
    try {
      await ApplicationService.delete(deletingApplication.id)
      toast({
        title: 'Sucesso',
        description: 'Aplicação deletada com sucesso',
      })
      loadApplications()
      setDeletingApplication(null)
    } catch (err) {
      toast({
        title: 'Erro',
        description: handleApplicationError(err),
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aplicações</h1>
          <p className="text-muted-foreground">
            Gerencie as aplicações dos seus projetos
          </p>
        </div>
        <Button onClick={handleCreate} disabled={!selectedProjectId}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Aplicação
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Filtrar por Projeto</label>
        <Select
          value={selectedProjectId}
          onValueChange={setSelectedProjectId}
          disabled={isLoadingProjects}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {selectedProjectId
            ? 'Nenhuma aplicação encontrada para este projeto'
            : 'Selecione um projeto para visualizar as aplicações'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => {
                const project = projects.find(
                  (p) => p.id === application.projectId,
                )
                return (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.name}
                    </TableCell>
                    <TableCell>{project?.title || '-'}</TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString(
                        'pt-BR',
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(application)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingApplication(application)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ApplicationFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false)
          setEditingApplication(null)
        }}
        application={editingApplication}
        onSuccess={loadApplications}
      />

      <AlertDialog
        open={!!deletingApplication}
        onOpenChange={(open) => !open && setDeletingApplication(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a aplicação "{deletingApplication?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

