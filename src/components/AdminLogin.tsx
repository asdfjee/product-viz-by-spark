import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Gear } from '@phosphor-icons/react'

// Simple admin password - in production this should be environment variable
const ADMIN_PASSWORD = 'admin123'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const isAdminAuth = localStorage.getItem('admin-auth')
    if (isAdminAuth) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      toast.error('Please enter the admin password')
      return
    }

    setLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true')
      toast.success('Login successful!')
      navigate('/admin')
    } else {
      toast.error('Invalid password')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gear className="w-8 h-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter the admin password to access the gallery management interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have admin access?
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}