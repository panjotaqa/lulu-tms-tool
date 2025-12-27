import { z } from 'zod'

export interface User {
  id: string
  name: string
  email: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  isArchived: boolean
  createdBy: User
  users: User[]
  createdAt: string
  updatedAt: string
}

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, 'O título deve ter pelo menos 2 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  slug: z
    .string()
    .min(2, 'O slug deve ter pelo menos 2 caracteres')
    .max(100, 'O slug deve ter no máximo 100 caracteres')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'O slug deve conter apenas letras minúsculas, números e hífens'
    ),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  isArchived: z.boolean().default(false),
})

export type ProjectFormData = z.infer<typeof projectSchema>

