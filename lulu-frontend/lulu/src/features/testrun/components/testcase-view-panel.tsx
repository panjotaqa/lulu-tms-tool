'use client'

import { useState, useEffect, useCallback } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import ReactMarkdown from 'react-markdown'
import { Edit2, Eye, Save, X, Upload, Loader2 } from 'lucide-react'
import type { TestRunCase } from '../types/testrun.types'
import { useImageUpload } from '../hooks/use-image-upload'
import { TestRunService } from '../services/testrun.service'
import { useDebounce } from '@/hooks/use-debounce'

interface TestCaseViewPanelProps {
  isOpen: boolean
  onClose: () => void
  testRunCase: TestRunCase | null
  onEvidenceUpdate?: (testRunCaseId: string, evidence: string | null) => void
}

export function TestCaseViewPanel({
  isOpen,
  onClose,
  testRunCase,
  onEvidenceUpdate,
}: TestCaseViewPanelProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [evidence, setEvidence] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const { uploadImage, isUploading } = useImageUpload(
    testRunCase?.id || ''
  )

  // Debounce para salvar automaticamente após 2 segundos de inatividade
  const debouncedEvidence = useDebounce(evidence, 2000)

  // Inicializar evidence quando testRunCase muda
  useEffect(() => {
    if (testRunCase) {
      setEvidence(testRunCase.evidence || '')
      setIsEditMode(false)
      setSaveError(null)
    }
  }, [testRunCase])

  // Salvar automaticamente quando evidence muda (com debounce)
  useEffect(() => {
    if (
      testRunCase &&
      debouncedEvidence !== undefined &&
      debouncedEvidence !== (testRunCase.evidence || '') &&
      isEditMode &&
      !isSaving
    ) {
      handleSaveEvidence(debouncedEvidence)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEvidence, isEditMode])

  const handleSaveEvidence = async (evidenceToSave: string) => {
    if (!testRunCase) return

    setIsSaving(true)
    setSaveError(null)

    try {
      await TestRunService.updateTestCaseEvidence(
        testRunCase.id,
        evidenceToSave || null
      )
      if (onEvidenceUpdate) {
        onEvidenceUpdate(testRunCase.id, evidenceToSave || null)
      }
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Erro ao salvar evidências'
      )
      console.error('Erro ao salvar evidências:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = () => {
    handleSaveEvidence(evidence)
  }

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!testRunCase) return

      try {
        const imageUrl = await uploadImage(file)
        // Inserir markdown da imagem no editor
        const imageMarkdown = `![${file.name}](${imageUrl})\n`
        setEvidence((prev) => {
          const cursorPos = prev.length
          return prev.slice(0, cursorPos) + imageMarkdown + prev.slice(cursorPos)
        })
      } catch (err) {
        console.error('Erro ao fazer upload da imagem:', err)
      }
    },
    [testRunCase, uploadImage]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
    // Reset input
    e.target.value = ''
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handler para colar imagens (Ctrl+V)
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (!isEditMode || !testRunCase) return

      const items = e.clipboardData?.items
      if (!items) return

      // Procurar por imagens no clipboard
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await handleImageUpload(file)
          }
          break
        }
      }
    },
    [isEditMode, testRunCase, handleImageUpload]
  )

  // Adicionar event listener para paste quando em modo de edição
  useEffect(() => {
    if (isEditMode) {
      document.addEventListener('paste', handlePaste)
      return () => {
        document.removeEventListener('paste', handlePaste)
      }
    }
  }, [isEditMode, handlePaste])

  if (!testRunCase) {
    return null
  }

  const snapshot = testRunCase.testCaseSnapshot

  return (
    <ResizablePanel
      isOpen={isOpen}
      onClose={onClose}
      defaultWidth="50%"
      minWidth={300}
      maxWidth="80%"
      title="Caso de Teste"
    >
      <div className="flex flex-col h-full">
        {/* Header com botões */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Evidências
                </>
              )}
            </Button>
            {isEditMode && (
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </div>
            )}
          </div>
          {saveError && (
            <div className="text-sm text-destructive">{saveError}</div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Informações do Caso de Teste */}
            <div className="space-y-4 border-b pb-6">
              <div className="space-y-2">
                <Label>ID</Label>
                <div className="text-sm font-mono text-muted-foreground">
                  {snapshot.testcaseId}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <div className="text-sm">{snapshot.title}</div>
              </div>

              {/* Severity, Status, Priority, Type */}
              <div className="grid grid-cols-2 gap-4">
                {snapshot.severity && (
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <div className="text-sm">{snapshot.severity}</div>
                  </div>
                )}

                {snapshot.status && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="text-sm">{snapshot.status}</div>
                  </div>
                )}

                {snapshot.priority && (
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="text-sm">{snapshot.priority}</div>
                  </div>
                )}

                {snapshot.type && (
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="text-sm">{snapshot.type}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Evidências */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Evidências</Label>
                {isEditMode && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="image-upload">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        asChild
                        disabled={isUploading}
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Imagem
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {isEditMode ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="min-h-[400px]"
                >
                  <MDEditor
                    value={evidence}
                    onChange={(value) => setEvidence(value || '')}
                    preview="live"
                    hideToolbar={false}
                    visibleDragBar={false}
                    data-color-mode="dark"
                  />
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {evidence ? (
                    <ReactMarkdown>{evidence}</ReactMarkdown>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Nenhuma evidência adicionada ainda.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </ResizablePanel>
  )
}
