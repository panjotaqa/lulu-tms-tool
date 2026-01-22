import { useState } from 'react'
import { TestRunService } from '../services/testrun.service'

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>
  isUploading: boolean
  error: string | null
}

export function useImageUpload(testRunCaseId: string): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await TestRunService.uploadImage(testRunCaseId, file)
      // Retornar URL completa (backend retorna URL relativa)
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      return `${baseUrl}${response.url}`
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao fazer upload da imagem'
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadImage, isUploading, error }
}

