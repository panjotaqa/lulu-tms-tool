import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  CreateTestCaseRequest,
  UpdateTestCaseRequest,
  TestCaseResponse,
} from '../types/testcase.types'
import {
  Severity,
  Status,
  Priority,
  TestType,
  Layer,
  Environment,
  AutomationStatus,
} from '../types/testcase.types'

interface TestCaseFormProps {
  folderId: string
  testCase?: TestCaseResponse
  isEditMode?: boolean
  onSubmit: (
    data: CreateTestCaseRequest | UpdateTestCaseRequest
  ) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TestCaseForm({
  folderId,
  testCase,
  isEditMode = false,
  onSubmit,
  onCancel,
  isLoading = false,
}: TestCaseFormProps) {
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>(Severity.TRIVIAL)
  const [status, setStatus] = useState<Status>(Status.ACTIVE)
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM)
  const [type, setType] = useState<TestType>(TestType.FUNCTIONAL)
  const [isFlaky, setIsFlaky] = useState(false)
  const [milestone, setMilestone] = useState('')
  const [userStoryLink, setUserStoryLink] = useState('')
  const [layer, setLayer] = useState<Layer>(Layer.E2E)
  const [environment, setEnvironment] = useState<Environment>(
    Environment.INTEGRATION
  )
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>(
    AutomationStatus.MANUAL
  )
  const [toBeAutomated, setToBeAutomated] = useState(false)
  const [description, setDescription] = useState('')
  const [preConditions, setPreConditions] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pré-preencher campos quando testCase for fornecido
  useEffect(() => {
    if (testCase) {
      setTitle(testCase.title || '')
      setSeverity(testCase.severity || Severity.TRIVIAL)
      setStatus(testCase.status || Status.ACTIVE)
      setPriority(testCase.priority || Priority.MEDIUM)
      setType(testCase.type || TestType.FUNCTIONAL)
      setIsFlaky(testCase.isFlaky ?? false)
      setMilestone(testCase.milestone || '')
      setUserStoryLink(testCase.userStoryLink || '')
      setLayer(testCase.layer || Layer.E2E)
      setEnvironment(testCase.environment || Environment.INTEGRATION)
      setAutomationStatus(testCase.automationStatus || AutomationStatus.MANUAL)
      setToBeAutomated(testCase.toBeAutomated ?? false)
      setDescription(testCase.description || '')
      setPreConditions(testCase.preConditions || '')
      setSteps(
        testCase.steps && testCase.steps.length > 0
          ? testCase.steps
          : ['']
      )
      setTags(testCase.tags ? testCase.tags.map((tag) => tag.name) : [])
    }
  }, [testCase])

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (isEditMode) {
      const data: UpdateTestCaseRequest = {
        title: title.trim(),
        testSuiteId: folderId,
        severity,
        status,
        priority,
        type,
        isFlaky,
        milestone: milestone.trim() || undefined,
        userStoryLink: userStoryLink.trim() || undefined,
        layer,
        environment,
        automationStatus,
        toBeAutomated,
        description: description.trim() || undefined,
        preConditions: preConditions.trim() || undefined,
        steps: steps.filter((step) => step.trim()).length > 0
          ? steps.filter((step) => step.trim())
          : undefined,
        tags: tags.length > 0 ? tags : undefined,
      }
      await onSubmit(data)
    } else {
      const data: CreateTestCaseRequest = {
        title: title.trim(),
        testSuiteId: folderId,
        severity,
        status,
        priority,
        type,
        isFlaky,
        milestone: milestone.trim() || undefined,
        userStoryLink: userStoryLink.trim() || undefined,
        layer,
        environment,
        automationStatus,
        toBeAutomated,
        description: description.trim() || undefined,
        preConditions: preConditions.trim() || undefined,
        steps: steps.filter((step) => step.trim()).length > 0
          ? steps.filter((step) => step.trim())
          : undefined,
        tags: tags.length > 0 ? tags : undefined,
      }
      await onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Validar login com credenciais corretas"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Severity, Status, Priority, Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select
              value={severity}
              onValueChange={(value) => setSeverity(value as Severity)}
            >
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Severity).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Status)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Status).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TestType)}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TestType).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layer, Environment, Automation Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="layer">Layer</Label>
            <Select
              value={layer}
              onValueChange={(value) => setLayer(value as Layer)}
            >
              <SelectTrigger id="layer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Layer).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select
              value={environment}
              onValueChange={(value) =>
                setEnvironment(value as Environment)
              }
            >
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Environment).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="automationStatus">Automation Status</Label>
            <Select
              value={automationStatus}
              onValueChange={(value) =>
                setAutomationStatus(value as AutomationStatus)
              }
            >
              <SelectTrigger id="automationStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AutomationStatus).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Boolean fields */}
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFlaky"
              checked={isFlaky}
              onChange={(e) => setIsFlaky(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isFlaky">Is Flaky</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="toBeAutomated"
              checked={toBeAutomated}
              onChange={(e) => setToBeAutomated(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="toBeAutomated">To be Automated</Label>
          </div>
        </div>

        {/* Milestone e User Story Link */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="milestone">Milestone</Label>
            <Input
              id="milestone"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Ex: v1.0, Sprint 45"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userStoryLink">User Story Link</Label>
            <Input
              id="userStoryLink"
              value={userStoryLink}
              onChange={(e) => setUserStoryLink(e.target.value)}
              placeholder="https://jira.example.com/STORY-123"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do caso de teste (Markdown)"
            rows={4}
          />
        </div>

        {/* Pre-conditions */}
        <div className="space-y-2">
          <Label htmlFor="preConditions">Pre-conditions</Label>
          <Textarea
            id="preConditions"
            value={preConditions}
            onChange={(e) => setPreConditions(e.target.value)}
            placeholder="Pré-condições do caso de teste (Markdown)"
            rows={3}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <Label>Steps (BDD Gherkin)</Label>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
              />
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddStep}
            className="w-full"
          >
            Adicionar Step
          </Button>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Digite uma tag e pressione Enter"
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-2 p-6 border-t shrink-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Salvando...'
            : isEditMode
            ? 'Salvar'
            : 'Criar'}
        </Button>
      </div>
    </form>
  )
}

