import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('E-mail inválido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

