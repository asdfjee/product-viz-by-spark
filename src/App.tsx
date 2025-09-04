import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Toaster, toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Import page components
import { Header } from '@/components/Header'
import { LandingPage } from '@/components/LandingPage'
import { ProjectDashboard } from '@/components/ProjectDashboard'
import { GalleryPage } from '@/components/GalleryPage'
import { AboutPage } from '@/components/AboutPage'
import { AdminPage } from '@/components/AdminPage'
import { AdminLogin } from '@/components/AdminLogin'
import ProjectPage from '@/components/ProjectPage'
import RequireAuth from '@/components/RequireAuth'
import LoginPage from '@/components/LoginPage'
import AuthCallback from '@/components/AuthCallback'

// Import Supabase project API
import { projectAPI, UserProject } from '@/lib/supabase'

// Helper hook for localStorage (kept for gallery videos and migration)
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

// Legacy Project interface for backward compatibility with localStorage
interface LegacyProject {
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
  onProjectCreated
}: {
  isCreateProjectOpen: boolean
  setIsCreateProjectOpen: (open: boolean) => void
  onProjectCreated: (project: UserProject) => void
}) => {
  const [localProjectForm, setLocalProjectForm] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!localProjectForm.name.trim()) return;
    
    setIsCreating(true);
    try {
      const newProject = await projectAPI.create({
        name: localProjectForm.name,
        description: localProjectForm.description,
        thumbnail: null,
        visualization_requests: []
      });
      
      onProjectCreated(newProject);
      setLocalProjectForm({ name: '', description: '' });
      setIsCreateProjectOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) { 
      setLocalProjectForm({ name: '', description: '' });
    }
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
              disabled={isCreating}
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
              disabled={isCreating}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProject} 
            disabled={!localProjectForm.name.trim() || isCreating}
          >
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function App() {
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for projects (now from Supabase)
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  
  // Keep localStorage for gallery videos for now
  const [galleryVideos, setGalleryVideos] = useLocalStorage<any[]>('gallery-videos', []);

  // Migration and project loading
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsProjectsLoading(true);
    setProjectsError(null);
    
    try {
      // Try to load projects from Supabase
      const supabaseProjects = await projectAPI.getAll();
      
      // Check for legacy localStorage projects and migrate them
      const localStorageProjects = JSON.parse(localStorage.getItem('user-projects') || '[]') as LegacyProject[];
      
      if (localStorageProjects.length > 0 && supabaseProjects.length === 0) {
        console.log('Migrating projects from localStorage to Supabase...');
        try {
          const migratedProjects = await projectAPI.migrateFromLocalStorage(localStorageProjects);
          setProjects(migratedProjects);
          
          // Clear localStorage after successful migration
          localStorage.removeItem('user-projects');
          toast.success('Projects migrated to cloud storage successfully!');
        } catch (migrationError) {
          console.error('Migration failed:', migrationError);
          // If migration fails, keep localStorage projects in state but don't persist them
          setProjects(localStorageProjects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            created_at: p.createdAt,
            updated_at: p.createdAt,
            user_id: null,
            thumbnail: p.thumbnail || null,
            visualization_requests: p.visualizationRequests || []
          })));
          toast.error('Unable to sync projects to cloud. Using local storage.');
        }
      } else {
        setProjects(supabaseProjects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      
      // Fallback to localStorage if Supabase fails
      try {
        const localStorageProjects = JSON.parse(localStorage.getItem('user-projects') || '[]') as LegacyProject[];
        setProjects(localStorageProjects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          created_at: p.createdAt,
          updated_at: p.createdAt,
          user_id: null,
          thumbnail: p.thumbnail || null,
          visualization_requests: p.visualizationRequests || []
        })));
        if (localStorageProjects.length > 0) {
          toast.error('Cloud storage unavailable. Using local storage.');
          setProjectsError(null); // Clear error since we have local projects
        } else {
          setProjectsError('Failed to load projects. Please try again.');
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
        setProjectsError('Failed to load projects. Please try again.');
      }
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const handleProjectCreated = async (newProject: UserProject) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    
    // Refresh projects list to ensure consistency
    try {
      const updatedProjects = await projectAPI.getAll();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <CreateProjectDialog
        isCreateProjectOpen={isCreateProjectOpen}
        setIsCreateProjectOpen={setIsCreateProjectOpen}
        onProjectCreated={handleProjectCreated}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <ProjectDashboard 
                  setIsCreateProjectOpen={setIsCreateProjectOpen}
                  projects={projects}
                  isLoading={isProjectsLoading}
                  error={projectsError}
                  onRetry={loadProjects}
                />
              </RequireAuth>
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              <RequireAuth>
                <ProjectPage />
              </RequireAuth>
            } 
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
