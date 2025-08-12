import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        navigate(from, { replace: true })
      } else {
        await signUp(email, password)
        toast.success('Account created. You can now sign in.')
        setMode('signin')
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <CardTitle className="text-2xl mb-2">{mode === 'signin' ? 'Sign in' : 'Create account'}</CardTitle>
          <CardDescription className="mb-6">
            {mode === 'signin' ? 'Use your email and password.' : 'Register with email and password.'}
          </CardDescription>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            <Input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? (mode === 'signin' ? 'Signing in…' : 'Creating…') : (mode === 'signin' ? 'Sign in' : 'Create account')}
            </Button>
          </form>
          <div className="mt-4 text-sm">
            {mode === 'signin' ? (
              <button className="underline" onClick={() => setMode('signup')}>Need an account? Sign up</button>
            ) : (
              <button className="underline" onClick={() => setMode('signin')}>Have an account? Sign in</button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage