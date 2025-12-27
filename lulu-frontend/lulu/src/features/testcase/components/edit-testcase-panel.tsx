import { useState, useEffect } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { TestCaseForm } from './testcase-form'
import { useToast } from '@/hooks/use-toast'
import type { UpdateTestCaseRequest, TestCaseResponse } from '../types/testcase.types'
import { TestCaseService } from '../services/testcase.service'

interface EditTestCasePanelProps {
  isOpen: boolean
  onClose: () => void
  testCaseId: string
  onUpdateSuccess: () => void
}

export function EditTestCasePanel({
  isOpen,
  onClose,
  testCaseId,
  onUpdateSuccess,
}: EditTestCasePanelProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTestCase, setIsLoadingTestCase] = useState(false)
  const [testCase, setTestCase] = useState<TestCaseResponse | null>(null)

  useEffect(() => {
    if (isOpen && testCaseId) {
      loadTestCase()
    } else {
      setTestCase(null)
    }
  }, [isOpen, testCaseId])

  const loadTestCase = async () => {
    setIsLoadingTestCase(true)
    try {
      const data = await TestCaseService.findOne(testCaseId)
      setTestCase(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar caso de teste',
        variant: 'destructive',
      })
      onClose()
    } finally {
      setIsLoadingTestCase(false)
    }
  }

  const handleSubmit = async (data: UpdateTestCaseRequest) => {
    setIsLoading(true)
    try {
      await TestCaseService.update(testCaseId, data)
      toast({
        title: 'Sucesso',
        description: 'Caso de teste atualizado com sucesso',
      })
      onUpdateSuccess()
      onClose()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar caso de teste',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingTestCase) {
    return (
      <ResizablePanel
        isOpen={isOpen}
        onClose={onClose}
        defaultWidth="50%"
        minWidth={300}
        maxWidth="80%"
        title="Editar Caso de Teste"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Carregando caso de teste...</div>
        </div>
      </ResizablePanel>
    )
  }

  if (!testCase) {
    return null
  }

  return (
    <ResizablePanel
      isOpen={isOpen}
      onClose={onClose}
      defaultWidth="50%"
      minWidth={300}
      maxWidth="80%"
      title="Editar Caso de Teste"
    >
      <TestCaseForm
        folderId={testCase.testSuiteId}
        testCase={testCase}
        isEditMode={true}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </ResizablePanel>
  )
}

