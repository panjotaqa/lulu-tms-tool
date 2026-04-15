import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Loader2, Mail, Trash2, Users } from 'lucide-react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Project, User } from '../types/project.types'
import { ProjectService, handleProjectError, mapProjectResponseToProject } from '../services/project.service'

const projectMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O email do usuário é obrigatório')
    .email('Informe um email válido'),
})

type ProjectMemberFormData = z.infer<typeof projectMemberSchema>

interface ProjectMembersCardProps {
  project: Project
  onProjectChange: (project: Project) => void
}

export function ProjectMembersCard({ project, onProjectChange }: ProjectMembersCardProps) {
  const { toast } = useToast()
  const [userToRemove, setUserToRemove] = useState<User | null>(null)
  const [isLinkingUser, setIsLinkingUser] = useState(false)
  const [isRemovingUser, setIsRemovingUser] = useState(false)
  const form = useForm<ProjectMemberFormData>({
    resolver: zodResolver(projectMemberSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleLinkUser: SubmitHandler<ProjectMemberFormData> = async (data) => {
    setIsLinkingUser(true)
    try {
      const updatedProject = await ProjectService.linkUser(project.id, data.email.trim())
      onProjectChange(mapProjectResponseToProject(updatedProject))
      form.reset({ email: '' })
      toast({
        title: 'Usuário vinculado',
        description: 'O usuário foi adicionado ao projeto com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Não foi possível vincular o usuário',
        description: handleProjectError(error),
        variant: 'destructive',
      })
    } finally {
      setIsLinkingUser(false)
    }
  }

  const handleRemoveUser = async () => {
    if (!userToRemove) {
      return
    }
    setIsRemovingUser(true)
    try {
      const updatedProject = await ProjectService.unlinkUser(project.id, userToRemove.id)
      onProjectChange(mapProjectResponseToProject(updatedProject))
      toast({
        title: 'Usuário desvinculado',
        description: 'O usuário foi removido do projeto com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Não foi possível desvincular o usuário',
        description: handleProjectError(error),
        variant: 'destructive',
      })
    } finally {
      setIsRemovingUser(false)
      setUserToRemove(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Membros do Projeto</CardTitle>
        <CardDescription>
          Digite o email de um usuário e pressione Enter para vinculá-lo ao projeto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLinkUser)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do usuário</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="email@exemplo.com"
                        autoComplete="email"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLinkingUser}>
                {isLinkingUser ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Vinculando...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Vincular usuário
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Usuários vinculados</p>
              <p className="text-sm text-muted-foreground">
                {project.users.length} usuário(s) no projeto
              </p>
            </div>
            <Badge variant="secondary">{project.users.length}</Badge>
          </div>
          {project.users.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Nenhum usuário foi vinculado ainda.
            </div>
          ) : (
            <ScrollArea className="h-[280px] rounded-lg border">
              <div className="space-y-3 p-4">
                {project.users.map((user) => {
                  const isCreator = user.id === project.createdBy.id
                  return (
                    <div
                      key={user.id}
                      className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">{user.name}</p>
                          {isCreator && <Badge variant="outline">Criador</Badge>}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {isCreator ? (
                        <Badge variant="secondary" className="w-fit">
                          Vinculado automaticamente
                        </Badge>
                      ) : (
                        <AlertDialog
                          open={userToRemove?.id === user.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setUserToRemove(null)
                            }
                          }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => setUserToRemove(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </Button>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover usuário do projeto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O usuário {user.name} deixará de ter acesso ao projeto.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isRemovingUser}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={isRemovingUser}
                                onClick={(event) => {
                                  event.preventDefault()
                                  void handleRemoveUser()
                                }}
                              >
                                {isRemovingUser ? 'Removendo...' : 'Remover'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
