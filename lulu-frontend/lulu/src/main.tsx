import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function initializeTheme() {
  const stored = localStorage.getItem('theme')
  const root = document.documentElement
  
  if (stored === 'dark' || stored === 'light') {
    root.classList.add(stored)
  } else {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  }
}

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
