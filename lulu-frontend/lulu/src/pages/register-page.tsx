import { Link } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/components/register-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/logout-button'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LogoutButton />
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <RegisterForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}

