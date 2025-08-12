import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { galleryAPI, GalleryProject } from '@/lib/supabase'

const EnhancedVideo = ({ src, className = "", ...props }: { src: string, className?: string, [key: string]: any }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);
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

// Fallback data for when Supabase is not available or has no data
const fallbackGalleryItems = [
  { 
    id: 'b1', 
    video_url: '/videos/modern-living-room-transformation.mp4', 
    title: 'Modern Living Room', 
    description: 'A complete makeover with contemporary furniture and clean lines', 
    style_type: 'Modern', 
    room_type: 'Living Room',
    featured: true
  },
  { 
    id: 'b2', 
    video_url: '/videos/Cozy_Room_Transformation_Video_(1).mp4', 
    title: 'Scandinavian Bedroom', 
    description: 'Cozy design with natural textures and warm lighting', 
    style_type: 'Scandinavian', 
    room_type: 'Bedroom',
    featured: false
  },
  { 
    id: 'b3', 
    video_url: '/videos/Kitchen_Pan_Video_Generation.mp4', 
    title: 'Minimalist Kitchen', 
    description: 'Clean, functional kitchen design with minimal clutter', 
    style_type: 'Minimalist', 
    room_type: 'Kitchen',
    featured: false
  },
  // Industrial style transformations
  { 
    id: 'b4', 
    video_url: '/videos/industrial-loft-transformation.mp4', 
    title: 'Industrial Loft Living Room', 
    description: 'Raw materials, exposed brick, and metal fixtures create an urban industrial aesthetic', 
    style_type: 'Industrial', 
    room_type: 'Living Room',
    featured: true
  },
  { 
    id: 'b5', 
    video_url: '/videos/industrial-office-transformation.mp4', 
    title: 'Industrial Office Workspace', 
    description: 'Functional workspace with industrial pipes, concrete surfaces, and vintage lighting', 
    style_type: 'Industrial', 
    room_type: 'Office',
    featured: false
  },
  // Bohemian/Boho transformations
  { 
    id: 'b6', 
    video_url: '/videos/boho-bedroom-transformation.mp4', 
    title: 'Bohemian Bedroom Retreat', 
    description: 'Eclectic mix of patterns, textures, and warm earth tones for a free-spirited sanctuary', 
    style_type: 'Bohemian', 
    room_type: 'Bedroom',
    featured: false
  },
  { 
    id: 'b7', 
    video_url: '/videos/boho-living-room-transformation.mp4', 
    title: 'Boho Living Room', 
    description: 'Layered textiles, vintage furniture, and plants create a relaxed bohemian atmosphere', 
    style_type: 'Bohemian', 
    room_type: 'Living Room',
    featured: false
  },
  // Traditional/Classic styles
  { 
    id: 'b8', 
    video_url: '/videos/classic-dining-room-transformation.mp4', 
    title: 'Classic Dining Room', 
    description: 'Elegant traditional design with rich wood finishes and timeless furnishings', 
    style_type: 'Traditional', 
    room_type: 'Dining Room',
    featured: false
  },
  { 
    id: 'b9', 
    video_url: '/videos/traditional-bathroom-transformation.mp4', 
    title: 'Traditional Bathroom', 
    description: 'Classic bathroom with marble surfaces, vintage fixtures, and sophisticated details', 
    style_type: 'Traditional', 
    room_type: 'Bathroom',
    featured: false
  },
  // Contemporary transformations
  { 
    id: 'b10', 
    video_url: '/videos/contemporary-kitchen-transformation.mp4', 
    title: 'Contemporary Kitchen', 
    description: 'Sleek modern design with high-end appliances and innovative storage solutions', 
    style_type: 'Contemporary', 
    room_type: 'Kitchen',
    featured: true
  },
  { 
    id: 'b11', 
    video_url: '/videos/contemporary-office-transformation.mp4', 
    title: 'Contemporary Home Office', 
    description: 'Modern workspace with clean lines, smart technology integration, and ergonomic design', 
    style_type: 'Contemporary', 
    room_type: 'Office',
    featured: false
  },
  // Rustic/Farmhouse styles
  { 
    id: 'b12', 
    video_url: '/videos/rustic-dining-room-transformation.mp4', 
    title: 'Rustic Dining Room', 
    description: 'Warm farmhouse style with reclaimed wood, vintage decor, and cozy country charm', 
    style_type: 'Rustic', 
    room_type: 'Dining Room',
    featured: false
  },
  { 
    id: 'b13', 
    video_url: '/videos/farmhouse-kitchen-transformation.mp4', 
    title: 'Farmhouse Kitchen', 
    description: 'Country kitchen with shiplap walls, apron sink, and rustic wooden accents', 
    style_type: 'Rustic', 
    room_type: 'Kitchen',
    featured: false
  },
  { 
    id: 'b14', 
    video_url: '/videos/rustic-bathroom-transformation.mp4', 
    title: 'Rustic Bathroom', 
    description: 'Spa-like retreat with natural stone, wood beams, and vintage farmhouse fixtures', 
    style_type: 'Rustic', 
    room_type: 'Bathroom',
    featured: false
  },
];

interface GalleryPageProps {
  galleryVideos?: any[]
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleryVideos = [] }) => {
  const [activeRoomFilter, setActiveRoomFilter] = useState('All Rooms');
  const [activeStyleFilter, setActiveStyleFilter] = useState('All Styles');
  const [supabaseItems, setSupabaseItems] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load gallery items from Supabase on component mount
  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await galleryAPI.getAll();
        setSupabaseItems(items);
      } catch (err) {
        console.error('Failed to load gallery items from Supabase:', err);
        setError('Failed to load gallery items');
        // Use fallback data when Supabase fails
        setSupabaseItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  const galleryItems = useMemo(() => {
    // Combine Supabase items with fallback items and local storage items
    const combined = [
      ...fallbackGalleryItems,
      ...supabaseItems.map(item => ({
        id: item.id,
        video_url: item.video_url,
        title: item.title,
        description: item.description,
        style_type: item.style_type,
        room_type: item.room_type,
        featured: item.featured
      })),
      ...(galleryVideos || [])
    ];
    
    // Remove duplicates based on video_url
    const unique = combined.filter((item, index, self) => 
      index === self.findIndex(t => t.video_url === item.video_url)
    );
    
    return unique;
  }, [supabaseItems, galleryVideos]);

  const filteredItems = galleryItems.filter(item => 
    (activeRoomFilter === 'All Rooms' || item.room_type === activeRoomFilter) &&
    (activeStyleFilter === 'All Styles' || item.style_type === activeStyleFilter)
  );

  const roomTypes = ['All Rooms', ...Array.from(new Set(galleryItems.map(item => item.room_type).filter(Boolean)))];
  const styleTypes = ['All Styles', ...Array.from(new Set(galleryItems.map(item => item.style_type).filter(Boolean)))];

  return (
    <>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transformation Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover amazing room transformations and get inspired.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {roomTypes.map(room => (
              <Button
                key={room}
                variant={activeRoomFilter === room ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveRoomFilter(room)}
              >
                {room}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {styleTypes.map(style => (
              <Button
                key={style}
                variant={activeStyleFilter === style ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveStyleFilter(style)}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading gallery items...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 mb-8">
            <Badge variant="destructive">{error}</Badge>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer">
              <div className="aspect-[4/3] bg-muted relative">
                <EnhancedVideo src={item.video_url} />
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.room_type && (
                    <Badge variant="secondary" className="text-xs">{item.room_type}</Badge>
                  )}
                  {item.style_type && (
                    <Badge variant="outline" className="text-xs">{item.style_type}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery items match your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};