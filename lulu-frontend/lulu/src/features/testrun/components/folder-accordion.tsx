import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ExecutionTable } from './execution-table'
import { FolderBreadcrumb } from './folder-breadcrumb'
import { FolderProgressBar } from './folder-progress-bar'
import type { TestRunCase, TestRunCaseStatus } from '../types/testrun.types'
import type { FolderResponse } from '@/features/folder/types/folder.types'

interface FolderGroup {
  folderId: string
  folderTitle: string
  folderHierarchy?: FolderResponse[]
  testCases: TestRunCase[]
}

interface FolderAccordionProps {
  folderGroups: FolderGroup[]
  onStatusChange: (testRunCaseId: string, newStatus: TestRunCaseStatus) => void
  defaultOpenFolders?: string[]
}

export function FolderAccordion({
  folderGroups,
  onStatusChange,
  defaultOpenFolders,
}: FolderAccordionProps) {
  const defaultValue = defaultOpenFolders || folderGroups.map((fg) => fg.folderId)

  if (folderGroups.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Nenhuma pasta encontrada
      </div>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={defaultValue} className="w-full">
      {folderGroups.map((folderGroup) => (
        <AccordionItem key={folderGroup.folderId} value={folderGroup.folderId}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center justify-between w-full pr-4 gap-4">
              {folderGroup.folderHierarchy && folderGroup.folderHierarchy.length > 0 && (
                <FolderBreadcrumb hierarchy={folderGroup.folderHierarchy} />
              )}
              <FolderProgressBar testCases={folderGroup.testCases} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ExecutionTable
              testCases={folderGroup.testCases}
              onStatusChange={onStatusChange}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

