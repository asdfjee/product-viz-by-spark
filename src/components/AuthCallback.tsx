import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        toast.error('Authentication service not available')
        navigate('/login')
        return
      }

      try {
        // Handle the auth callback from Supabase
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed: ' + error.message)
          navigate('/login')
          return
        }

        if (data.session) {
          toast.success('Successfully authenticated!')
          navigate('/dashboard')
        } else {
          toast.error('Authentication failed. Please try again.')
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        toast.error('Authentication failed. Please try again.')
        navigate('/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
      </div>
    </div>
  )
}

export default AuthCallback