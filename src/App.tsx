import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Button from './components/ui/Button';
import CreateProjectDialog from './components/CreateProjectDialog';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import RequireAuth from './components/RequireAuth';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectPage from './pages/ProjectPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';

import projectAPI from './api/projectAPI';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [galleryVideos, setGalleryVideos] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const userProjects = await projectAPI.getAll();
      setProjects(userProjects);
      setProjectsError(null);
    } catch (error) {
      // fallback to local storage or set error
      try {
        const localStorageProjects = JSON.parse(localStorage.getItem('user-projects') || '[]');
        setProjects(
          localStorageProjects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            created_at: p.createdAt,
            updated_at: p.createdAt,
            user_id: null,
            thumbnail: p.thumbnail || null,
            visualization_requests: p.visualizationRequests || [],
          }))
        );
        if (localStorageProjects.length > 0) {
          toast.error('Cloud storage unavailable. Using local storage.');
          setProjectsError(null);
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

  const handleProjectCreated = async (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
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
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

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
          <Route path="/gallery" element={<GalleryPage galleryVideos={galleryVideos} />} />
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
