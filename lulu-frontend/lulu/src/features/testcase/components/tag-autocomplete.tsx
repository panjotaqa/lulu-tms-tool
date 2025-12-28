import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface TagAutocompleteProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagAutocomplete({
  value,
  onChange,
  placeholder = 'Digite uma tag e pressione Enter...',
}: TagAutocompleteProps) {
  const [searchText, setSearchText] = useState('')

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedText = searchText.trim()
      if (trimmedText && !value.includes(trimmedText)) {
        onChange([...value, trimmedText])
        setSearchText('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <Input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remover tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
