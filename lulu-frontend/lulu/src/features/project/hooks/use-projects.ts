import { useState, useCallback, useEffect } from 'react'
import { ProjectService, handleProjectError, mapProjectResponseToProject } from '../services/project.service'
import type { Project } from '../types/project.types'

interface UseProjectsOptions {
  isArchived: boolean
  pageSize?: number
}

interface UseProjectsReturn {
  projects: Project[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  total: number
  loadProjects: (page?: number) => Promise<void>
  archiveProject: (projectId: string) => Promise<void>
  unarchiveProject: (projectId: string) => Promise<void>
  refreshProjects: () => Promise<void>
}

export function useProjects({ isArchived, pageSize = 10 }: UseProjectsOptions): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const loadProjects = useCallback(async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = isArchived
        ? await ProjectService.findArchived({ page, limit: pageSize })
        : await ProjectService.findAll({ page, limit: pageSize, isArchived: false })

      const mappedProjects = response.data.map(mapProjectResponseToProject)
      setProjects(mappedProjects)
      setTotalPages(response.totalPages)
      setTotal(response.total)
      setCurrentPage(response.page)
    } catch (err) {
      setError(handleProjectError(err))
    } finally {
      setIsLoading(false)
    }
  }, [isArchived, pageSize])

  const archiveProject = useCallback(async (projectId: string) => {
    try {
      await ProjectService.archive(projectId)
      await loadProjects(currentPage)
    } catch (err) {
      setError(handleProjectError(err))
      throw err
    }
  }, [currentPage, loadProjects])

  const unarchiveProject = useCallback(async (projectId: string) => {
    try {
      await ProjectService.unarchive(projectId)
      await loadProjects(currentPage)
    } catch (err) {
      setError(handleProjectError(err))
      throw err
    }
  }, [currentPage, loadProjects])

  const refreshProjects = useCallback(async () => {
    await loadProjects(currentPage)
  }, [currentPage, loadProjects])

  useEffect(() => {
    loadProjects(1)
  }, [loadProjects])

  return {
    projects,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    loadProjects,
    archiveProject,
    unarchiveProject,
    refreshProjects,
  }
}

