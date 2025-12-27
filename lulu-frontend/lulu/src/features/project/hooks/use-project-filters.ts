import { useSearchParams } from 'react-router-dom'

export function useProjectFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const showArchived = searchParams.get('archived') === 'true'

  const setActiveFilter = () => {
    setSearchParams({})
  }

  const setArchivedFilter = () => {
    setSearchParams({ archived: 'true' })
  }

  return {
    showArchived,
    setActiveFilter,
    setArchivedFilter,
  }
}

