import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ProjectForm } from '../components/project-form'
import { ProjectService, handleProjectError, mapProjectResponseToProject } from '../services/project.service'
import type { Project, ProjectFormData } from '../types/project.types'

export function EditProjectPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        navigate('/app/projects')
        return
      }
      setIsLoadingProject(true)
      try {
        const data = await ProjectService.findOne(id)
        setProject(mapProjectResponseToProject(data))
      } catch (err) {
        setError(handleProjectError(err))
        navigate('/app/projects')
      } finally {
        setIsLoadingProject(false)
      }
    }
    loadProject()
  }, [id, navigate])

  const handleSubmit = async (data: ProjectFormData) => {
    if (!project || !id) return

    setIsLoading(true)
    setError(null)
    try {
      await ProjectService.update(id, {
        title: data.title,
        slug: data.slug,
        description: data.description || undefined,
      })
      navigate('/app/projects')
    } catch (err) {
      setError(handleProjectError(err))
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/app/projects')
  }

  if (isLoadingProject) {
    return <div className="text-center py-12 text-muted-foreground">Carregando...</div>
  }

  if (!project) {
    return null
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

