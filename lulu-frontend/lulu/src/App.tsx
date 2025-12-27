import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/use-theme'
import { AppLayout } from './components/layout/app-layout'
import { LandingPage } from './pages/landing-page'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { ProjectsPage } from './features/project/pages/projects-page'
import { CreateProjectPage } from './features/project/pages/create-project-page'
import { EditProjectPage } from './features/project/pages/edit-project-page'
import { FoldersPage } from './features/folder/pages/folders-page'

function App() {
  useTheme()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/create" element={<CreateProjectPage />} />
          <Route path="projects/:id/edit" element={<EditProjectPage />} />
          <Route path="projects/:id/folders" element={<FoldersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
