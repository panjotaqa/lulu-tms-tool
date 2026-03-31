import type { FolderNode } from '../types/folder.types'
import type { FolderResponse, FolderTreeResponse } from '../types/folder.types'

/**
 * Converte a resposta do backend (array) para um array de pastas raiz do frontend
 * Retorna array de FolderNode (pastas raiz com parentFolderId === null)
 */
export function backendToFrontend(folders: FolderTreeResponse): FolderNode[] {
  // Criar um mapa para acesso rápido
  const folderMap = new Map<string, FolderResponse>()
  folders.forEach((folder) => {
    folderMap.set(folder.id, folder)
  })

  // Função recursiva para construir a árvore
  function buildNode(folder: FolderResponse): FolderNode {
    const children: FolderNode[] = []

    // Encontrar todos os filhos desta pasta
    if (folder.children && folder.children.length > 0) {
      // Se já vier com children ordenados do backend
      folder.children.forEach((child) => {
        children.push(buildNode(child))
      })
    } else {
      // Buscar filhos no array original
      folders
        .filter((f) => f.parentFolderId === folder.id)
        .sort((a, b) => a.order - b.order)
        .forEach((child) => {
          children.push(buildNode(child))
        })
    }

    return {
      id: folder.id,
      name: folder.title,
      parentId: folder.parentFolderId,
      order: folder.order,
      children,
    }
  }

  // Encontrar todas as pastas raiz (parentFolderId === null)
  const rootFolders = folders
    .filter((folder) => folder.parentFolderId === null)
    .sort((a, b) => a.order - b.order)

  // Retornar array de pastas raiz (pode ser array vazio se não houver pastas)
  return rootFolders.map((folder) => buildNode(folder))
}

/**
 * Converte FolderNode do frontend para CreateFolderRequest do backend
 */
export function frontendToCreateDto(
  name: string,
  projectId: string,
  parentId?: string
): { title: string; projectId: string; parentFolderId?: string } {
  return {
    title: name,
    projectId,
    // Se parentId for undefined/null, não incluir parentFolderId (cria na raiz)
    // Se parentId for fornecido, usar como parentFolderId
    ...(parentId && { parentFolderId: parentId }),
  }
}

/**
 * Calcula a ordem de destino baseada na posição (before/after)
 */
export function calculateTargetOrder(
  targetNode: FolderNode,
  position: 'before' | 'after',
  siblings: FolderNode[]
): number {
  const targetIndex = siblings.findIndex((s) => s.id === targetNode.id)

  if (position === 'before') {
    return targetIndex
  } else {
    // 'after'
    return targetIndex + 1
  }
}

/**
 * Encontra um nó por ID em um array de pastas raiz
 */
export function findNodeById(
  nodes: FolderNode[],
  id: string
): FolderNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeInTree(node, id)
    if (found) return found
  }
  return null
}

/**
 * Função auxiliar para buscar recursivamente em uma árvore
 */
function findNodeInTree(node: FolderNode, id: string): FolderNode | null {
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNodeInTree(child, id)
    if (found) return found
  }
  return null
}

/**
 * Encontra todos os irmãos de um nó (incluindo o próprio node)
 */
export function findSiblings(
  node: FolderNode,
  rootNodes: FolderNode[]
): FolderNode[] {
  const parentId = node.parentId
  
  // Se não tem pai (é pasta raiz), os irmãos são todas as pastas raiz (incluindo o próprio node)
  if (!parentId) {
    return rootNodes.sort((a, b) => a.order - b.order)
  }

  // Buscar o pai na árvore
  const parent = findNodeById(rootNodes, parentId)
  if (!parent) return []

  // Retornar todos os filhos do pai (incluindo o próprio node)
  return [...parent.children].sort((a, b) => a.order - b.order)
}

