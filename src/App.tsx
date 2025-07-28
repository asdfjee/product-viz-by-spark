import React, { useState } from 'react'
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
  X
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

  // Form states
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [itemDescription, setItemDescription] = useState('')
  const [styleDescription, setStyleDescription] = useState('')

  // Header component with navigation
  const Header = () => (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              PRODUCT VIZ
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('landing')
              }}
            >
              Home
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('dashboard')
              }}
            >
              Projects
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('gallery')
              }}
            >
              Gallery
            </a>
            <a 
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium"
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
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 border-t border-border">
            <div className="flex flex-col gap-4 pt-6">
              <a 
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2"
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
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2"
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
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2"
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
                className="text-foreground hover:text-primary transition-colors font-medium text-center py-2"
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
              <span className="block text-accent">Dream Space</span>
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
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Upload Your Room</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Take a photo of your space and let our AI analyze the lighting, perspective, and layout.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Describe Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tell us what you want or upload specific furniture. Our AI understands natural language.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Shop Your Look</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See realistic results and shop for every item directly. Make your vision reality.
              </p>
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
    </div>
  )

  // Project Dashboard Component
  const ProjectDashboard = () => (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Projects</h2>
              <p className="text-muted-foreground">
                Create and manage your interior design projects
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateProjectOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No projects yet</CardTitle>
              <CardDescription className="mb-6">
                Create your first project to start visualizing your dream space
              </CardDescription>
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => {
                  setSelectedProject(project)
                  setCurrentView('workspace')
                }}
              >
                <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary">
                      Open Project
                    </Button>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.visualizations.length} visualizations</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
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
                id="project-name"
                value={projectForm.name}
                onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Living Room Makeover"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your vision for this space..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (projectForm.name.trim()) {
                  const newProject: Project = {
                    id: Date.now().toString(),
                    name: projectForm.name,
                    description: projectForm.description,
                    createdAt: new Date().toISOString(),
                    visualizations: []
                  }
                  
                  setProjects(prev => [...prev, newProject])
                  setSelectedProject(newProject)
                  setProjectForm({ name: '', description: '' })
                  setIsCreateProjectOpen(false)
                  setCurrentView('workspace')
                  toast.success('Project created successfully!')
                }
              }}
              disabled={!projectForm.name.trim()}
            >
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
        <Tabs value={workspaceTab} onValueChange={setWorkspaceTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Scene</TabsTrigger>
            <TabsTrigger value="specific">Specific Item</TabsTrigger>
            <TabsTrigger value="style">Style Brainstorm</TabsTrigger>
            <TabsTrigger value="refine">Refine & Shop</TabsTrigger>
          </TabsList>
          
          {/* Upload Scene Tab */}
          <TabsContent value="upload" className="space-y-6">
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
          <TabsContent value="specific" className="space-y-6">
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
                <Tabs defaultValue="describe">
                  <TabsList>
                    <TabsTrigger value="describe">Describe Item</TabsTrigger>
                    <TabsTrigger value="upload">Upload Product Photo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="describe" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-description">Describe the item you want to add</Label>
                      <Textarea
                        id="item-description"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="e.g., A modern gray sectional sofa with clean lines and metal legs"
                        rows={4}
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
          <TabsContent value="style" className="space-y-6">
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
                    id="style-description"
                    value={styleDescription}
                    onChange={(e) => setStyleDescription(e.target.value)}
                    placeholder="e.g., Cozy Scandinavian living room with warm textures and natural wood accents"
                    rows={4}
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
          <TabsContent value="refine" className="space-y-6">
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
                        id="refinement"
                        placeholder="e.g., Make the sofa darker blue, add a coffee table"
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
    </div>
  )

  // Gallery Page Component
  const GalleryPage = () => {
    const galleryItems = [
      {
        id: '1',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Modern Living Room Transformation',
        description: 'A complete makeover featuring contemporary furniture and warm lighting',
        style: 'Modern Minimalist',
        room: 'Living Room'
      },
      {
        id: '2',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Scandinavian Bedroom Retreat',
        description: 'Cozy bedroom design with natural textures and clean lines',
        style: 'Scandinavian',
        room: 'Bedroom'
      },
      {
        id: '3',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Industrial Kitchen Design',
        description: 'Bold kitchen featuring exposed elements and modern appliances',
        style: 'Industrial',
        room: 'Kitchen'
      },
      {
        id: '4',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Bohemian Chic Dining Room',
        description: 'Eclectic dining space with vibrant colors and mixed textures',
        style: 'Bohemian',
        room: 'Dining Room'
      },
      {
        id: '5',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Mid-Century Modern Office',
        description: 'Productive workspace with vintage-inspired furniture',
        style: 'Mid-Century Modern',
        room: 'Office'
      },
      {
        id: '6',
        before: '/api/placeholder/400/300',
        after: '/api/placeholder/400/300',
        video: '/api/placeholder/800/600/video',
        title: 'Cozy Farmhouse Living Room',
        description: 'Rustic charm meets modern comfort in this inviting space',
        style: 'Farmhouse',
        room: 'Living Room'
      }
    ]

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

        {/* Filter Tabs */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['All Rooms', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Office'].map((filter) => (
              <Button
                key={filter}
                variant={filter === 'All Rooms' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
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
                    <Button variant="outline" size="sm">
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
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Transformations
            </Button>
          </div>
        </div>

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

      {/* CTA Section */}
      <div className="bg-accent text-accent-foreground py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your space today with the power of AI interior design
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setCurrentView('dashboard')}
          >
            Start Designing Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
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