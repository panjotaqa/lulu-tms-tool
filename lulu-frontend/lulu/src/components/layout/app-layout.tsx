import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Toaster } from '../ui/toaster'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-1 overflow-hidden p-6 flex flex-col">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}

