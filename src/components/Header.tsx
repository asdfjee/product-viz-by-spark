import React from 'react'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { X, List } from '@phosphor-icons/react'

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation()
  const isAdminAuth = localStorage.getItem('admin-auth')
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Projects' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
  ]
  
  // Add admin link if authenticated
  if (isAdminAuth) {
    navLinks.push({ path: '/admin', label: 'Admin' })
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-foreground hover:text-primary transition-colors font-medium text-sm ${
                  location.pathname === path ? 'text-primary' : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <Button className="ml-4" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </nav>
          
          <button 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
          </button>
          
          <Link to="/" className="flex items-center cursor-pointer">
            <h1 className="text-2xl font-bold tracking-tight">PRODUCT VIZ</h1>
          </Link>
        </div>
        
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pt-6 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-foreground hover:text-primary font-medium text-center py-2 ${
                    location.pathname === path ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Button className="mt-2" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}