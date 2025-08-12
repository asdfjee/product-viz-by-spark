import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/dashboard'
  const [status, setStatus] = useState<'working' | 'signed-in' | 'confirmed' | 'error'>('working')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href)
        const hasCode = !!url.searchParams.get('code')
        const hasError = !!url.searchParams.get('error')
        if (hasError) {
          const errorDesc = url.searchParams.get('error_description') || 'Authentication error'
          setStatus('error')
          setMessage(errorDesc)
          return
        }
        if (hasCode) {
          const { error } = await supabase!.auth.exchangeCodeForSession(window.location.href)
          if (error) {
            setStatus('error')
            setMessage(error.message)
            return
          }
        }

        const { data } = await supabase!.auth.getSession()
        if (data.session) {
          setStatus('signed-in')
          window.history.replaceState({}, document.title, window.location.pathname)
          navigate(from, { replace: true })
          return
        }

        setStatus('confirmed')
        setMessage('Email confirmed. Please sign in to continue.')
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (e: any) {
        setStatus('error')
        setMessage(e?.message || 'Unexpected error')
      }
    }

    run()
  }, [navigate, from])

  return (
    <div className="container mx-auto px-6 py-20">
      {status === 'working' && (
        <p>Completing sign-in…</p>
      )}
      {status === 'confirmed' && (
        <div className="space-y-4">
          <p>{message || 'Email confirmed.'}</p>
          <Button onClick={() => navigate('/login')}>Go to sign in</Button>
        </div>
      )}
      {status === 'error' && (
        <div className="space-y-4">
          <p>Authentication error: {message}</p>
          <Button onClick={() => navigate('/login')}>Back to sign in</Button>
        </div>
      )}
    </div>
  )
}

export default AuthCallback