const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    const error: ApiError = {
      statusCode: response.status,
      message: data.message || 'Erro ao processar requisição',
      error: data.error,
    }
    throw error
  }

  return data
}

