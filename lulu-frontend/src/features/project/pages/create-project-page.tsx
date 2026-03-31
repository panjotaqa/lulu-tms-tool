import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ProjectForm } from '../components/project-form'
import { ProjectService, handleProjectError } from '../services/project.service'
import type { ProjectFormData } from '../types/project.types'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await ProjectService.create({
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

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </div>
    </div>
  )
}

