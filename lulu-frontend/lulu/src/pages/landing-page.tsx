import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/logout-button'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LogoutButton />
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Bem-vindo ao Lulu TMS
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Sistema de gerenciamento de tarefas e projetos para sua equipe
            </p>
          </div>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Comece agora</CardTitle>
              <CardDescription>
                Acesse sua conta ou crie uma nova para começar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/register">Criar conta</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Organize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mantenha suas tarefas e projetos organizados em um só lugar
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Colabore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trabalhe em equipe de forma eficiente e produtiva
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Acompanhe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitore o progresso dos seus projetos em tempo real
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

