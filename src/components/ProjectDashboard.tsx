import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Folder, Warning, ArrowClockwise } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserProject } from '@/lib/supabase'

const Footer = () => (
  <footer className="py-8 text-center">
    <div className="container mx-auto px-6">
      <div className="text-sm text-muted-foreground">
        © 2024 Product Viz. All rights reserved. • Contact us: <a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a>
      </div>
    </div>
  </footer>
);

interface ProjectDashboardProps {
  setIsCreateProjectOpen: (open: boolean) => void
  projects: UserProject[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  setIsCreateProjectOpen, 
  projects, 
  isLoading, 
  error, 
  onRetry 
}) => {
  if (isLoading) {
    return (
      <>
        <div className="container mx-auto px-6 py-20">
          <Card className="text-center py-16 max-w-2xl mx-auto">
            <CardContent>
              <Loader2 className="w-20 h-20 text-muted-foreground mx-auto mb-6 animate-spin" />
              <CardTitle className="text-3xl mb-4">Loading Projects...</CardTitle>
              <CardDescription className="text-lg">
                Please wait while we load your projects.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-6 py-20">
          <Card className="text-center py-16 max-w-2xl mx-auto">
            <CardContent>
              <Warning className="w-20 h-20 text-destructive mx-auto mb-6" />
              <CardTitle className="text-3xl mb-4">Error Loading Projects</CardTitle>
              <CardDescription className="text-lg mb-8">
                {error}
              </CardDescription>
              <div className="flex justify-center gap-4">
                <Button onClick={onRetry} variant="outline">
                  <ArrowClockwise className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={() => setIsCreateProjectOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (projects.length === 0) {
    return (
      <>
        <div className="container mx-auto px-6 py-20">
          <Card className="text-center py-16 max-w-2xl mx-auto">
            <CardContent>
              <Folder className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <CardTitle className="text-3xl mb-4">Ready to Design?</CardTitle>
              <CardDescription className="text-lg mb-8">
                Create your first project to start visualizing your dream space.
              </CardDescription>
              <Button onClick={() => setIsCreateProjectOpen(true)} size="lg" className="text-lg px-8 py-6 h-auto">
                <Plus className="w-5 h-5 mr-2" />Create New Project
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
            <p className="text-muted-foreground text-lg">
              {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <Button onClick={() => setIsCreateProjectOpen(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                {project.thumbnail && (
                  <img 
                    src={project.thumbnail} 
                    alt={project.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                <CardDescription className="mb-4 line-clamp-2">
                  {project.description || 'No description provided'}
                </CardDescription>
                <div className="text-sm text-muted-foreground">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};