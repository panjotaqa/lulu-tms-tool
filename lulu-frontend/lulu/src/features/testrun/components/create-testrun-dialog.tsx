import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ProjectService } from '@/features/project/services/project.service'
import { SelectTestCasesDialog } from './select-testcases-dialog'
import { Link2 } from 'lucide-react'
import type { CreateTestRunRequest } from '../types/testrun.types'
import type { ProjectResponse } from '@/features/project/services/project.service'

interface CreateTestRunDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTestRunRequest) => Promise<void>
  isLoading?: boolean
}

export function CreateTestRunDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateTestRunDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [milestone, setMilestone] = useState('')
  const [projectId, setProjectId] = useState('')
  const [defaultAssigneeId, setDefaultAssigneeId] = useState('')
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      loadProjects()
    } else {
      // Reset form when dialog closes
      setTitle('')
      setDescription('')
      setMilestone('')
      setProjectId('')
      setDefaultAssigneeId('')
      setSelectedTestCaseIds([])
      setErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const response = await ProjectService.findAll({ page: 1, limit: 100, isArchived: false })
      setProjects(response.data)
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (!projectId) {
      newErrors.projectId = 'Projeto é obrigatório'
    }

    if (selectedTestCaseIds.length === 0) {
      newErrors.testCaseIds = 'É necessário selecionar pelo menos um caso de teste'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        milestone: milestone.trim() || undefined,
        projectId,
        defaultAssigneeId: defaultAssigneeId || undefined,
        testCaseIds: selectedTestCaseIds,
      })
      onClose()
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Test Run</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova execução de teste
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Test Run - Sprint 1"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo desta execução de teste"
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone">Milestone</Label>
            <Input
              id="milestone"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Ex: v1.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">
              Projeto <span className="text-destructive">*</span>
            </Label>
            <Select
              value={projectId}
              onValueChange={(value) => {
                setProjectId(value)
                setDefaultAssigneeId('') // Reset assignee when project changes
              }}
              disabled={isLoadingProjects}
            >
              <SelectTrigger id="project" className={errors.projectId ? 'border-destructive' : ''}>
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
            <Label htmlFor="defaultAssignee">Atribuído por Padrão</Label>
            <Select
              value={defaultAssigneeId || undefined}
              onValueChange={(value) => setDefaultAssigneeId(value || '')}
              disabled={!projectId}
            >
              <SelectTrigger id="defaultAssignee">
                <SelectValue placeholder="Selecione um usuário (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Buscar usuários do projeto selecionado */}
                <p className="px-2 py-1.5 text-sm text-muted-foreground">
                  Seleção de usuários em breve
                </p>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Por enquanto, a seleção de usuários não está disponível
            </p>
          </div>

          <div className="space-y-2">
            <Label>Casos de Teste</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSelectDialogOpen(true)}
                disabled={!projectId}
                className="w-full"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Vincular casos de teste
              </Button>
            </div>
            {selectedTestCaseIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedTestCaseIds.length} caso(s) de teste selecionado(s)
              </p>
            )}
            {errors.testCaseIds && (
              <p className="text-sm text-destructive">{errors.testCaseIds}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Test Run'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {projectId && (
        <SelectTestCasesDialog
          isOpen={isSelectDialogOpen}
          onClose={() => setIsSelectDialogOpen(false)}
          onConfirm={(ids) => {
            setSelectedTestCaseIds(ids)
            setIsSelectDialogOpen(false)
          }}
          projectId={projectId}
          initialSelectedIds={selectedTestCaseIds}
        />
      )}
    </Dialog>
  )
}

