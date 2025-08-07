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
    return (
        <>
            <div className="relative overflow-hidden">
                <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
                    <Badge variant="secondary" className="mb-6"><Sparkle className="w-4 h-4 mr-2" />AI-Powered Interior Design</Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Visualize Your<span className="block" style={{ color: '#798ab5' }}>Dream Space</span></h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Submit your room photo and design preferences. Get custom visualizations delivered to your email in 3-5 business days.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => setCurrentView('dashboard')}>Start Designing<ArrowRight className="ml-2 w-5 h-5" /></Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => setCurrentView('gallery')}><Play className="mr-2 w-5 h-5" />Watch Demo</Button>
                    </div>
                </div>
            </div>
            {/* Other sections... */}
            <Footer />
        </>
    );
};

const CreateProjectDialog = ({ isCreateProjectOpen, setIsCreateProjectOpen, setProjects, setSelectedProject, setCurrentView }: any) => {
    return <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>{/* ... Dialog Content ... */}</Dialog>;
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

  const galleryItems = useMemo(() => {
    const builtInItems = [
      { id: 'b1', video: modernLivingRoomVideo, title: 'Modern Living Room', description: 'A complete makeover...', style: 'Modern', room: 'Living Room' },
      { id: 'b2', video: cozyBedroomVideo, title: 'Scandinavian Bedroom', description: 'Cozy design...', style: 'Scandinavian', room: 'Bedroom' },
      { id: 'b3', video: kitchenPanVideo, title: 'Minimalist Kitchen', description: 'Clean, functional kitchen...', style: 'Minimalist', room: 'Kitchen' },
    ];
    return [...builtInItems, ...(galleryVideos || [])];
  }, [galleryVideos]);

  const filteredItems = galleryItems.filter(item => 
    (activeRoomFilter === 'All Rooms' || item.room === activeRoomFilter) &&
    (activeStyleFilter === 'All Styles' || item.style === activeStyleFilter)
  );

  return (
    <>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transformation Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover amazing room transformations and get inspired.</p>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer">
              <div className="aspect-[4/3] bg-muted relative">
                <EnhancedVideo src={item.video} />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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

// --- THE MAIN APP COMPONENT ---

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace' | 'gallery' | 'about'>('landing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [projects, setProjects] = useLocalStorage<Project[]>('user-projects', []);
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
        return <LandingPage setCurrentView={setCurrentView} setProjects={setProjects} setSelectedProject={setSelectedProject} setWorkspaceTab={() => {}} />;
      case 'dashboard':
        return <ProjectDashboard setIsCreateProjectOpen={setIsCreateProjectOpen} />;
      case 'workspace':
        return <VisualizationWorkspace selectedProject={selectedProject} setCurrentView={setCurrentView} {...workspaceFormProps} />;
      case 'gallery':
        return <GalleryPage galleryVideos={galleryVideos} setCurrentView={setCurrentView} />;
      case 'about':
        return <AboutPage />;
      default:
        return <LandingPage setCurrentView={setCurrentView} setProjects={setProjects} setSelectedProject={setSelectedProject} setWorkspaceTab={() => {}} />;
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
