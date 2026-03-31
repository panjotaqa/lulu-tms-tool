'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ProjectService } from '@/features/project/services/project.service'
import type { ProjectResponse } from '@/features/project/services/project.service'
import {
  ApplicationService,
  handleApplicationError,
} from '../services/application.service'
import type {
  ApplicationResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from '../types/application.types'

interface ApplicationFormDialogProps {
  isOpen: boolean
  onClose: () => void
  application?: ApplicationResponse | null
  onSuccess: () => void
}

export function ApplicationFormDialog({
  isOpen,
  onClose,
  application,
  onSuccess,
}: ApplicationFormDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      loadProjects()
      if (application) {
        setName(application.name)
        setProjectId(application.projectId)
      } else {
        setName('')
        setProjectId('')
      }
      setErrors({})
    }
  }, [isOpen, application])

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const response = await ProjectService.findAll({ page: 1, limit: 100 })
      setProjects(response.data)
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!projectId) {
      newErrors.projectId = 'Projeto é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    try {
      if (application) {
        const updateData: UpdateApplicationRequest = {
          name: name.trim(),
        }
        await ApplicationService.update(application.id, updateData)
        toast({
          title: 'Sucesso',
          description: 'Aplicação atualizada com sucesso',
        })
      } else {
        const createData: CreateApplicationRequest = {
          name: name.trim(),
          projectId,
        }
        await ApplicationService.create(createData)
        toast({
          title: 'Sucesso',
          description: 'Aplicação criada com sucesso',
        })
      }
      onSuccess()
      onClose()
    } catch (err) {
      const errorMessage = handleApplicationError(err)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {application ? 'Editar Aplicação' : 'Nova Aplicação'}
            </DialogTitle>
            <DialogDescription>
              {application
                ? 'Atualize as informações da aplicação'
                : 'Preencha os dados para criar uma nova aplicação'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">
                Projeto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={projectId}
                onValueChange={setProjectId}
                disabled={!!application || isLoadingProjects}
              >
                <SelectTrigger id="projectId">
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
              {errors.projectId && (
                <p className="text-sm text-destructive">{errors.projectId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sistema de Vendas"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Salvando...'
                : application
                ? 'Salvar'
                : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

