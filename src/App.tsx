import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Toaster, toast } from 'sonner'

// Import page components
import { Header } from '@/components/Header'
import { LandingPage } from '@/components/LandingPage'
import { ProjectDashboard } from '@/components/ProjectDashboard'
import { GalleryPage } from '@/components/GalleryPage'
import { AboutPage } from '@/components/AboutPage'
import { AdminPage } from '@/components/AdminPage'
import { AdminLogin } from '@/components/AdminLogin'

// Helper hook for localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, deleteValue];
}

// Project interface for backward compatibility
interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  thumbnail?: string
  visualizationRequests: any[]
}

// Create Project Dialog component
const CreateProjectDialog = ({ 
  isCreateProjectOpen, 
  setIsCreateProjectOpen, 
  setProjects, 
  setSelectedProject 
}: any) => {
  const [localProjectForm, setLocalProjectForm] = useState({ name: '', description: '' });

  const handleCreateProject = () => {
    if (localProjectForm.name.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: localProjectForm.name,
        description: localProjectForm.description,
        createdAt: new Date().toISOString(),
        visualizationRequests: []
      };
      setProjects((currentProjects: Project[] = []) => [...currentProjects, newProject]);
      setSelectedProject(newProject);
      setLocalProjectForm({ name: '', description: '' });
      setIsCreateProjectOpen(false);
      toast.success('Project created successfully!');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) { setLocalProjectForm({ name: '', description: '' }); }
    setIsCreateProjectOpen(open);
  };
  
  return (
    <Dialog open={isCreateProjectOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Start a new interior design project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input 
              id="project-name" 
              value={localProjectForm.name} 
              onChange={(e) => setLocalProjectForm(prev => ({ ...prev, name: e.target.value }))} 
              placeholder="e.g., Living Room Makeover" 
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea 
              id="project-description" 
              value={localProjectForm.description} 
              onChange={(e) => setLocalProjectForm(prev => ({ ...prev, description: e.target.value }))} 
              placeholder="Describe your vision..." 
              rows={3} 
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} disabled={!localProjectForm.name.trim()}>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [projects, setProjects] = useLocalStorage<Project[]>('user-projects', []);
  const [galleryVideos, setGalleryVideos] = useLocalStorage<any[]>('gallery-videos', []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <CreateProjectDialog
        isCreateProjectOpen={isCreateProjectOpen}
        setIsCreateProjectOpen={setIsCreateProjectOpen}
        setProjects={setProjects}
        setSelectedProject={setSelectedProject}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={<ProjectDashboard setIsCreateProjectOpen={setIsCreateProjectOpen} />} 
          />
          <Route 
            path="/gallery" 
            element={<GalleryPage galleryVideos={galleryVideos} />} 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;
