import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { FolderResponse } from '@/features/folder/types/folder.types'

interface FolderBreadcrumbProps {
  hierarchy: FolderResponse[]
}

export function FolderBreadcrumb({ hierarchy }: FolderBreadcrumbProps) {
  if (hierarchy.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        {hierarchy.map((folder, index) => {
          const isLast = index === hierarchy.length - 1

          return (
            <React.Fragment key={folder.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-medium">{folder.title}</BreadcrumbPage>
                ) : (
                  <span className="text-muted-foreground text-sm">{folder.title}</span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

