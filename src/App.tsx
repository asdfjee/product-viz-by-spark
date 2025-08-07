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
  Phone,
  Settings,
  Trash2
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
// Video files served from public directory for better production performance
const modernLivingRoomVideo = '/videos/modern-living-room-transformation.mp4'
const cozyBedroomVideo = '/videos/Cozy_Room_Transformation_Video_(1).mp4'
const kitchenPanVideo = '/videos/Kitchen_Pan_Video_Generation.mp4'

// Production video verification
const verifyVideoPath = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// Fallback to check if videos exist and provide alternatives
const checkVideoPath = (primaryPath: string, fallbacks: string[] = []) => {
  // In production, we'll use the primary path
  // The fallbacks are for development/testing
  return primaryPath
}



// Enhanced Video Component with better production error handling
const EnhancedVideo = ({ 
  src, 
  className = "", 
  autoPlay = true, 
  muted = true, 
  loop = true, 
  playsInline = true,
  controls = false,
  onError,
  ...props 
}: {
  src: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  controls?: boolean
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void
  [key: string]: any
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video failed to load:', src, 'Error:', e.currentTarget.error)
    
    // Log more details about the error
    const video = e.currentTarget
    if (video.error) {
      console.error('Video error code:', video.error.code)
      console.error('Video error message:', video.error.message)
    }
    
    // Try to reload the video once with a slight delay
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1)
      setTimeout(() => {
        setIsLoading(true)
        setHasError(false)
        video.load()
      }, 1000)
      return
    }
    
    setHasError(true)
    setIsLoading(false)
    if (onError) onError(e)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
    setRetryCount(0)
  }

  const handleLoadedData = () => {
    setIsLoading(false)
    setRetryCount(0)
  }

  // Production fallback: show placeholder instead of broken video
  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Play className="w-8 h-8 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground">Transformation Video</p>
          <p className="text-xs text-muted-foreground mt-1">Professional design showcase</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading video...</p>
          </div>
        </div>
      )}
      <video
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        preload="metadata"
        crossOrigin="anonymous"
        {...props}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  )
}

// Types for our application
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

// Mock data for demonstration
const featuredVisualizationsData = [
  {
    id: '1',
    before: '/api/placeholder/300/200',
    after: '/api/placeholder/300/200',
    video: modernLivingRoomVideo,
    description: 'Modern living room transformation'
  },
  {
    id: '2', 
    before: '/api/placeholder/300/200',
    after: '/api/placeholder/300/200',
    video: cozyBedroomVideo,
    description: 'Cozy bedroom makeover'
  },
  {
    id: '3',
    before: '/api/placeholder/300/200', 
    after: '/api/placeholder/300/200',
    video: kitchenPanVideo,
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
  const [currentRequest, setCurrentRequest] = useState<VisualizationRequest | null>(null)
  const [galleryVideos, setGalleryVideos] = useKV<any[]>('gallery-videos', [])

  // Form states - using useState for smooth typing experience
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [itemDescription, setItemDescription] = useState('')
  const [styleDescription, setStyleDescription] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // File input reference for upload functionality
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Check video availability and log status
  React.useEffect(() => {
    // Simple availability check without blocking production
    const videos = [modernLivingRoomVideo, cozyBedroomVideo, kitchenPanVideo]
    
    // Only do extensive checking in development
    if (process.env.NODE_ENV === 'development') {
      const checkVideoAvailability = async () => {
        for (const video of videos) {
          try {
            const response = await fetch(video, { method: 'HEAD' })
            console.log(`Video ${video}:`, response.ok ? 'Available' : `Status ${response.status}`)
          } catch (error) {
            console.warn(`Failed to check video: ${video}`, error)
          }
        }
      }
      checkVideoAvailability()
    } else {
      // In production, just log the video paths being used
      console.log('Production video paths:', videos)
    }
  }, [])

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        toast.success('Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
          toast.success('Image uploaded successfully!')
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Please upload an image file.')
      }
    }
  }
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
              Submit your room photo and design preferences to our professional team. Get custom visualizations delivered to your email within 3-5 business days.
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
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setCurrentView('gallery')}
              >
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
              // Auto-create a project and go directly to workspace
              const newProject: Project = {
                id: Date.now().toString(),
                name: 'Quick Upload Project',
                description: 'Created from homepage upload step',
                createdAt: new Date().toISOString(),
                visualizationRequests: []
              }
              setProjects(currentProjects => [...(currentProjects || []), newProject])
              setSelectedProject(newProject)
              setWorkspaceTab('upload')
              setCurrentView('workspace')
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
                Upload your room photo and let our professional design team analyze the space and create custom visualizations.
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
              // Auto-create a project and go directly to workspace
              const newProject: Project = {
                id: Date.now().toString(),
                name: 'Vision Project',
                description: 'Created from homepage vision step',
                createdAt: new Date().toISOString(),
                visualizationRequests: []
              }
              setProjects(currentProjects => [...(currentProjects || []), newProject])
              setSelectedProject(newProject)
              setWorkspaceTab('style')
              setCurrentView('workspace')
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
                Describe your vision or upload specific furniture. Our design team will create professional visualizations and email them to you.
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
                <Download className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Receive Your Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Receive professional-quality visualizations and purchase recommendations delivered to your email within 3-5 business days.
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">
                  Receive Results →
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
            <h2 className="text-4xl font-bold mb-4">Professional Design Transformations</h2>
            <p className="text-xl text-muted-foreground">
              Real projects completed by our professional design team - delivered via email
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVisualizationsData.map((viz) => (
                 <Card 
                key={viz.id} 
                className="overflow-hidden border-0 shadow-lg group cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setCurrentView('gallery')}
              >
                <div className="relative">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <EnhancedVideo 
                      src={viz.video}
                      className="w-full h-full"
                      onError={(e) => {
                        console.error(`Failed to load video: ${viz.video}`)
                        // Don't block the UI, just log the error
                      }}
                    />
                  </div>
                  {viz.id !== '3' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-foreground">Before → After</Badge>
                    </div>
                  )}
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
          visualizationRequests: []
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
          value={workspaceTab}
          onValueChange={setWorkspaceTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Specific Item</TabsTrigger>
            <TabsTrigger value="style">Style Brainstorm</TabsTrigger>
          </TabsList>
          
          
          {/* Specific Item Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Submit Specific Item Request
                </CardTitle>
                <CardDescription>
                  Upload your room photo and describe the specific item you want to add. We'll create a professional visualization and email it to you within 3-5 business days.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Room Photo Upload */}
                <div className="space-y-2">
                  <Label>Room Photo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                    onClick={triggerFileUpload}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-accent transition-colors" />
                    <p className="font-medium mb-1">Upload room photo</p>
                    <p className="text-sm text-muted-foreground">Drop image or click to browse</p>
                  </div>
                  
                  {uploadedImage && (
                    <div className="mt-4">
                      <div className="aspect-video bg-muted rounded-lg relative overflow-hidden max-w-md">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded room" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-green-500/90 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Photo uploaded
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <ItemDescriptionInput />
                <EmailInput />
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!uploadedImage || !itemDescription.trim() || !customerEmail.trim() || isSubmitting}
                  onClick={() => submitVisualizationRequest('specific-item')}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting Request...' : 'Submit Visualization Request'}
                </Button>
                
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-medium">What happens next?</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Our design team will review your request</li>
                    <li>• Professional visualization created within 3-5 business days</li>
                    <li>• High-resolution images emailed directly to you</li>
                    <li>• You'll receive 2-3 different design variations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Style Brainstorm Tab */}
          <TabsContent value="style" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Submit Style Brainstorm Request
                </CardTitle>
                <CardDescription>
                  Upload your room photo and describe your desired style. Our designers will create a complete room transformation and email it to you within 3-5 business days.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Room Photo Upload */}
                <div className="space-y-2">
                  <Label>Room Photo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                    onClick={triggerFileUpload}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-accent transition-colors" />
                    <p className="font-medium mb-1">Upload room photo</p>
                    <p className="text-sm text-muted-foreground">Drop image or click to browse</p>
                  </div>
                  
                  {uploadedImage && (
                    <div className="mt-4">
                      <div className="aspect-video bg-muted rounded-lg relative overflow-hidden max-w-md">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded room" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-green-500/90 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Photo uploaded
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <StyleDescriptionInput />
                
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
                
                <EmailInput />
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!uploadedImage || !styleDescription.trim() || !customerEmail.trim() || isSubmitting}
                  onClick={() => submitVisualizationRequest('style-brainstorm')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting Request...' : 'Submit Style Request'}
                </Button>
                
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-medium">What happens next?</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Our design experts will analyze your space and style preferences</li>
                    <li>• Complete room transformation created within 3-5 business days</li>
                    <li>• Multiple design concepts emailed directly to you</li>
                    <li>• Detailed style breakdown and product recommendations included</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Request History */}
          {selectedProject && selectedProject.visualizationRequests.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>
                  Track the status of your visualization requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedProject.visualizationRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {request.type === 'specific-item' ? 'Specific Item' : 'Style Brainstorm'}
                          </Badge>
                          <Badge 
                            variant={request.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">
                          {request.description.substring(0, 100)}...
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Submitted: {new Date(request.createdAt).toLocaleDateString()} • 
                          Estimated delivery: {request.estimatedDelivery}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === 'completed' && (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Delivered
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
    const galleryItems = useMemo(() => {
      const builtInItems = [
        {
          id: '1',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: modernLivingRoomVideo,
          title: 'Modern Living Room Transformation',
          description: 'A complete makeover featuring contemporary furniture and warm lighting',
          style: 'Modern Minimalist',
          room: 'Living Room',
          keyFeatures: ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines']
        },
        {
          id: '2',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: cozyBedroomVideo,
          title: 'Scandinavian Bedroom Retreat',
          description: 'Cozy bedroom design with natural textures and clean lines',
          style: 'Scandinavian',
          room: 'Bedroom',
          keyFeatures: ['Natural Textures', 'Hygge Vibes', 'Light Woods', 'Minimal Clutter']
        },
        {
          id: '3',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: kitchenPanVideo,
          title: 'Minimalist Kitchen Design',
          description: 'Clean, functional kitchen featuring sleek lines and modern appliances',
          style: 'Modern Minimalist',
          room: 'Kitchen',
          keyFeatures: ['Clean Lines', 'Modern Appliances', 'Minimal Clutter', 'Functional Design']
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
          keyFeatures: ['Mixed Patterns', 'Vibrant Colors', 'Vintage Pieces', 'Global Textiles']
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
          keyFeatures: ['Vintage Style', 'Rich Woods', 'Geometric Patterns', 'Bold Colors']
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
          keyFeatures: ['Rustic Woods', 'Neutral Tones', 'Vintage Accents', 'Cozy Textiles']
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
          keyFeatures: ['Clean Lines', 'Neutral Palette', 'Quality Materials', 'Functional Design']
        },
        {
          id: '8',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: '/api/placeholder/800/600/video',
          title: 'Industrial Kitchen Renovation',
          description: 'Bold kitchen featuring exposed elements and modern appliances',
          style: 'Industrial',
          room: 'Kitchen',
          keyFeatures: ['Exposed Brick', 'Metal Accents', 'Open Shelving', 'Dark Palette']
        },
        {
          id: '9',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: '/api/placeholder/800/600/video',
          title: 'Rustic Farmhouse Kitchen',
          description: 'Farmhouse elements meet modern functionality',
          style: 'Farmhouse',
          room: 'Kitchen',
          keyFeatures: ['Shaker Cabinets', 'Butcher Block', 'Vintage Hardware', 'Subway Tile']
        },
        {
          id: '10',
          before: '/api/placeholder/400/300',
          after: '/api/placeholder/400/300',
          video: '/api/placeholder/800/600/video',
          title: 'Contemporary Dining Space',
          description: 'Sleek design perfect for entertaining guests',
          style: 'Modern Minimalist',
          room: 'Dining Room',
          keyFeatures: ['Sleek Design', 'Statement Lighting', 'Quality Materials', 'Entertainment Ready']
        }
      ]

      // Combine built-in items with user-uploaded videos
      const userVideos = galleryVideos || []
      return [...builtInItems, ...userVideos]
    }, [galleryVideos])

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
              filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    {/* Video/Image Display */}
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <EnhancedVideo 
                        src={item.video}
                        className="w-full h-full"
                        onError={(e) => {
                          console.error(`Failed to load gallery video: ${item.video}`, e)
                          // The EnhancedVideo component already handles the error display
                        }}
                      />
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
                        <span>{item.id === '3' ? 'Featured Design' : 'Featured'}</span>
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
          <DialogContent className="max-w-[98vw] w-[98vw] h-[95vh] p-0 overflow-hidden">
            {selectedTransformation && (
              <div className="flex flex-col h-full bg-background">
                {/* Modal Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border-b bg-card">
                  <div className="mb-4 lg:mb-0">
                    <DialogTitle className="text-2xl font-bold text-card-foreground">
                      {selectedTransformation.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2 text-muted-foreground">
                      {selectedTransformation.description}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="secondary">{selectedTransformation.room}</Badge>
                    <Badge variant="outline">{selectedTransformation.style}</Badge>
                  </div>
                </div>

                {/* Comparison Controls */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-6 py-4 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Comparison Mode:</span>
                    <div className="flex rounded-lg border bg-background p-1">
                      <Button
                        size="sm"
                        variant={comparisonMode === 'split' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('split')}
                        className="rounded-md px-3 h-7 text-xs"
                      >
                        Split View
                      </Button>
                      <Button
                        size="sm"
                        variant={comparisonMode === 'slide' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('slide')}
                        className="rounded-md px-3 h-7 text-xs"
                      >
                        Slider
                      </Button>
                      <Button
                        size="sm"
                        variant={comparisonMode === 'toggle' ? 'default' : 'ghost'}
                        onClick={() => setComparisonMode('toggle')}
                        className="rounded-md px-3 h-7 text-xs"
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
                  </div>
                </div>

                {/* Main Comparison Area */}
                <div className="flex-1 overflow-hidden">
                  <div className="grid lg:grid-cols-5 gap-0 h-full">
                    {/* Before/After Comparison - Now takes up more space */}
                    <div className="lg:col-span-3 border-r border-border">
                      <div className="h-full bg-card relative overflow-hidden">
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

                    {/* Details Sidebar - Now more compact */}
                    <div className="lg:col-span-2 overflow-y-auto bg-background">
                      <div className="p-6 space-y-6">
                        {/* Transformation Details */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Transformation Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Room Type</Label>
                              <p className="font-medium text-sm mt-1">{selectedTransformation.room}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Design Style</Label>
                              <p className="font-medium text-sm mt-1">{selectedTransformation.style}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</Label>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {(selectedTransformation.keyFeatures || ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines']).map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs px-2 py-1">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Featured Items */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Design Elements</CardTitle>
                            <CardDescription className="text-xs">
                              Key design features in this transformation
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {(selectedTransformation.keyFeatures || ['Modern Furniture', 'Natural Light', 'Neutral Palette', 'Clean Lines']).map((feature, index) => (
                                <div key={index} className="flex items-center p-2 border rounded-md bg-muted/30">
                                  <div className="w-6 h-6 bg-accent/20 rounded-sm mr-3 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-accent" />
                                  </div>
                                  <p className="text-sm font-medium">{feature}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Get Inspired */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Get Inspired</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full" variant="outline">
                              Save Inspiration
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CTA Section */}
        <div className="bg-accent text-accent-foreground rounded-lg p-8 text-center mt-20">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-4">Ready for Professional Design Service?</h3>
            <p className="text-xl mb-8 opacity-90">
              Submit your room photos and get custom visualizations delivered within 3-5 business days
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setCurrentView('dashboard')}
            >
              Submit Your Project
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
              We provide professional interior design visualization services powered by AI technology. 
              Submit your room photos and design preferences, and receive custom visualizations 
              delivered directly to your email within 3-5 business days.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Professional Design Team</h3>
              <p className="text-muted-foreground">
                Our experienced interior designers use advanced AI tools to create 
                realistic, contextual design solutions tailored to your space and preferences.
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
                <Download className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Email Delivery Service</h3>
              <p className="text-muted-foreground">
                Receive high-quality visualizations delivered directly to your email 
                within 3-5 business days, including multiple design variations and recommendations.
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
                    Upload your room photo and submit your request. Our design team will 
                    analyze the space and lighting to understand your room's potential.
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
                    Describe your vision in natural language or upload specific furniture photos. 
                    Our professional designers will interpret your preferences and style goals.
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
                    <h3 className="text-xl font-bold">Receive Professional Results</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Within 3-5 business days, receive professional-quality visualizations 
                    delivered directly to your email with detailed design recommendations.
                  </p>
                </div>
                <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Download className="w-12 h-12 text-muted-foreground" />
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

  // Admin Page Component for managing gallery videos
  const AdminPage = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [uploadForm, setUploadForm] = useState({
      title: '',
      description: '',
      style: '',
      room: '',
      keyFeatures: ''
    })
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [videoStatus, setVideoStatus] = useState<Record<string, boolean>>({})
    
    const videoInputRef = React.useRef<HTMLInputElement>(null)

    // Check video availability on admin page load
    React.useEffect(() => {
      const checkVideos = async () => {
        const videos = [
          { name: 'Modern Living Room', path: modernLivingRoomVideo },
          { name: 'Cozy Bedroom', path: cozyBedroomVideo },
          { name: 'Kitchen Design', path: kitchenPanVideo }
        ]
        
        const status: Record<string, boolean> = {}
        
        for (const video of videos) {
          const isAvailable = await verifyVideoPath(video.path)
          status[video.name] = isAvailable
        }
        
        setVideoStatus(status)
      }
      
      checkVideos()
    }, [])

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && isVideoFile(file)) {
        setVideoFile(file)
        toast.success('Video selected successfully!')
      } else {
        toast.error('Please select a video file (.mp4, .mov, .avi, .mkv, .webm).')
      }
    }

    // Helper function to check if file is a video
    const isVideoFile = (file: File) => {
      const videoTypes = [
        'video/mp4',
        'video/quicktime', // .mov files
        'video/x-msvideo', // .avi files
        'video/x-matroska', // .mkv files
        'video/webm',
        'video/ogg'
      ]
      
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.ogg']
      
      // Check MIME type first
      if (file.type && videoTypes.includes(file.type)) {
        return true
      }
      
      // Fallback to file extension check (for .mov files that sometimes have incorrect MIME types)
      const fileName = file.name.toLowerCase()
      return videoExtensions.some(ext => fileName.endsWith(ext))
    }

    const triggerVideoUpload = () => {
      videoInputRef.current?.click()
    }

    // Drag and drop handlers for video upload
    const handleVideoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleVideoDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleVideoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      
      const files = e.dataTransfer.files
      if (files && files[0]) {
        const file = files[0]
        if (isVideoFile(file)) {
          setVideoFile(file)
          toast.success('Video uploaded successfully!')
        } else {
          toast.error('Please upload a video file (.mp4, .mov, .avi, .mkv, .webm).')
        }
      }
    }

    const handleSubmitVideo = async () => {
      if (!videoFile || !uploadForm.title.trim()) {
        toast.error('Please select a video and provide a title.')
        return
      }

      setIsUploading(true)
      
      try {
        // Create a data URL for the video (in a real app, you'd upload to a server)
        const reader = new FileReader()
        reader.onload = (e) => {
          const videoURL = e.target?.result as string
          
          const newVideo = {
            id: Date.now().toString(),
            before: '/api/placeholder/400/300',
            after: '/api/placeholder/400/300',
            video: videoURL,
            title: uploadForm.title,
            description: uploadForm.description,
            style: uploadForm.style || 'Modern Minimalist',
            room: uploadForm.room || 'Living Room',
            keyFeatures: uploadForm.keyFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0)
          }

          setGalleryVideos(current => [...(current || []), newVideo])
          
          // Reset form
          setUploadForm({
            title: '',
            description: '',
            style: '',
            room: '',
            keyFeatures: ''
          })
          setVideoFile(null)
          setIsUploadOpen(false)
          
          toast.success('Video added to gallery successfully!')
        }
        reader.readAsDataURL(videoFile)
        
      } catch (error) {
        toast.error('Failed to upload video. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }

    const handleDeleteVideo = (videoId: string) => {
      setGalleryVideos(current => (current || []).filter(v => v.id !== videoId))
      toast.success('Video removed from gallery.')
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
                <p className="text-muted-foreground">Upload and manage transformation videos for your gallery</p>
              </div>
              <Button onClick={() => setIsUploadOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>

            {/* Video Status Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Built-in Video Status
                </CardTitle>
                <CardDescription>
                  Check if the main gallery videos are loading correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(videoStatus).map(([name, isAvailable]) => (
                    <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        {isAvailable ? (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="w-3 h-3 mr-1" />
                            Not Found
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Video Troubleshooting:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Videos should be in <code>/public/videos/</code> directory</li>
                    <li>• Check exact filename spelling and capitalization</li>
                    <li>• Visit <a href="/video-test.html" target="_blank" className="text-accent hover:underline">/video-test.html</a> for detailed testing</li>
                    <li>• Ensure videos are deployed with your application</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Current Videos */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Current Gallery Videos</h2>
              
              {galleryVideos && galleryVideos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <EnhancedVideo 
                          src={video.video}
                          className="w-full h-full"
                          controls={true}
                          autoPlay={false}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">{video.room}</Badge>
                            <Badge variant="outline" className="text-xs">{video.style}</Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">No videos uploaded yet</h3>
                    <p className="text-muted-foreground mb-4">Upload your first transformation video to get started.</p>
                    <Button onClick={() => setIsUploadOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Video
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Gallery Video</DialogTitle>
              <DialogDescription>
                Upload a transformation video and provide details for the gallery.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Transformation Video</Label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept=".mp4,.mov,.avi,.mkv,.webm,.ogg,video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                  onClick={triggerVideoUpload}
                  onDragOver={handleVideoDragOver}
                  onDragEnter={handleVideoDragEnter}
                  onDragLeave={handleVideoDragLeave}
                  onDrop={handleVideoDrop}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-accent transition-colors" />
                  <p className="font-medium mb-1">
                    {videoFile ? videoFile.name : 'Upload transformation video'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {videoFile ? 'Click to change video' : 'Click to browse or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: MP4, MOV, AVI, MKV, WebM
                  </p>
                </div>
              </div>
              
              {/* Video Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Modern Living Room Transformation"
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-room">Room Type</Label>
                  <Input
                    id="video-room"
                    value={uploadForm.room}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., Living Room"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the transformation shown in this video..."
                  rows={3}
                  autoComplete="off"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-style">Design Style</Label>
                  <Input
                    id="video-style"
                    value={uploadForm.style}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, style: e.target.value }))}
                    placeholder="e.g., Modern Minimalist"
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-features">Key Features</Label>
                  <Input
                    id="video-features"
                    value={uploadForm.keyFeatures}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, keyFeatures: e.target.value }))}
                    placeholder="e.g., Natural Light, Modern Furniture"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">Separate features with commas</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitVideo} 
                disabled={!videoFile || !uploadForm.title.trim() || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add to Gallery'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    )
  }

  // Render current view
  if (currentView === 'landing') return <LandingPage />
  if (currentView === 'dashboard') return <ProjectDashboard />
  if (currentView === 'workspace') return <VisualizationWorkspace />
  if (currentView === 'gallery') return <GalleryPage />
  if (currentView === 'about') return <AboutPage />
  
  return <LandingPage />
}

export default App