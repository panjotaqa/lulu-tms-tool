import { useCallback } from 'react'
import type { UseProjectsReturn } from './use-projects'

interface UseProjectArchiveOptions {
  projects: UseProjectsReturn
}

interface UseProjectArchiveReturn {
  handleArchiveToggle: (projectId: string, isArchived: boolean) => Promise<void>
}

export function useProjectArchive({ projects }: UseProjectArchiveOptions): UseProjectArchiveReturn {
  const handleArchiveToggle = useCallback(async (projectId: string, isArchived: boolean) => {
    if (isArchived) {
      await projects.archiveProject(projectId)
    } else {
      await projects.unarchiveProject(projectId)
    }
  }, [projects])

  return {
    handleArchiveToggle,
  }
}

