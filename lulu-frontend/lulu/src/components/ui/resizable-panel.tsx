import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ResizablePanelProps {
  isOpen: boolean
  onClose: () => void
  defaultWidth?: string
  minWidth?: number
  maxWidth?: string
  children: React.ReactNode
  title?: string
}

export function ResizablePanel({
  isOpen,
  onClose,
  defaultWidth = '50%',
  minWidth = 300,
  maxWidth = '80%',
  children,
  title,
}: ResizablePanelProps) {
  const [width, setWidth] = useState<string>(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setWidth(defaultWidth)
    }
  }, [isOpen, defaultWidth])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return

      const containerWidth = window.innerWidth
      const newWidth = containerWidth - e.clientX

      const minWidthPx = minWidth
      const maxWidthPx =
        typeof maxWidth === 'string' && maxWidth.endsWith('%')
          ? (containerWidth * parseInt(maxWidth)) / 100
          : parseInt(maxWidth)

      if (newWidth >= minWidthPx && newWidth <= maxWidthPx) {
        setWidth(`${newWidth}px`)
      } else if (newWidth < minWidthPx) {
        setWidth(`${minWidthPx}px`)
      } else if (newWidth > maxWidthPx) {
        setWidth(`${maxWidthPx}px`)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute right-0 top-0 bottom-0 bg-background border-l shadow-lg z-[100] flex flex-col transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{ width, height: '100%' }}
    >
      {/* Resize handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10',
          isResizing && 'bg-primary'
        )}
      />
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* Content */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}

