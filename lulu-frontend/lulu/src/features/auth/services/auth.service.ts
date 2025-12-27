import { apiRequest, type ApiError } from '@/lib/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  id: string
  name: string
  email: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  static async register(userData: RegisterRequest): Promise<UserResponse> {
    return apiRequest<UserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  static setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  static removeToken(): void {
    localStorage.removeItem('auth_token')
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const apiError = error as ApiError
    if (Array.isArray(apiError.message)) {
      return apiError.message.join(', ')
    }
    return apiError.message
  }
  return 'Erro ao processar requisição. Tente novamente.'
}

