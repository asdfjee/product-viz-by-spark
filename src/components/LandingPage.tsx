import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Play, Camera, MagicWand, Download, Star } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import MediaLibraryButton from '@/components/MediaLibraryButton'

const EnhancedVideo = ({ src, className = "", ...props }: { src: string, className?: string, [key: string]: any }) => {
  const [hasError, setHasError] = React.useState(false);
  React.useEffect(() => { setHasError(false); }, [src]);
  const handleError = () => { console.error(`Video failed to load: ${src}`); setHasError(true); };

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 text-muted-foreground mx-auto mb-2">📹</div>
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

const modernLivingRoomVideo = '/videos/modern-living-room-transformation.mp4'
const cozyBedroomVideo = '/videos/Cozy_Room_Transformation_Video_(1).mp4'
const kitchenPanVideo = '/videos/Kitchen_Pan_Video_Generation.mp4'

const featuredVisualizationsData = [
  { id: '1', video: modernLivingRoomVideo, description: 'Modern living room transformation' },
  { id: '2', video: cozyBedroomVideo, description: 'Cozy bedroom makeover' },
  { id: '3', video: kitchenPanVideo, description: 'Minimalist kitchen design' }
];

export const LandingPage = () => {  
  const navigate = useNavigate();
  
  const handleMediaSelected = (url: string) => {
    console.log('Media selected:', url)
    // Optional: You could do something with the selected media here
    // For demo purposes, we just log it
  }
  
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              <span className="mr-2">✨</span>AI-Powered Interior Design
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Visualize Your<span className="block" style={{ color: '#798ab5' }}>Dream Space</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Submit your room photo and design preferences to our professional team. Get custom visualizations delivered to your email within 3-5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => navigate('/dashboard')}>
                Start Designing<ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" onClick={() => navigate('/gallery')}>
                <Play className="mr-2 w-5 h-5" />Watch Demo
              </Button>
              <MediaLibraryButton 
                onMediaSelected={handleMediaSelected}
                variant="ghost"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              />
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
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => navigate('/dashboard')}>
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Camera className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Upload Your Room</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Upload your room photo and let our professional design team analyze the space and create custom visualizations.</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">Start Upload →</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => navigate('/dashboard')}>
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <MagicWand className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Describe Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Describe your vision or upload specific furniture. Our design team will create professional visualizations and email them to you.</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">Describe Now →</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group" onClick={() => navigate('/gallery')}>
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Download className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Receive Your Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Receive professional-quality visualizations and purchase recommendations delivered to your email within 3-5 business days.</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm">Receive Results →</Button>
              </div>
            </CardContent>
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
              <Card key={viz.id} className="overflow-hidden border-0 shadow-lg group cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate('/gallery')}>
                <div className="relative">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <EnhancedVideo src={viz.video} className="w-full h-full"/>
                  </div>
                  {viz.id !== '3' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-foreground">Before → After</Badge>
                    </div>
                  )}
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
    </>
  );
};