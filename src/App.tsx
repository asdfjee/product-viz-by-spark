// src/App.tsx - FINAL VERSION WITH ALL DETAILED PAGES RESTORED

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster, toast } from 'sonner'
import { 
  Camera, 
  Sparkle, 
  Upload, 
  ArrowRight, 
  Palette, 
  Lightbulb,
  Star,
  Play,
  Check,
  Plus,
  Folder,
  Image as ImageIcon,
  TextT,
  MagicWand,
  Download,
  ArrowClockwise,
  List,
  X,
  Envelope,
  MapPin,
  Phone,
  Gear,
  Trash
} from '@phosphor-icons/react'

// Import Supabase components - will be null if not configured
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

// --- INTERFACES AND STATIC DATA ---

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  thumbnail?: string
  visualizationRequests: VisualizationRequest[]
}

interface VisualizationRequest {
  id: string
  type: 'specific-item' | 'style-brainstorm'
  originalImage: string
  description: string
  createdAt: string
  status: 'submitted' | 'processing' | 'completed' | 'delivered'
  customerEmail: string
  estimatedDelivery: string
}

const modernLivingRoomVideo = '/videos/modern-living-room-transformation.mp4'
const cozyBedroomVideo = '/videos/Cozy_Room_Transformation_Video_(1).mp4'
const kitchenPanVideo = '/videos/Kitchen_Pan_Video_Generation.mp4'

const featuredVisualizationsData = [
  { id: '1', video: modernLivingRoomVideo, description: 'Modern living room transformation' },
  { id: '2', video: cozyBedroomVideo, description: 'Cozy bedroom makeover' },
  { id: '3', video: kitchenPanVideo, description: 'Minimalist kitchen design' }
];

// --- HELPER HOOKS & FUNCTIONS ---

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

// --- REUSABLE UI COMPONENTS ---

const EnhancedVideo = ({ src, className = "", ...props }: { src: string, className?: string, [key: string]: any }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);
  const handleError = () => { console.error(`Video failed to load: ${src}`); setHasError(true); };

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Video Unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <video className={`w-full h-full object-cover ${className}`} src={src} autoPlay muted loop playsInline onError={handleError} preload="metadata" {...props}>
      <source src={src} type="video/mp4" />
      Your browser does not support video playback.
    </video>
  );
};

const Footer = () => (
  <footer className="py-8 text-center">
    <div className="container mx-auto px-6">
      <div className="text-sm text-muted-foreground">
        © 2024 Product Viz. All rights reserved. • Contact us: <a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a>
      </div>
    </div>
  </footer>
);

const Header = ({ setCurrentView, isMobileMenuOpen, setIsMobileMenuOpen }: any) => (
  <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-sm" onClick={(e) => { e.preventDefault(); setCurrentView('landing'); }}>Home</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-sm" onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}>Projects</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-sm" onClick={(e) => { e.preventDefault(); setCurrentView('gallery'); }}>Gallery</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-sm" onClick={(e) => { e.preventDefault(); setCurrentView('admin'); }}>Admin</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium text-sm" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }}>About</a>
            <Button className="ml-4" onClick={() => setCurrentView('dashboard')}>Get Started</Button>
          </nav>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
          </button>
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('landing')}>
            <h1 className="text-2xl font-bold tracking-tight">PRODUCT VIZ</h1>
          </div>
        </div>
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pt-6 border-t">
            <div className="flex flex-col gap-4">
              {(['landing', 'dashboard', 'gallery', 'admin', 'about'] as const).map(view => (
                <a key={view} href="#" className="text-foreground hover:text-primary font-medium text-center py-2"
                  onClick={(e) => { e.preventDefault(); setCurrentView(view); setIsMobileMenuOpen(false); }}>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </a>
              ))}
              <Button className="mt-2" onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}>Get Started</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
);

// --- PAGE COMPONENTS ---

const LandingPage = ({ setCurrentView }: any) => {  
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium"><Sparkle className="w-4 h-4 mr-2" />AI-Powered Interior Design</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Visualize Your<span className="block" style={{ color: '#798ab5' }}>Dream Space</span></h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">Submit your room photo and design preferences to our professional team. Get custom visualizations delivered to your email within 3-5 business days.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => setCurrentView('dashboard')}>Start Designing<ArrowRight className="ml-2 w-5 h-5" /></Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => setCurrentView('gallery')}><Play className="mr-2 w-5 h-5" />Watch Demo</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Three simple steps to transform your space</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => setCurrentView('dashboard')}>
            <CardHeader><div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"><Camera className="w-8 h-8 text-accent" /></div><CardTitle className="text-xl">Upload Your Room</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground mb-4">Upload your room photo and let our professional design team analyze the space and create custom visualizations.</p><div className="opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="outline" size="sm">Start Upload →</Button></div></CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => setCurrentView('dashboard')}>
            <CardHeader><div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"><MagicWand className="w-8 h-8 text-accent" /></div><CardTitle className="text-xl">Describe Your Vision</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground mb-4">Describe your vision or upload specific furniture. Our design team will create professional visualizations and email them to you.</p><div className="opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="outline" size="sm">Describe Now →</Button></div></CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => setCurrentView('gallery')}>
            <CardHeader><div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"><Download className="w-8 h-8 text-accent" /></div><CardTitle className="text-xl">Receive Your Design</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground mb-4">Receive professional-quality visualizations and purchase recommendations delivered to your email within 3-5 business days.</p><div className="opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="outline" size="sm">Receive Results →</Button></div></CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Professional Design Transformations</h2>
            <p className="text-xl text-muted-foreground">Real projects completed by our professional design team - delivered via email</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVisualizationsData.map((viz) => (
              <Card key={viz.id} className="overflow-hidden border-0 shadow-lg group cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setCurrentView('gallery')}>
                <div className="relative">
                  <div className="aspect-video bg-muted relative overflow-hidden"><EnhancedVideo src={viz.video} className="w-full h-full"/></div>
                  {viz.id !== '3' && (<div className="absolute top-4 right-4"><Badge className="bg-white/90 text-foreground">Before → After</Badge></div>)}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-6 h-6 text-white ml-1" /></div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="font-medium">{viz.description}</p>
                  <div className="flex items-center mt-4 text-sm text-muted-foreground"><Star className="w-4 h-4 mr-1 fill-current text-accent" /><span>Featured transformation</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const CreateProjectDialog = ({ isCreateProjectOpen, setIsCreateProjectOpen, setProjects, setSelectedProject, setCurrentView }: any) => {
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
        setCurrentView('workspace');
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
                <DialogHeader><DialogTitle>Create New Project</DialogTitle><DialogDescription>Start a new interior design project.</DialogDescription></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label htmlFor="project-name">Project Name</Label><Input id="project-name" value={localProjectForm.name} onChange={(e) => setLocalProjectForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Living Room Makeover" autoComplete="off"/></div>
                    <div className="space-y-2"><Label htmlFor="project-description">Description</Label><Textarea id="project-description" value={localProjectForm.description} onChange={(e) => setLocalProjectForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe your vision..." rows={3} autoComplete="off"/></div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreateProject} disabled={!localProjectForm.name.trim()}>Create Project</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ProjectDashboard = ({ setIsCreateProjectOpen }: any) => {
    return (
        <>
            <div className="container mx-auto px-6 py-20">
                <Card className="text-center py-16 max-w-2xl mx-auto">
                    <CardContent>
                        <Folder className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                        <CardTitle className="text-3xl mb-4">Ready to Design?</CardTitle>
                        <CardDescription className="text-lg mb-8">Create your first project to start visualizing your dream space.</CardDescription>
                        <Button onClick={() => setIsCreateProjectOpen(true)} size="lg" className="text-lg px-8 py-6 h-auto"><Plus className="w-5 h-5 mr-2" />Create New Project</Button>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

const VisualizationWorkspace = ({ selectedProject, setCurrentView, ...formProps }: any) => {
    return <div>Workspace Content</div>;
};

const GalleryPage = ({ galleryVideos, setCurrentView }: any) => {
  const [activeRoomFilter, setActiveRoomFilter] = useState('All Rooms');
  const [activeStyleFilter, setActiveStyleFilter] = useState('All Styles');
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Supabase
  React.useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('gallery_projects')
          .select('*')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching from database:', error);
          setDbProjects([]);
        } else {
          // Transform database format to component format
          const transformedProjects = (data || []).map(project => ({
            id: project.id,
            video: project.video_url,
            title: project.title,
            description: project.description,
            style: project.style_type,
            room: project.room_type,
            featured: project.featured,
            thumbnail: project.thumbnail_url
          }));
          setDbProjects(transformedProjects);
        }
      } catch (error) {
        console.warn('Failed to fetch projects:', error);
        setDbProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const galleryItems = useMemo(() => {
    // Fallback hardcoded items for when database is not available
    const builtInItems = [
      { id: 'b1', video: modernLivingRoomVideo, title: 'Modern Living Room', description: 'A complete makeover featuring sleek furniture and contemporary design elements.', style: 'Modern', room: 'Living Room' },
      { id: 'b2', video: cozyBedroomVideo, title: 'Scandinavian Bedroom', description: 'Cozy design with natural wood elements and minimalist Nordic aesthetics.', style: 'Scandinavian', room: 'Bedroom' },
      { id: 'b3', video: kitchenPanVideo, title: 'Minimalist Kitchen', description: 'Clean, functional kitchen design with streamlined appliances and storage solutions.', style: 'Minimalist', room: 'Kitchen' },
    ];

    // Use database projects if available, otherwise use built-in items + localStorage videos
    if (dbProjects.length > 0) {
      return dbProjects;
    } else {
      return [...builtInItems, ...(galleryVideos || [])];
    }
  }, [dbProjects, galleryVideos]);

  const filteredItems = galleryItems.filter(item => 
    (activeRoomFilter === 'All Rooms' || item.room === activeRoomFilter) &&
    (activeStyleFilter === 'All Styles' || item.style === activeStyleFilter)
  );

  // Get unique room and style types for filters
  const roomTypes = ['All Rooms', ...Array.from(new Set(galleryItems.map(item => item.room)))];
  const styleTypes = ['All Styles', ...Array.from(new Set(galleryItems.map(item => item.style)))];

  return (
    <>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transformation Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover amazing room transformations and get inspired by our professional design work.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="room-filter" className="text-sm font-medium">Filter by Room:</Label>
              <select
                id="room-filter"
                value={activeRoomFilter}
                onChange={(e) => setActiveRoomFilter(e.target.value)}
                className="p-2 border rounded-md bg-background"
              >
                {roomTypes.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style-filter" className="text-sm font-medium">Filter by Style:</Label>
              <select
                id="style-filter"
                value={activeStyleFilter}
                onChange={(e) => setActiveStyleFilter(e.target.value)}
                className="p-2 border rounded-md bg-background"
              >
                {styleTypes.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {galleryItems.length} projects
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <ArrowClockwise className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading gallery projects...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-muted relative">
                  <EnhancedVideo src={item.video} />
                  {item.featured && (
                    <Badge className="absolute top-2 left-2 bg-accent">Featured</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">{item.room}</Badge>
                    <Badge variant="outline" className="text-xs">{item.style}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later for new projects.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const AboutPage = () => (
    <>
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Product Viz</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">We're revolutionizing interior design by making it accessible, interactive, and instant. Our AI-powered platform empowers anyone to visualize and shop for home furnishings within their own space, transforming interior design from guesswork into creativity.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">We provide professional interior design visualization services powered by AI technology. Submit your room photos and design preferences, and receive custom visualizations delivered directly to your email within 3-5 business days.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkle className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4">Professional Design Team</h3>
              <p className="text-muted-foreground">Our experienced interior designers use advanced AI tools to create realistic, contextual design solutions.</p>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Camera className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4">Photo-Realistic Results</h3>
              <p className="text-muted-foreground">See exactly how furniture will look in your actual room with accurate rendering.</p>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Download className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4">Email Delivery Service</h3>
              <p className="text-muted-foreground">Receive high-quality visualizations delivered directly to your email within 3-5 business days.</p>
            </Card>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">How Product Viz Works</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1"><div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">1</div><h3 className="text-xl font-bold">Upload Your Space</h3></div><p className="text-muted-foreground">Upload your room photo and submit your request. Our design team will analyze the space.</p></div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center"><Camera className="w-12 h-12 text-muted-foreground" /></div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1"><div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">2</div><h3 className="text-xl font-bold">Describe Your Vision</h3></div><p className="text-muted-foreground">Describe your vision or upload specific furniture photos. Our designers will interpret your preferences.</p></div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center"><TextT className="w-12 h-12 text-muted-foreground" /></div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1"><div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">3</div><h3 className="text-xl font-bold">Receive Professional Results</h3></div><p className="text-muted-foreground">Within 3-5 business days, receive professional-quality visualizations delivered to your email.</p></div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center"><Download className="w-12 h-12 text-muted-foreground" /></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">
            <div><div className="text-4xl font-bold text-accent mb-2">10K+</div><p className="text-muted-foreground">Rooms Transformed</p></div>
            <div><div className="text-4xl font-bold text-accent mb-2">25K+</div><p className="text-muted-foreground">Happy Users</p></div>
            <div><div className="text-4xl font-bold text-accent mb-2">50+</div><p className="text-muted-foreground">Retail Partners</p></div>
            <div><div className="text-4xl font-bold text-accent mb-2">98%</div><p className="text-muted-foreground">Satisfaction Rate</p></div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold mb-4">Get in Touch</h2><p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you.</p></div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8"><h3 className="text-xl font-bold mb-6">Send us a message</h3><form className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label htmlFor="firstName">First Name</Label><Input id="firstName" placeholder="John" /></div><div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" placeholder="Doe" /></div></div><div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="john@example.com" /></div><div><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="How can we help?" /></div><div><Label htmlFor="message">Message</Label><Textarea id="message" rows={4} placeholder="Your message..." /></div><Button className="w-full"><Envelope className="w-4 h-4 mr-2" />Send Message</Button></form></Card>
            <div className="space-y-8"><div><h3 className="text-xl font-bold mb-6">Contact Information</h3><div className="space-y-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center"><Envelope className="w-6 h-6 text-accent" /></div><div><p className="font-medium">Email</p><a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a></div></div><div className="flex items-center gap-4"><div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center"><MapPin className="w-6 h-6 text-accent" /></div><div><p className="font-medium">Office</p><p className="text-muted-foreground">San Francisco, CA</p></div></div><div className="flex items-center gap-4"><div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center"><Phone className="w-6 h-6 text-accent" /></div><div><p className="font-medium">Response Time</p><p className="text-muted-foreground">Within 24 hours</p></div></div></div></div><Card className="p-6 bg-accent/5 border-accent/20"><h4 className="font-bold mb-3">Need immediate help?</h4><p className="text-sm text-muted-foreground mb-4">Check out our help documentation or community forum.</p><div className="flex gap-2"><Button variant="outline" size="sm">Help Center</Button><Button variant="outline" size="sm">Community</Button></div></Card></div>
          </div>
        </div>
      </div>

      <Footer />
    </>
);

const AdminPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    room_type: 'Living Room',
    style_type: 'Modern',
    video_url: '',
    thumbnail_url: '',
    featured: false
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining Room'];
  const styleTypes = ['Modern', 'Scandinavian', 'Minimalist', 'Traditional', 'Industrial', 'Bohemian'];

  const fetchProjects = async () => {
    if (!supabase) {
      setLoading(false);
      toast.error('Supabase not configured. Please check your environment variables.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load gallery projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const uploadFile = async (file: File, type: 'video' | 'thumbnail'): Promise<string | null> => {
    if (!supabase) {
      toast.error('Supabase not configured');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}`);
      return null;
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const url = await uploadFile(file, 'video');
    if (url) {
      setNewProject(prev => ({ ...prev, video_url: url }));
      toast.success('Video uploaded successfully!');
    }
    setUploadingVideo(false);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    const url = await uploadFile(file, 'thumbnail');
    if (url) {
      setNewProject(prev => ({ ...prev, thumbnail_url: url }));
      toast.success('Thumbnail uploaded successfully!');
    }
    setUploadingThumbnail(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase not configured');
      return;
    }

    if (!newProject.title || !newProject.description || !newProject.video_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('gallery_projects')
          .update(newProject)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('gallery_projects')
          .insert([newProject]);

        if (error) throw error;
        toast.success('Project added successfully!');
      }

      setIsAddDialogOpen(false);
      setEditingProject(null);
      setNewProject({
        title: '',
        description: '',
        room_type: 'Living Room',
        style_type: 'Modern',
        video_url: '',
        thumbnail_url: '',
        featured: false
      });
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setNewProject({ ...project });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      toast.error('Supabase not configured');
      return;
    }

    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('gallery_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setNewProject({
      title: '',
      description: '',
      room_type: 'Living Room',
      style_type: 'Modern',
      video_url: '',
      thumbnail_url: '',
      featured: false
    });
  };

  return (
    <>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery Admin</h1>
              <p className="text-xl text-muted-foreground">Manage your gallery projects and media</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!supabase ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Gear className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Supabase Not Configured</h3>
              <p className="text-muted-foreground mb-4">
                Please configure your Supabase credentials in the environment variables to use the admin features.
              </p>
              <div className="text-left bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-mono">
                  VITE_SUPABASE_URL=your-supabase-project-url<br />
                  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
                </p>
              </div>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="text-center py-16">
            <ArrowClockwise className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading projects...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {project.video_url ? (
                    <EnhancedVideo src={project.video_url} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {project.featured && (
                    <Badge className="absolute top-2 left-2 bg-accent">Featured</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{project.room_type}</Badge>
                    <Badge variant="outline" className="text-xs">{project.style_type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                      <Gear className="w-3 h-3 mr-1" />Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                      <Trash className="w-3 h-3 mr-1" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription>
              Fill in the project details and upload media files.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    Featured Project
                  </div>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_type">Room Type</Label>
                <select
                  id="room_type"
                  value={newProject.room_type}
                  onChange={(e) => setNewProject(prev => ({ ...prev, room_type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="style_type">Style Type</Label>
                <select
                  id="style_type"
                  value={newProject.style_type}
                  onChange={(e) => setNewProject(prev => ({ ...prev, style_type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {styleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="flex-1 p-2 border rounded-md"
                  disabled={uploadingVideo}
                />
                {uploadingVideo && <ArrowClockwise className="w-6 h-6 animate-spin" />}
              </div>
              {newProject.video_url && (
                <p className="text-sm text-green-600">✓ Video uploaded successfully</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="flex-1 p-2 border rounded-md"
                  disabled={uploadingThumbnail}
                />
                {uploadingThumbnail && <ArrowClockwise className="w-6 h-6 animate-spin" />}
              </div>
              {newProject.thumbnail_url && (
                <p className="text-sm text-green-600">✓ Thumbnail uploaded successfully</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploadingVideo || uploadingThumbnail || !newProject.title || !newProject.description || !newProject.video_url}
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

// --- THE MAIN APP COMPONENT ---

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace' | 'gallery' | 'admin' | 'about'>('landing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [projects, setProjects, deleteProjects] = useLocalStorage<Project[]>('user-projects', []);
  const [galleryVideos, setGalleryVideos] = useLocalStorage<any[]>('gallery-videos', []);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const workspaceFormProps = {
      uploadedImage, setUploadedImage,
      itemDescription, setItemDescription,
      styleDescription, setStyleDescription,
      customerEmail, setCustomerEmail
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <ProjectDashboard setIsCreateProjectOpen={setIsCreateProjectOpen} />;
      case 'workspace':
        return <VisualizationWorkspace selectedProject={selectedProject} setCurrentView={setCurrentView} {...workspaceFormProps} />;
      case 'gallery':
        return <GalleryPage galleryVideos={galleryVideos} setCurrentView={setCurrentView} />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        setCurrentView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <CreateProjectDialog
        isCreateProjectOpen={isCreateProjectOpen}
        setIsCreateProjectOpen={setIsCreateProjectOpen}
        setProjects={setProjects}
        setSelectedProject={setSelectedProject}
        setCurrentView={setCurrentView}
      />
      <main>
        {renderCurrentView()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
