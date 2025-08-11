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

const verifyVideoPath = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// --- REUSABLE UI COMPONENTS ---

const EnhancedVideo = ({ src, className = "", ...props }: { src: string, className?: string, [key: string]: any }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.error(`Video failed to load: ${src}`);
    setHasError(true);
  };

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
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      onError={handleError}
      preload="metadata"
      {...props}
    >
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
              {(['landing', 'dashboard', 'gallery', 'about'] as const).map(view => (
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

const LandingPage = ({ setCurrentView, setProjects, setSelectedProject, setWorkspaceTab }: any) => {
  const handleStartDesigning = (tab: 'upload' | 'style') => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: tab === 'upload' ? 'Quick Upload Project' : 'Vision Project',
        description: `Created from homepage ${tab} step`,
        createdAt: new Date().toISOString(),
        visualizationRequests: []
      };
      setProjects((currentProjects: Project[] = []) => [...currentProjects, newProject]);
      setSelectedProject(newProject);
      setWorkspaceTab(tab);
      setCurrentView('workspace');
  };
  
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
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => handleStartDesigning('upload')}>
            <CardHeader><div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"><Camera className="w-8 h-8 text-accent" /></div><CardTitle className="text-xl">Upload Your Room</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground mb-4">Upload your room photo and let our professional design team analyze the space and create custom visualizations.</p><div className="opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="outline" size="sm">Start Upload →</Button></div></CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => handleStartDesigning('style')}>
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
                  <div className="flex items-center mt-4 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 mr-1 fill-current text-accent" />
                    <span>Featured transformation</span>
                  </div>
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

    const handleCancelProject = () => {
      setLocalProjectForm({ name: '', description: '' });
      setIsCreateProjectOpen(false);
    }

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setLocalProjectForm({ name: '', description: '' });
      }
      setIsCreateProjectOpen(open);
    }

    return (
      <Dialog key="create-project-dialog" open={isCreateProjectOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new interior design project. You can add multiple room visualizations to each project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
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
                placeholder="Describe your vision for this space..."
                rows={3}
                autoComplete="off"
              />
            </div>
          </div>
        
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelProject}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!localProjectForm.name.trim()}>
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Project Dashboard Component
  const ProjectDashboard = ({ setIsCreateProjectOpen }: any) => (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Simple Create Project View */}
      <div className="container mx-auto px-6 py-20">
        <Card className="text-center py-16 max-w-2xl mx-auto">
          <CardContent>
            <Folder className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <CardTitle className="text-3xl mb-4">Ready to Design?</CardTitle>
            <CardDescription className="text-lg mb-8">
              Create your first project to start visualizing your dream space with AI-powered interior design
            </CardDescription>
            <Button 
              onClick={() => setIsCreateProjectOpen(true)}
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateProjectDialog />
      
      <Footer />
    </div>
  )

  // Input components for descriptions
  const ItemDescriptionInput = () => (
    <div className="space-y-2">
      <Label htmlFor="item-description">Describe the item you want to add</Label>
      <Textarea
        id="item-description"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        placeholder="e.g., A modern gray sectional sofa with clean lines and metal legs"
        rows={4}
        autoComplete="off"
      />
    </div>
  )

  const StyleDescriptionInput = () => (
    <div className="space-y-2">
      <Label htmlFor="style-description">Describe your desired style or vibe</Label>
      <Textarea
        id="style-description"
        value={styleDescription}
        onChange={(e) => setStyleDescription(e.target.value)}
        placeholder="e.g., Cozy Scandinavian living room with warm textures and natural wood accents"
        rows={4}
        autoComplete="off"
      />
    </div>
  )

  const submitVisualizationRequest = (type: 'specific-item' | 'style-brainstorm') => {
    if (!uploadedImage || !customerEmail.trim()) {
      toast.error('Please upload an image and provide your email address.')
      return
    }

    const description = type === 'specific-item' ? itemDescription : styleDescription
    if (!description.trim()) {
      toast.error(`Please describe your ${type === 'specific-item' ? 'item' : 'style'}.`)
      return
    }

    try {
      setIsSubmitting(true)
      
      // Calculate estimated delivery (3-5 business days)
      const now = new Date()
      const deliveryDate = new Date(now)
      deliveryDate.setDate(now.getDate() + 5) // 5 business days
      
      const newRequest: VisualizationRequest = {
        id: Date.now().toString(),
        type,
        originalImage: uploadedImage,
        description,
        createdAt: now.toISOString(),
        status: 'submitted',
        customerEmail,
        estimatedDelivery: deliveryDate.toLocaleDateString()
      }

      // Update projects with new request
      if (selectedProject) {
        setProjects(currentProjects => 
          (currentProjects || []).map(project => 
            project.id === selectedProject.id
              ? { ...project, visualizationRequests: [...project.visualizationRequests, newRequest] }
              : project
          )
        )
        
        // Update selected project
        setSelectedProject(prev => prev ? {
          ...prev,
          visualizationRequests: [...prev.visualizationRequests, newRequest]
        } : null)
      }

      // Clear form
      setItemDescription('')
      setStyleDescription('')
      setUploadedImage(null)
      
      toast.success(`Request submitted successfully! You'll receive your visualization at ${customerEmail} within 3-5 business days.`)
      
    } catch (error) {
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Email input component
  const EmailInput = () => (
    <div className="space-y-2">
      <Label htmlFor="customer-email">Your Email Address</Label>
      <Input
        id="customer-email"
        type="email"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
        required
      />
      <p className="text-xs text-muted-foreground">
        We'll send your visualization results to this email within 3-5 business days.
      </p>
    </div>
  )
  

  const [activeRoomFilter, setActiveRoomFilter] = useState('All Rooms')
  const [activeStyleFilter, setActiveStyleFilter] = useState('All Styles')
  const [selectedTransformation, setSelectedTransformation] = useState<any>(null)
  const [comparisonMode, setComparisonMode] = useState<'split' | 'slide' | 'toggle'>('split')
  const [sliderPosition, setSliderPosition] = useState(50)

  const galleryItems = useMemo(() => {
    const builtInItems = [
      { id: '1', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: modernLivingRoomVideo, title: 'Modern Living Room Transformation', description: 'A complete makeover featuring contemporary furniture and warm lighting', style: 'Modern Minimalist', room: 'Living Room', keyFeatures: ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines'] },
      { id: '2', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: cozyBedroomVideo, title: 'Scandinavian Bedroom Retreat', description: 'Cozy bedroom design with natural textures and clean lines', style: 'Scandinavian', room: 'Bedroom', keyFeatures: ['Natural Textures', 'Hygge Vibes', 'Light Woods', 'Minimal Clutter'] },
      { id: '3', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: kitchenPanVideo, title: 'Minimalist Kitchen Design', description: 'Clean, functional kitchen featuring sleek lines and modern appliances', style: 'Modern Minimalist', room: 'Kitchen', keyFeatures: ['Clean Lines', 'Modern Appliances', 'Minimal Clutter', 'Functional Design'] },
      { id: '4', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Bohemian Chic Dining Room', description: 'Eclectic dining space with vibrant colors and mixed textures', style: 'Bohemian', room: 'Dining Room', keyFeatures: ['Mixed Patterns', 'Vibrant Colors', 'Vintage Pieces', 'Global Textiles'] },
      { id: '5', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Mid-Century Modern Office', description: 'Productive workspace with vintage-inspired furniture', style: 'Mid-Century Modern', room: 'Office', keyFeatures: ['Vintage Style', 'Rich Woods', 'Geometric Patterns', 'Bold Colors'] },
      { id: '6', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Cozy Farmhouse Living Room', description: 'Rustic charm meets modern comfort in this inviting space', style: 'Farmhouse', room: 'Living Room', keyFeatures: ['Rustic Woods', 'Neutral Tones', 'Vintage Accents', 'Cozy Textiles'] },
      { id: '7', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Minimalist Bedroom Sanctuary', description: 'Clean lines and neutral tones create a peaceful retreat', style: 'Modern Minimalist', room: 'Bedroom', keyFeatures: ['Clean Lines', 'Neutral Palette', 'Quality Materials', 'Functional Design'] },
      { id: '8', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Industrial Kitchen Renovation', description: 'Bold kitchen featuring exposed elements and modern appliances', style: 'Industrial', room: 'Kitchen', keyFeatures: ['Exposed Brick', 'Metal Accents', 'Open Shelving', 'Dark Palette'] },
      { id: '9', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Rustic Farmhouse Kitchen', description: 'Farmhouse elements meet modern functionality', style: 'Farmhouse', room: 'Kitchen', keyFeatures: ['Shaker Cabinets', 'Butcher Block', 'Vintage Hardware', 'Subway Tile'] },
      { id: '10', before: '/api/placeholder/400/300', after: '/api/placeholder/400/300', video: '/api/placeholder/800/600/video', title: 'Contemporary Dining Space', description: 'Sleek design perfect for entertaining guests', style: 'Modern Minimalist', room: 'Dining Room', keyFeatures: ['Sleek Design', 'Statement Lighting', 'Quality Materials', 'Entertainment Ready'] }
    ]
    return [...builtInItems, ...(galleryVideos || [])]
  }, [galleryVideos])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing': return <LandingPage setCurrentView={setCurrentView} setProjects={setProjects} setSelectedProject={setSelectedProject} setWorkspaceTab={() => {}} />
      case 'dashboard': return <ProjectDashboard setIsCreateProjectOpen={setIsCreateProjectOpen} />
      case 'workspace': return <VisualizationWorkspace selectedProject={selectedProject} setCurrentView={setCurrentView}  />
      case 'gallery': return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Gallery Header */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transformation Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing room transformations created with our AI-powered interior design platform. 
              Get inspired by real makeovers from our community.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="container mx-auto px-6 py-8">
          {/* Filter Controls */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Room Type Filters */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by Room</h3>
                <div className="flex flex-wrap gap-2">
                  {(['All Rooms', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Office'] as const).map((room) => (
                    <Button
                      key={room}
                      variant={activeRoomFilter === room ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setActiveRoomFilter(room)}
                    >
                      {room}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style Filters */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by Style</h3>
                <div className="flex flex-wrap gap-2">
                  {(['All Styles', 'Modern Minimalist', 'Scandinavian', 'Industrial', 'Bohemian', 'Mid-Century Modern', 'Farmhouse'] as const).map((style) => (
                    <Button
                      key={style}
                      variant={activeStyleFilter === style ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setActiveStyleFilter(style)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters & Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                {activeRoomFilter !== 'All Rooms' && (
                  <Badge variant="secondary" className="gap-1">
                    {activeRoomFilter}
                    <button 
                      onClick={() => setActiveRoomFilter('All Rooms')}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {activeStyleFilter !== 'All Styles' && (
                  <Badge variant="secondary" className="gap-1">
                    {activeStyleFilter}
                    <button 
                      onClick={() => setActiveStyleFilter('All Styles')}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {(activeRoomFilter !== 'All Rooms' || activeStyleFilter !== 'All Styles') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveRoomFilter('All Rooms')
                      setActiveStyleFilter('All Styles')
                    }}
                    className="text-xs h-6 px-2"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? 'transformation' : 'transformations'} found
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((
