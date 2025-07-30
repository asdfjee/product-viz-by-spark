import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Camera, 
  Sparkles, 
  Upload, 
  ArrowRight, 
  Palette, 
  ShoppingBag, 
  Lightbulb,
  Star,
  Play,
  Check,
  Plus,
  Folder,
  Image as ImageIcon,
  Type,
  Wand2,
  Download,
  RefreshCw,
  List,
  X,
  Envelope,
  MapPin,
  Phone
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

// Types for our application
interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  thumbnail?: string
  visualizations: Visualization[]
}

interface Visualization {
  id: string
  type: 'specific-item' | 'style-brainstorm'
  originalImage: string
  generatedImage?: string
  description: string
  createdAt: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
}

// Mock data for demonstration
const featuredVisualizationsData = [
  {
    id: '1',
    before: '/api/placeholder/300/200',
    after: '/api/placeholder/300/200',
    video: '/api/placeholder/600/400/video', // Optional video showing transformation
    description: 'Modern living room transformation'
  },
  {
    id: '2', 
    before: '/api/placeholder/300/200',
    after: '/api/placeholder/300/200',
    video: '/api/placeholder/600/400/video',
    description: 'Cozy bedroom makeover'
  },
  {
    id: '3',
    before: '/api/placeholder/300/200', 
    after: '/api/placeholder/300/200',
    video: '/api/placeholder/600/400/video',
    description: 'Minimalist kitchen design'
  }
]

// Toggle Comparison Component for the detail modal
const ToggleComparison = ({ transformation }: { transformation: any }) => {
  const [showAfter, setShowAfter] = useState(false)

  return (
    <div className="relative h-full">
      {/* Image Display */}
      <div className="absolute inset-0">
        {showAfter ? (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-accent" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg border">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={!showAfter ? 'default' : 'ghost'}
              onClick={() => setShowAfter(false)}
              className="rounded-full px-4 h-8"
            >
              Before
            </Button>
            <Button
              size="sm"
              variant={showAfter ? 'default' : 'ghost'}
              onClick={() => setShowAfter(true)}
              className="rounded-full px-4 h-8"
            >
              After
            </Button>
          </div>
        </div>
      </div>

      {/* Current State Label */}
      <div className="absolute top-4 left-4">
        <Badge className={showAfter ? "bg-accent text-accent-foreground" : "bg-black/70 text-white"}>
          {showAfter ? 'After' : 'Before'}
        </Badge>
      </div>
    </div>
  )
}

function App() {
  // App state management
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace' | 'gallery' | 'about'>('landing')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [workspaceTab, setWorkspaceTab] = useState('upload')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // User data persistence
  const [user, setUser] = useKV('user-profile', null)
  const [projects, setProjects, deleteProjects] = useKV<Project[]>('user-projects', [])
  const [currentVisualization, setCurrentVisualization] = useState<Visualization | null>(null)

  // Form states - using useKV for persistence to prevent re-render issues
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [itemDescription, setItemDescription] = useKV('workspace-item-description', '')
  const [styleDescription, setStyleDescription] = useKV('workspace-style-description', '')
  const [refinementInput, setRefinementInput] = useKV('workspace-refinement-input', '')

  // Footer component for consistency across pages
  const Footer = () => (
    <footer className="py-8 text-center">
      <div className="container mx-auto px-6">
        <div className="text-sm text-muted-foreground">
          © 2024 Product Viz. All rights reserved. • Contact us: <a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a>
        </div>
      </div>
    </footer>
  )

  // Header component with navigation
  const Header = () => (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('landing')
              }}
            >
              Home
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('dashboard')
              }}
            >
              Projects
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('gallery')
              }}
            >
              Gallery
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('about')
              }}
            >
              About
            </a>
            <Button 
              className="ml-4"
              onClick={() => setCurrentView('dashboard')}
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-around w-6 h-5 bg-transparent border-none cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <List className="w-6 h-6 text-foreground" />
            )}
          </button>

          {/* Logo/Brand */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              PRODUCT VIZ
            </h1>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 border-t border-border">
            <div className="flex flex-col gap-4 pt-6">
              <a 
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentView('landing')
                  setIsMobileMenuOpen(false)
                }}
              >
                Home
              </a>
              <a 
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentView('dashboard')
                  setIsMobileMenuOpen(false)
                }}
              >
                Projects
              </a>
              <a 
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentView('gallery')
                  setIsMobileMenuOpen(false)
                }}
              >
                Gallery
              </a>
              <a 
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentView('about')
                  setIsMobileMenuOpen(false)
                }}
              >
                About
              </a>
              <Button 
                className="mt-2"
                onClick={() => {
                  setCurrentView('dashboard')
                  setIsMobileMenuOpen(false)
                }}
              >
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Interior Design
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Visualize Your
              <span className="block" style={{ color: '#798ab5' }}>Dream Space</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your room with AI. Upload a photo, describe your vision, and see your space come to life with furniture that fits perfectly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setCurrentView('dashboard')}
              >
                Start Designing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your space
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card 
            className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
            onClick={() => {
              setCurrentView('dashboard')
              // Auto-create a project and go to upload tab
              const newProject: Project = {
                id: Date.now().toString(),
                name: 'Quick Upload Project',
                description: 'Created from homepage upload step',
                createdAt: new Date().toISOString(),
                visualizations: []
              }
              setProjects(currentProjects => [...(currentProjects || []), newProject])
              setSelectedProject(newProject)
              setTimeout(() => {
                setCurrentView('workspace')
                setWorkspaceTab('upload')
              }, 100)
            }}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Camera className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Upload Your Room</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Take a photo of your space and let our AI analyze the lighting, perspective, and layout.
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">
                  Start Upload →
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
            onClick={() => {
              setCurrentView('dashboard')
              // Auto-create a project and go to specific item tab
              const newProject: Project = {
                id: Date.now().toString(),
                name: 'Vision Project',
                description: 'Created from homepage vision step',
                createdAt: new Date().toISOString(),
                visualizations: []
              }
              setProjects(currentProjects => [...(currentProjects || []), newProject])
              setSelectedProject(newProject)
              setTimeout(() => {
                setCurrentView('workspace')
                setWorkspaceTab('style')
              }, 100)
            }}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Wand2 className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Describe Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tell us what you want or upload specific furniture. Our AI understands natural language.
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">
                  Describe Now →
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
            onClick={() => setCurrentView('gallery')}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Shop Your Look</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                See realistic results and shop for every item directly. Make your vision reality.
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">
                  Browse Gallery →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Transformations */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Amazing Transformations</h2>
            <p className="text-xl text-muted-foreground">
              See what others have created with Product Viz 2.0
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVisualizationsData.map((viz) => (
              <Card key={viz.id} className="overflow-hidden border-0 shadow-lg group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={viz.video} type="video/mp4" />
                      {/* Fallback for browsers that don't support video */}
                      <div className="absolute inset-0 bg-gradient-to-r from-muted to-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </video>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-foreground">Before → After</Badge>
                  </div>
                  {/* Play overlay for visual indication */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
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
    </div>
  )

  // Create Project Dialog Component
  const CreateProjectDialog = () => {
    const [localProjectForm, setLocalProjectForm] = useState({ name: '', description: '' })

    const handleCreateProject = () => {
      if (localProjectForm.name.trim()) {
        const newProject: Project = {
          id: Date.now().toString(),
          name: localProjectForm.name,
          description: localProjectForm.description,
          createdAt: new Date().toISOString(),
          visualizations: []
        }
        
        setProjects(currentProjects => [...(currentProjects || []), newProject])
        setSelectedProject(newProject)
        setLocalProjectForm({ name: '', description: '' })
        setIsCreateProjectOpen(false)
        setCurrentView('workspace')
        toast.success('Project created successfully!')
      }
    }

    const handleCancelProject = () => {
      setLocalProjectForm({ name: '', description: '' })
      setIsCreateProjectOpen(false)
    }

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setLocalProjectForm({ name: '', description: '' })
      }
      setIsCreateProjectOpen(open)
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
                key="project-name-input"
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
                key="project-description-textarea"
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
  const ProjectDashboard = () => (
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

  // Workspace Component (Visualization Interface)
  const VisualizationWorkspace = () => (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Workspace Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Back to Projects
              </Button>
              <div>
                <h1 className="text-xl font-bold">{selectedProject?.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedProject?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs 
          key="workspace-tabs"
          value={workspaceTab} 
          onValueChange={setWorkspaceTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Scene</TabsTrigger>
            <TabsTrigger value="specific">Specific Item</TabsTrigger>
            <TabsTrigger value="style">Style Brainstorm</TabsTrigger>
            <TabsTrigger value="refine">Refine & Shop</TabsTrigger>
          </TabsList>
          
          {/* Upload Scene Tab */}
          <TabsContent key="upload-tab" value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Your Room Photo
                </CardTitle>
                <CardDescription>
                  Take a well-lit photo of your space. The AI works best with good lighting and a clear view of the area you want to redesign.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 group-hover:text-accent transition-colors" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop your room photo here</p>
                    <p className="text-muted-foreground">or click to browse files</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                  </div>
                </div>
                
                {uploadedImage && (
                  <div className="mt-6">
                    <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-green-500/90 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Photo uploaded
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="flex items-center gap-2 text-accent mb-2">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">AI Analysis</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great lighting and perspective! This photo will work well for visualization. 
                        The AI detected good natural light from the left side and clear floor space for furniture placement.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Specific Item Tab */}
          <TabsContent key="specific-tab" value="specific" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Visualize a Specific Item
                </CardTitle>
                <CardDescription>
                  Upload a product photo or describe exactly what you want to place in your room.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="describe" key="specific-item-tabs">
                  <TabsList>
                    <TabsTrigger value="describe">Describe Item</TabsTrigger>
                    <TabsTrigger value="upload">Upload Product Photo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="describe" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-description">Describe the item you want to add</Label>
                      <Textarea
                        key="item-description-textarea"
                        id="item-description"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="e.g., A modern gray sectional sofa with clean lines and metal legs"
                        rows={4}
                        autoComplete="off"
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Tip:</strong> Be specific about colors, materials, and style. 
                        The more details you provide, the better the AI can match your vision.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="font-medium mb-1">Upload product photo</p>
                      <p className="text-sm text-muted-foreground">Drop image or click to browse</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!uploadedImage || !itemDescription.trim()}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Visualization
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Style Brainstorm Tab */}
          <TabsContent key="style-tab" value="style" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Brainstorm a Style
                </CardTitle>
                <CardDescription>
                  Describe the overall vibe or style you want, and let AI design the entire space for you.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="style-description">Describe your desired style or vibe</Label>
                  <Textarea
                    key="style-description-textarea"
                    id="style-description"
                    value={styleDescription}
                    onChange={(e) => setStyleDescription(e.target.value)}
                    placeholder="e.g., Cozy Scandinavian living room with warm textures and natural wood accents"
                    rows={4}
                    autoComplete="off"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Modern Minimalist', 'Cozy Farmhouse', 'Mid-Century Modern', 'Bohemian Chic'].map((style) => (
                    <Button
                      key={style}
                      variant="outline"
                      size="sm"
                      onClick={() => setStyleDescription(style)}
                      className="text-sm"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!uploadedImage || !styleDescription.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Style Concepts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Refine & Shop Tab */}
          <TabsContent key="refine-tab" value="refine" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Visualization</CardTitle>
                  <CardDescription>
                    Your AI-generated room design. Use the controls below to refine and adjust.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Generated visualization will appear here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="refinement">Refine with text commands</Label>
                      <Input
                        key="refinement-input"
                        id="refinement"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., Make the sofa darker blue, add a coffee table"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shop This Look</CardTitle>
                  <CardDescription>
                    Browse and purchase the items from your visualization.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Modern Gray Sectional', price: '$1,299', store: 'West Elm' },
                      { name: 'Wooden Coffee Table', price: '$449', store: 'CB2' },
                      { name: 'Floor Lamp', price: '$189', store: 'IKEA' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded"></div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.store}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.price}</p>
                          <Button size="sm" className="mt-1">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>$1,937</span>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Shop Complete Look
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  )

  // Gallery Page Component
  const GalleryPage = () => {
    const [activeRoomFilter, setActiveRoomFilter] = useState('All Rooms')
    const [activeStyleFilter, setActiveStyleFilter] = useState('All Styles')
    const [selectedTransformation, setSelectedTransformation] = useState<any>(null)
    const [comparisonMode, setComparisonMode] = useState<'split' | 'slide' | 'toggle'>('split')
    const [sliderPosition, setSliderPosition] = useState(50) // For the slider comparison

    // Handle keyboard shortcuts for modal
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!selectedTransformation) return
        
        if (e.key === 'Escape') {
          setSelectedTransformation(null)
        } else if (e.key === '1') {
          setComparisonMode('split')
        } else if (e.key === '2') {
          setComparisonMode('slide')
        } else if (e.key === '3') {
          setComparisonMode('toggle')
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [selectedTransformation])

    const galleryItems = [
      {
        id: '1',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Modern Living Room Transformation',
        description: 'A complete makeover featuring contemporary furniture and warm lighting',
        style: 'Modern Minimalist',
        room: 'Living Room',
        keyFeatures: ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines'],
        items: [
          { name: 'Modern Sectional Sofa', price: '$1,299', brand: 'West Elm' },
          { name: 'Glass Coffee Table', price: '$449', brand: 'CB2' },
          { name: 'Floor Lamp', price: '$189', brand: 'IKEA' }
        ]
      },
      {
        id: '2',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Scandinavian Bedroom Retreat',
        description: 'Cozy bedroom design with natural textures and clean lines',
        style: 'Scandinavian',
        room: 'Bedroom',
        keyFeatures: ['Natural Textures', 'Hygge Vibes', 'Light Woods', 'Minimal Clutter'],
        items: [
          { name: 'Platform Bed Frame', price: '$899', brand: 'MUJI' },
          { name: 'Wool Throw Blanket', price: '$129', brand: 'Parachute' },
          { name: 'Bedside Table', price: '$299', brand: 'HAY' }
        ]
      },
      {
        id: '3',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Industrial Kitchen Design',
        description: 'Bold kitchen featuring exposed elements and modern appliances',
        style: 'Industrial',
        room: 'Kitchen',
        keyFeatures: ['Exposed Brick', 'Metal Accents', 'Open Shelving', 'Dark Palette'],
        items: [
          { name: 'Industrial Bar Stools', price: '$349', brand: 'Restoration Hardware' },
          { name: 'Pendant Light Fixtures', price: '$229', brand: 'CB2' },
          { name: 'Open Shelving Unit', price: '$399', brand: 'West Elm' }
        ]
      },
      {
        id: '4',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Bohemian Chic Dining Room',
        description: 'Eclectic dining space with vibrant colors and mixed textures',
        style: 'Bohemian',
        room: 'Dining Room',
        keyFeatures: ['Mixed Patterns', 'Vibrant Colors', 'Vintage Pieces', 'Global Textiles'],
        items: [
          { name: 'Moroccan Dining Table', price: '$799', brand: 'World Market' },
          { name: 'Mixed Dining Chairs', price: '$199', brand: 'Anthropologie' },
          { name: 'Persian Area Rug', price: '$549', brand: 'Rugs USA' }
        ]
      },
      {
        id: '5',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Mid-Century Modern Office',
        description: 'Productive workspace with vintage-inspired furniture',
        style: 'Mid-Century Modern',
        room: 'Office',
        keyFeatures: ['Vintage Style', 'Rich Woods', 'Geometric Patterns', 'Bold Colors'],
        items: [
          { name: 'Walnut Desk', price: '$1,199', brand: 'Article' },
          { name: 'Ergonomic Office Chair', price: '$459', brand: 'Herman Miller' },
          { name: 'Geometric Bookshelf', price: '$399', brand: 'Design Within Reach' }
        ]
      },
      {
        id: '6',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Cozy Farmhouse Living Room',
        description: 'Rustic charm meets modern comfort in this inviting space',
        style: 'Farmhouse',
        room: 'Living Room',
        keyFeatures: ['Rustic Woods', 'Neutral Tones', 'Vintage Accents', 'Cozy Textiles'],
        items: [
          { name: 'Reclaimed Wood Coffee Table', price: '$649', brand: 'Pottery Barn' },
          { name: 'Linen Sectional Sofa', price: '$1,499', brand: 'Restoration Hardware' },
          { name: 'Vintage Table Lamps', price: '$229', brand: 'Wayfair' }
        ]
      },
      {
        id: '7',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Minimalist Bedroom Sanctuary',
        description: 'Clean lines and neutral tones create a peaceful retreat',
        style: 'Modern Minimalist',
        room: 'Bedroom',
        keyFeatures: ['Clean Lines', 'Neutral Palette', 'Quality Materials', 'Functional Design'],
        items: [
          { name: 'Platform Bed', price: '$999', brand: 'Floyd' },
          { name: 'Organic Cotton Bedding', price: '$199', brand: 'Brooklinen' },
          { name: 'Minimalist Nightstand', price: '$349', brand: 'Blu Dot' }
        ]
      },
      {
        id: '8',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Rustic Kitchen Renovation',
        description: 'Farmhouse elements meet modern functionality',
        style: 'Farmhouse',
        room: 'Kitchen',
        keyFeatures: ['Shaker Cabinets', 'Butcher Block', 'Vintage Hardware', 'Subway Tile'],
        items: [
          { name: 'Farmhouse Sink', price: '$799', brand: 'Kohler' },
          { name: 'Butcher Block Island', price: '$1,299', brand: 'IKEA' },
          { name: 'Vintage Pendant Lights', price: '$179', brand: 'Rejuvenation' }
        ]
      },
      {
        id: '9',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Contemporary Dining Space',
        description: 'Sleek design perfect for entertaining guests',
        style: 'Modern Minimalist',
        room: 'Dining Room',
        keyFeatures: ['Sleek Design', 'Statement Lighting', 'Quality Materials', 'Entertainment Ready'],
        items: [
          { name: 'Live Edge Dining Table', price: '$1,899', brand: 'Room & Board' },
          { name: 'Modern Dining Chairs', price: '$299', brand: 'Design Within Reach' },
          { name: 'Statement Chandelier', price: '$699', brand: 'West Elm' }
        ]
      }
    ]

    // Filter rooms and styles arrays
    const roomTypes = ['All Rooms', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Office']
    const styleTypes = ['All Styles', 'Modern Minimalist', 'Scandinavian', 'Industrial', 'Bohemian', 'Mid-Century Modern', 'Farmhouse']

    // Filter gallery items based on active filters
    const filteredItems = galleryItems.filter(item => {
      const roomMatch = activeRoomFilter === 'All Rooms' || item.room === activeRoomFilter
      const styleMatch = activeStyleFilter === 'All Styles' || item.style === activeStyleFilter
      return roomMatch && styleMatch
    })

    return (
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
                  {roomTypes.map((room) => (
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
                  {styleTypes.map((style) => (
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
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
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
              filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    {/* Video/Image Display */}
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={item.video} type="video/mp4" />
                        {/* Fallback */}
                        <div className="absolute inset-0 bg-gradient-to-r from-muted to-accent/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-muted-foreground" />
                        </div>
                      </video>
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-95 group-hover:scale-100"
                        onClick={() => setSelectedTransformation(item)}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        View Transformation
                      </Button>
                    </div>

                    {/* Style Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {item.style}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{item.room}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current text-accent" />
                        <span>Featured</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTransformation(item)}
                      >
                        View Details
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              /* No Results State */
              <div className="col-span-full">
                <Card className="text-center py-16">
                  <CardContent>
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No transformations found</CardTitle>
                    <CardDescription className="mb-6">
                      Try adjusting your filters to see more results, or{' '}
                      <button 
                        onClick={() => {
                          setActiveRoomFilter('All Rooms')
                          setActiveStyleFilter('All Styles')
                        }}
                        className="text-accent hover:underline"
                      >
                        clear all filters
                      </button>
                    </CardDescription>
                    <Button 
                      onClick={() => {
                        setActiveRoomFilter('All Rooms')
                        setActiveStyleFilter('All Styles')
                      }}
                    >
                      Show All Transformations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Load More - Only show if there are results */}
          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Transformations
              </Button>
            </div>
          )}
        </div>

        {/* Transformation Detail Modal */}
        <Dialog open={!!selectedTransformation} onOpenChange={() => setSelectedTransformation(null)}>
          <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
            {selectedTransformation && (
              <div className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedTransformation.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg mt-1">
                      {selectedTransformation.description}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{selectedTransformation.room}</Badge>
                    <Badge variant="outline">{selectedTransformation.style}</Badge>
                  </div>
                </div>

                {/* Comparison Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Comparison Mode:</span>
                    <div className="flex rounded-lg border p-1">
                      <Button
                        size="sm"
                        variant={comparisonMode === 'split' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('split')}
                        className="rounded-md px-3 h-7"
                      >
                        Split View
                      </Button>
                      <Button
                        size="sm"
                        variant={comparisonMode === 'slide' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('slide')}
                        className="rounded-md px-3 h-7"
                      >
                        Slider
                      </Button>
                      <Button
                        size="sm"
                        variant={comparisonMode === 'toggle' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('toggle')}
                        className="rounded-md px-3 h-7"
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Shop Look
                    </Button>
                    <div className="text-xs text-muted-foreground ml-2">
                      Press 1-3 to change view • ESC to close
                    </div>
                  </div>
                </div>

                {/* Main Comparison Area */}
                <div className="flex-1 p-6">
                  <div className="grid lg:grid-cols-3 gap-6 h-full">
                    {/* Before/After Comparison */}
                    <div className="lg:col-span-2">
                      <div className="h-full bg-muted rounded-lg relative overflow-hidden">
                        {comparisonMode === 'split' && (
                          <div className="grid grid-cols-2 h-full">
                            <div className="relative border-r border-border">
                              <div className="absolute top-4 left-4 z-10">
                                <Badge className="bg-black/70 text-white">Before</Badge>
                              </div>
                              <div className="w-full h-full bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute top-4 right-4 z-10">
                                <Badge className="bg-accent text-accent-foreground">After</Badge>
                              </div>
                              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-accent" />
                              </div>
                            </div>
                          </div>
                        )}

                        {comparisonMode === 'slide' && (
                          <div className="relative h-full">
                            {/* Before Image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 flex items-center justify-center">
                              <ImageIcon className="w-16 h-16 text-muted-foreground" />
                            </div>
                            
                            {/* After Image with slider overlay */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
                              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                            >
                              <ImageIcon className="w-16 h-16 text-accent" />
                            </div>
                            
                            {/* Slider Handle */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
                              style={{ left: `${sliderPosition}%` }}
                              onMouseDown={(e) => {
                                const startX = e.clientX
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                                if (!rect) return
                                
                                const handleMouseMove = (e: MouseEvent) => {
                                  const newPosition = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                                  setSliderPosition(newPosition)
                                }
                                
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove)
                                  document.removeEventListener('mouseup', handleMouseUp)
                                }
                                
                                document.addEventListener('mousemove', handleMouseMove)
                                document.addEventListener('mouseup', handleMouseUp)
                              }}
                            >
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-grab">
                                <div className="w-1 h-4 bg-gray-400 rounded"></div>
                              </div>
                            </div>
                            
                            {/* Labels */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-black/70 text-white">Before</Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-accent text-accent-foreground">After</Badge>
                            </div>
                          </div>
                        )}

                        {comparisonMode === 'toggle' && (
                          <ToggleComparison transformation={selectedTransformation} />
                        )}
                      </div>
                    </div>

                    {/* Details Sidebar */}
                    <div className="space-y-6">
                      {/* Transformation Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Transformation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Room Type</Label>
                            <p className="font-medium">{selectedTransformation.room}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Design Style</Label>
                            <p className="font-medium">{selectedTransformation.style}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Key Features</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(selectedTransformation.keyFeatures || ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines']).map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Featured Items */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Featured Items</CardTitle>
                          <CardDescription>
                            Key pieces from this transformation
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {(selectedTransformation.items || [
                              { name: 'Modern Sectional Sofa', price: '$1,299', brand: 'West Elm' },
                              { name: 'Glass Coffee Table', price: '$449', brand: 'CB2' },
                              { name: 'Floor Lamp', price: '$189', brand: 'IKEA' }
                            ]).map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-muted rounded"></div>
                                  <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-sm">{item.price}</p>
                                  <Button size="sm" variant="outline" className="mt-1 h-6 px-2 text-xs">
                                    <ShoppingBag className="w-3 h-3 mr-1" />
                                    Buy
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Get This Look</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Shop Complete Look
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create Similar Design
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Save Inspiration
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CTA Section */}
        <div className="bg-accent text-accent-foreground py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have redesigned their homes with AI
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setCurrentView('dashboard')}
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // About Page Component  
  const AboutPage = () => (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Product Viz
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing interior design by making it accessible, interactive, and instant. 
            Our AI-powered platform empowers anyone to visualize and shop for home furnishings 
            within their own space, transforming interior design from guesswork into creativity.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize interior design by providing cutting-edge AI tools that help everyone 
              create beautiful, personalized spaces they love to live in.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Design</h3>
              <p className="text-muted-foreground">
                Advanced machine learning algorithms understand your space and preferences 
                to generate realistic, contextual design solutions.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Photo-Realistic Results</h3>
              <p className="text-muted-foreground">
                See exactly how furniture will look in your actual room with 
                accurate lighting, scale, and perspective rendering.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Shopping</h3>
              <p className="text-muted-foreground">
                Seamlessly purchase any item from your design with direct links 
                to trusted retailers and real-time pricing.
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">How Product Viz Works</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Upload Your Space</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Simply take a photo of your room using your phone or camera. Our AI analyzes 
                    the lighting, dimensions, and existing elements to understand your space.
                  </p>
                </div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold">Describe Your Vision</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Tell us what you want in natural language or upload specific furniture photos. 
                    Our AI understands style preferences, colors, and design concepts.
                  </p>
                </div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Type className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold">See & Shop Results</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Receive realistic visualizations of your redesigned space and instantly shop 
                    for every item with real products from trusted retailers.
                  </p>
                </div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10K+</div>
              <p className="text-muted-foreground">Rooms Transformed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">25K+</div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <p className="text-muted-foreground">Retail Partners</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions about Product Viz or need help with your design project? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={4} placeholder="Tell us about your project or question..." />
                  </div>
                  <Button className="w-full">
                    <Envelope className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Envelope className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:hello@productviz.com" className="text-accent hover:underline">
                          hello@productviz.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Office</p>
                        <p className="text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-6 bg-accent/5 border-accent/20">
                  <h4 className="font-bold mb-3">Need immediate help?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out our comprehensive help documentation or browse our community forum for quick answers.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Help Center
                    </Button>
                    <Button variant="outline" size="sm">
                      Community
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )

  // Render current view
  if (currentView === 'landing') return <LandingPage />
  if (currentView === 'dashboard') return <ProjectDashboard />
  if (currentView === 'workspace') return <VisualizationWorkspace />
  if (currentView === 'gallery') return <GalleryPage />
  if (currentView === 'about') return <AboutPage />
  
  return <LandingPage />
}

export default App