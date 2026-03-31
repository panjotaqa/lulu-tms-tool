import type { FolderNode } from '../types/folder.types'

export function getMockFolderTree(_projectId: string): FolderNode {
  return {
    id: 'root',
    name: 'ROOT',
    parentId: null,
    order: 0,
    children: [
      {
        id: '1',
        name: 'Testes de Login',
        parentId: 'root',
        order: 0,
        children: [
          {
            id: '1-1',
            name: 'Cenários Positivos',
            parentId: '1',
            order: 0,
            children: [],
          },
          {
            id: '1-2',
            name: 'Cenários Negativos',
            parentId: '1',
            order: 1,
            children: [],
          },
        ],
      },
      {
        id: '2',
        name: 'Testes de Cadastro',
        parentId: 'root',
        order: 1,
        children: [],
      },
      {
        id: '3',
        name: 'Testes de API',
        parentId: 'root',
        order: 2,
        children: [
          {
            id: '3-1',
            name: 'Endpoints REST',
            parentId: '3',
            order: 0,
            children: [],
          },
        ],
      },
    ],
  }
}
