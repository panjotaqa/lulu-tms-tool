import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LogoutButton } from '../logout-button'
import { ThemeToggle } from '../theme-toggle'

const navigation = [
  {
    name: 'Projetos',
    href: '/app/projects',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

export function Navbar() {
  const location = useLocation()
  const isActive = (href: string) => {
    if (href.includes('?')) {
      const [path] = href.split('?')
      return location.pathname === path
    }
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Lulu TMS</h1>
        <nav className="flex items-center space-x-4">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <LogoutButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
