import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Folder } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

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
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ setIsCreateProjectOpen }) => {
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
};