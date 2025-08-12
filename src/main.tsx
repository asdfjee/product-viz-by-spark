import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { AuthProvider } from '@/contexts/AuthContext'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
   </ErrorBoundary>
)
