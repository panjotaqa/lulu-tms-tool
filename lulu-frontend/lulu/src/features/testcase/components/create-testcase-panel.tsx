import { useState } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { TestCaseForm } from './testcase-form'
import { useToast } from '@/hooks/use-toast'
import type { CreateTestCaseRequest } from '../types/testcase.types'
import { TestCaseService } from '../services/testcase.service'

interface CreateTestCasePanelProps {
  isOpen: boolean
  onClose: () => void
  folderId: string
  onCreateSuccess: () => void
}

export function CreateTestCasePanel({
  isOpen,
  onClose,
  folderId,
  onCreateSuccess,
}: CreateTestCasePanelProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: CreateTestCaseRequest) => {
    setIsLoading(true)
    try {
      await TestCaseService.create(data)
      toast({
        title: 'Sucesso',
        description: 'Caso de teste criado com sucesso',
      })
      onCreateSuccess()
      onClose()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar caso de teste',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ResizablePanel
      isOpen={isOpen}
      onClose={onClose}
      defaultWidth="50%"
      minWidth={300}
      maxWidth="80%"
      title="Novo Caso de Teste"
    >
      <TestCaseForm
        folderId={folderId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </ResizablePanel>
  )
}

