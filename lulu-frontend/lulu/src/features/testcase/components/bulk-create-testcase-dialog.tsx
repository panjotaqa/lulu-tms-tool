import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface BulkCreateTestCaseDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (titles: string[]) => Promise<void>
  isLoading?: boolean
}

export function BulkCreateTestCaseDialog({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: BulkCreateTestCaseDialogProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Separar por quebra de linha e filtrar linhas vazias
    const titles = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (titles.length === 0) {
      setError('Digite pelo menos um caso de teste (uma linha não vazia)')
      return
    }

    try {
      await onSave(titles)
      setText('')
      setError(null)
      onClose()
    } catch (err) {
      setError('Erro ao criar casos de teste. Tente novamente.')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setText('')
      setError(null)
      onClose()
    }
  }

  const lineCount = text.split('\n').filter((line) => line.trim().length > 0)
    .length

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Casos de Teste em Massa</DialogTitle>
          <DialogDescription>
            Digite os títulos dos casos de teste, um por linha. Cada linha não
            vazia será criada como um caso de teste com valores padrão.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bulk-titles">Títulos dos casos de teste</Label>
              {lineCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {lineCount} caso{lineCount !== 1 ? 's' : ''} de teste
                </span>
              )}
            </div>
            <Textarea
              id="bulk-titles"
              value={text}
              onChange={handleTextChange}
              placeholder="Exemplo:&#10;Validar login com credenciais corretas&#10;Validar login com credenciais incorretas&#10;Validar recuperação de senha"
              rows={12}
              className="font-mono text-sm"
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Cada linha representa um caso de teste. Linhas vazias serão
              ignoradas.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || lineCount === 0}>
              {isLoading ? 'Criando...' : `Criar ${lineCount > 0 ? lineCount : ''} caso${lineCount !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

