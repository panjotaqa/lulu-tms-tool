import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { FolderService } from '../services/folder.service'
import { backendToFrontend, frontendToCreateDto } from '../utils/folder-adapter'
import type { FolderNode } from '../types/folder.types'

interface UseFoldersOptions {
  projectId: string
}

interface UseFoldersReturn {
  rootNodes: FolderNode[]
  isLoading: boolean
  error: string | null
  createFolder: (name: string, parentId?: string) => Promise<void>
  updateFolderTitle: (id: string, name: string) => Promise<void>
  moveFolder: (
    draggedId: string,
    targetId: string,
    position: 'inside' | 'before' | 'after'
  ) => Promise<void>
  refresh: () => Promise<void>
}

export function useFolders({ projectId }: UseFoldersOptions): UseFoldersReturn {
  const [rootNodes, setRootNodes] = useState<FolderNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadFolders = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const folders = await FolderService.findByProject(projectId)
      // backendToFrontend retorna array de pastas raiz (pode ser vazio)
      const rootFolders = backendToFrontend(folders)
      setRootNodes(rootFolders)
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Erro ao carregar pastas do projeto'
      setError(errorMessage)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
      // Em caso de erro, definir array vazio (usuário ainda pode criar pastas)
      setRootNodes([])
    } finally {
      setIsLoading(false)
    }
  }, [projectId, toast])

  useEffect(() => {
    loadFolders()
  }, [loadFolders])

  const createFolder = useCallback(
    async (name: string, parentId?: string) => {
      try {
        const dto = frontendToCreateDto(name, projectId, parentId)
        await FolderService.create(dto)
        await loadFolders()
        toast({
          title: 'Sucesso',
          description: 'Pasta criada com sucesso',
        })
      } catch (err: any) {
        const errorMessage = err?.message || 'Erro ao criar pasta'
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        })
        throw err
      }
    },
    [projectId, loadFolders, toast]
  )

  const updateFolderTitle = useCallback(
    async (id: string, name: string) => {
      try {
        await FolderService.updateTitle(id, { title: name })
        await loadFolders()
        toast({
          title: 'Sucesso',
          description: 'Pasta renomeada com sucesso',
        })
      } catch (err: any) {
        const errorMessage = err?.message || 'Erro ao renomear pasta'
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        })
        throw err
      }
    },
    [loadFolders, toast]
  )

  const moveFolder = useCallback(
    async (
      draggedId: string,
      targetId: string,
      position: 'inside' | 'before' | 'after'
    ) => {
      try {
        // Validações básicas
        if (draggedId === targetId) {
          throw new Error('Não é possível mover uma pasta para ela mesma')
        }

        // Importar funções auxiliares
        const {
          findNodeById,
          findSiblings,
          calculateTargetOrder,
        } = await import('../utils/folder-adapter')

        const draggedNode = findNodeById(rootNodes, draggedId)
        if (!draggedNode) {
          throw new Error('Pasta a ser movida não encontrada')
        }

        if (position === 'inside') {
          // Mover para dentro de outra pasta
          const targetNode = findNodeById(rootNodes, targetId)
          if (!targetNode) {
            throw new Error('Pasta de destino não encontrada')
          }
          
          const targetParentId = targetId
          // Calcular newPosition baseado nos filhos do target
          const newPosition = targetNode.children.length

          await FolderService.move(draggedId, {
            targetParentId,
            newPosition,
          })
        } else {
          // Mover antes ou depois (reordenação)
          const targetNode = findNodeById(rootNodes, targetId)
          if (!targetNode) {
            throw new Error('Pasta de destino não encontrada')
          }

          // Encontrar irmãos do target (incluindo o próprio target)
          const siblings = findSiblings(targetNode, rootNodes)
          
          // Remover o draggedNode dos siblings se estiver presente
          const siblingsWithoutDragged = siblings.filter((s) => s.id !== draggedId)
          
          // Calcular a posição de destino
          const newPosition = calculateTargetOrder(targetNode, position, siblingsWithoutDragged)

          // Determinar targetParentId
          const targetParentId = targetNode.parentId || null

          // Se está movendo para o mesmo pai, usar reorder
          const draggedParentId = draggedNode.parentId || null
          if (draggedParentId === targetParentId) {
            await FolderService.reorder(draggedId, { newOrder: newPosition })
          } else {
            // Se está mudando de pai, usar move
            await FolderService.move(draggedId, {
              targetParentId,
              newPosition,
            })
          }
        }

        await loadFolders()
        toast({
          title: 'Sucesso',
          description: 'Pasta movida com sucesso',
        })
      } catch (err: any) {
        const errorMessage = err?.message || 'Erro ao mover pasta'
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        })
        throw err
      }
    },
    [rootNodes, loadFolders, toast]
  )

  return {
    rootNodes,
    isLoading,
    error,
    createFolder,
    updateFolderTitle,
    moveFolder,
    refresh: loadFolders,
  }
}

