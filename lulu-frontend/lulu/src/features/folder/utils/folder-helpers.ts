import type { FolderNode, BreadcrumbItem } from '../types/folder.types'
import { findNodeById as findNodeByIdAdapter } from './folder-adapter'

export function findNodeById(nodes: FolderNode[], id: string): FolderNode | null {
  return findNodeByIdAdapter(nodes, id)
}

export function cloneTree(node: FolderNode): FolderNode {
  return {
    ...node,
    children: node.children.map(cloneTree),
  }
}

export function removeNode(node: FolderNode, idToRemove: string): FolderNode {
  return {
    ...node,
    children: node.children
      .filter((child) => child.id !== idToRemove)
      .map((child) => removeNode(child, idToRemove)),
  }
}

export function addNodeToParent(
  node: FolderNode,
  parentId: string,
  newNode: FolderNode,
  position?: 'before' | 'after',
  referenceId?: string
): FolderNode {
  if (node.id === parentId) {
    let newChildren = [...node.children]

    if (position && referenceId) {
      const refIndex = newChildren.findIndex((c) => c.id === referenceId)
      if (refIndex !== -1) {
        const insertIndex = position === 'before' ? refIndex : refIndex + 1
        newChildren.splice(insertIndex, 0, newNode)
      } else {
        newChildren.push(newNode)
      }
    } else {
      newChildren.push(newNode)
    }

    newChildren = newChildren.map((child, index) => ({
      ...child,
      order: index,
    }))

    return { ...node, children: newChildren }
  }

  return {
    ...node,
    children: node.children.map((child) =>
      addNodeToParent(child, parentId, newNode, position, referenceId)
    ),
  }
}

export function isDescendant(
  ancestorId: string,
  descendantId: string,
  nodes: FolderNode[]
): boolean {
  for (const node of nodes) {
    if (node.id === ancestorId) {
      return checkDescendants(node, descendantId)
    }
    if (isDescendant(ancestorId, descendantId, node.children)) {
      return true
    }
  }
  return false
}

function checkDescendants(node: FolderNode, targetId: string): boolean {
  if (node.id === targetId) return true
  return node.children.some((child) => checkDescendants(child, targetId))
}

export function buildBreadcrumbs(
  node: FolderNode,
  rootNodes: FolderNode[]
): BreadcrumbItem[] {
  const path: BreadcrumbItem[] = []
  let current: FolderNode | null = node

  while (current) {
    path.unshift({ id: current.id, name: current.name })
    // Se o nó tem parentId, buscar o pai
    if (current.parentId) {
      current = findNodeById(rootNodes, current.parentId)
    } else {
      // Se não tem pai, parar
      current = null
    }
  }

  return path
}

