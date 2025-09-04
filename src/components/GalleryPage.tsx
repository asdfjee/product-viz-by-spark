import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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

// TransformationModal Component
interface TransformationModalProps {
  transformation: TransformationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransformationModal: React.FC<TransformationModalProps> = ({ transformation, isOpen, onClose }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  if (!transformation) return null;

  const allMedia = [
    { type: 'video' as const, url: transformation.video_url, caption: 'Main transformation video' },
    ...(transformation.additional_media || [])
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold">
                {transformation.title}
              </DialogTitle>
              <div className="flex gap-2 mt-2">
                {transformation.room_type && (
                  <Badge variant="secondary">{transformation.room_type}</Badge>
                )}
                {transformation.style_type && (
                  <Badge variant="outline">{transformation.style_type}</Badge>
                )}
                {transformation.featured && (
                  <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                )}
              </div>
            </DialogHeader>

            {/* Main Media Section */}
            <div className="mb-8">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {allMedia[activeMediaIndex]?.type === 'video' ? (
                  <EnhancedVideo 
                    src={allMedia[activeMediaIndex].url} 
                    className="w-full h-full"
                  />
                ) : (
                  <img 
                    src={allMedia[activeMediaIndex]?.url} 
                    alt={allMedia[activeMediaIndex]?.caption}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Media Navigation */}
              {allMedia.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeMediaIndex === index 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <div className="text-xs">▶️</div>
                        </div>
                      ) : (
                        <img 
                          src={media.url} 
                          alt={media.caption}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Media Caption */}
              {allMedia[activeMediaIndex]?.caption && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  {allMedia[activeMediaIndex].caption}
                </p>
              )}
            </div>

            {/* Before/After Section */}
            {transformation.before_after && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Before</h4>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={transformation.before_after.before_url}
                        alt="Before transformation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">After</h4>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={transformation.before_after.after_url}
                        alt="After transformation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {transformation.before_after.description}
                </p>
                <Separator className="mt-6" />
              </div>
            )}

            {/* Detailed Description */}
            {transformation.detailed_description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About This Transformation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {transformation.detailed_description}
                </p>
                <Separator className="mt-6" />
              </div>
            )}

            {/* Process Description */}
            {transformation.process_description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Design Process</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {transformation.process_description}
                </p>
                <Separator className="mt-6" />
              </div>
            )}

            {/* Style Characteristics */}
            {transformation.style_characteristics && transformation.style_characteristics.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Style Characteristics</h3>
                <ul className="space-y-2">
                  {transformation.style_characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{characteristic}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="mt-6" />
              </div>
            )}

            {/* Room Specifications */}
            {transformation.room_specifications && transformation.room_specifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Room Specifications</h3>
                <ul className="space-y-2">
                  {transformation.room_specifications.map((spec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced transformation interface
interface TransformationItem {
  id: string;
  video_url: string;
  title: string;
  description: string;
  style_type: string;
  room_type: string;
  featured: boolean;
  detailed_description?: string;
  process_description?: string;
  style_characteristics?: string[];
  room_specifications?: string[];
  additional_media?: Array<{
    type: 'image' | 'video';
    url: string;
    caption: string;
  }>;
  before_after?: {
    before_url: string;
    after_url: string;
    description: string;
  };
}

// Fallback data for when Supabase is not available or has no data
const fallbackGalleryItems: TransformationItem[] = [
  { 
    id: 'b1', 
    video_url: '/videos/modern-living-room-transformation.mp4', 
    title: 'Modern Living Room', 
    description: 'A complete makeover with contemporary furniture and clean lines', 
    style_type: 'Modern', 
    room_type: 'Living Room',
    featured: true,
    detailed_description: 'This stunning modern living room transformation showcases the power of minimalist design principles combined with functional elegance. The space features clean geometric lines, a neutral color palette with strategic accent colors, and carefully curated furnishings that emphasize both form and function. The design philosophy centers around creating an uncluttered environment that promotes relaxation while maintaining visual interest through texture and subtle contrasts.',
    process_description: 'The transformation began with a complete room redesign, removing outdated furniture and dated color schemes. We focused on creating an open, airy feel by selecting low-profile furniture pieces and implementing a monochromatic base with warm wood accents. The lighting design incorporates both ambient and task lighting to create depth and warmth throughout different times of day.',
    style_characteristics: [
      'Clean geometric lines and minimal ornamentation',
      'Neutral color palette with strategic accent colors',
      'Mix of natural materials (wood, stone, metal)',
      'Low-profile, functional furniture pieces',
      'Emphasis on negative space and visual breathing room',
      'Strategic use of texture for visual interest'
    ],
    room_specifications: [
      'LED recessed lighting with dimmer controls',
      'Hardwood flooring with area rug definition',
      'Floor-to-ceiling windows maximizing natural light',
      'Built-in storage solutions to maintain clean lines',
      'Smart home integration for lighting and temperature',
      'Professional color consultation for optimal palette'
    ],
    additional_media: [
      {
        type: 'image',
        url: '/images/modern-living-detail-1.jpg',
        caption: 'Close-up view of the custom-built entertainment center with hidden cable management'
      },
      {
        type: 'image', 
        url: '/images/modern-living-detail-2.jpg',
        caption: 'Texture details showing the interplay between smooth and textured surfaces'
      },
      {
        type: 'video',
        url: '/videos/modern-living-walkthrough.mp4',
        caption: 'Complete walkthrough showcasing the transformed space from multiple angles'
      }
    ]
  },
  { 
    id: 'b2', 
    video_url: '/videos/Cozy_Room_Transformation_Video_(1).mp4', 
    title: 'Scandinavian Bedroom', 
    description: 'Cozy design with natural textures and warm lighting', 
    style_type: 'Scandinavian', 
    room_type: 'Bedroom',
    featured: false,
    detailed_description: 'This serene Scandinavian bedroom embodies the concept of "hygge" - creating a cozy, comfortable atmosphere that promotes well-being and contentment. The design focuses on natural materials, soft textures, and a calming color palette that encourages rest and relaxation. Every element has been carefully chosen to create a harmonious balance between simplicity and warmth.',
    process_description: 'The transformation emphasized natural light optimization and the introduction of organic textures. We selected furniture with clean lines but warm wood tones, incorporated layers of soft textiles, and created a reading nook that encourages relaxation. The color scheme was kept intentionally muted to promote tranquility.',
    style_characteristics: [
      'Light wood furniture with natural grain patterns',
      'Soft, muted color palette (whites, grays, natural tones)',
      'Layered textiles for warmth and comfort',
      'Emphasis on natural light and minimal window treatments',
      'Functional design with hidden storage solutions',
      'Incorporation of natural elements and plants'
    ],
    room_specifications: [
      'Blackout curtains for optimal sleep environment',
      'Adjustable bedside lighting for reading',
      'Natural fiber rugs and organic cotton bedding',
      'Built-in storage bench with soft cushioning',
      'Temperature-controlled environment with smart thermostat',
      'Air-purifying plants for improved sleep quality'
    ],
    additional_media: [
      {
        type: 'image',
        url: '/images/scandi-bedroom-detail-1.jpg',
        caption: 'Natural wood nightstand with integrated charging station and soft ambient lighting'
      },
      {
        type: 'image',
        url: '/images/scandi-bedroom-detail-2.jpg',
        caption: 'Cozy reading corner with layered textiles and natural light'
      }
    ]
  },
  { 
    id: 'b3', 
    video_url: '/videos/Kitchen_Pan_Video_Generation.mp4', 
    title: 'Minimalist Kitchen', 
    description: 'Clean, functional kitchen design with minimal clutter', 
    style_type: 'Minimalist', 
    room_type: 'Kitchen',
    featured: false,
    detailed_description: 'This minimalist kitchen transformation demonstrates how less truly can be more. By eliminating visual clutter and focusing on essential functions, we created a space that is both highly functional and visually serene. The design philosophy centers around the idea that every element should serve a purpose while contributing to the overall aesthetic harmony.',
    process_description: 'The renovation involved removing upper cabinets to create an open, airy feel, implementing hidden storage solutions, and selecting appliances that blend seamlessly with the cabinetry. We focused on creating clean sight lines and ensuring that every surface can be easily maintained.',
    style_characteristics: [
      'Handleless cabinetry with push-to-open mechanisms',
      'Monochromatic color scheme with subtle variations',
      'Hidden storage solutions to maintain clean lines',
      'Integrated appliances for seamless appearance',
      'Minimal decorative elements with maximum impact',
      'High-quality materials with superior craftsmanship'
    ],
    room_specifications: [
      'Quartz countertops with integrated sink',
      'LED strip lighting under cabinets and in toe kicks',
      'Soft-close drawers and cabinet doors',
      'Hidden range hood integrated into cabinetry',
      'Smart appliances with touch controls',
      'Easy-to-clean surfaces throughout'
    ]
  },
  // Industrial style transformations
  { 
    id: 'b4', 
    video_url: '/videos/industrial-loft-transformation.mp4', 
    title: 'Industrial Loft Living Room', 
    description: 'Raw materials, exposed brick, and metal fixtures create an urban industrial aesthetic', 
    style_type: 'Industrial', 
    room_type: 'Living Room',
    featured: true,
    detailed_description: 'This industrial loft transformation celebrates the raw beauty of urban architecture while creating a comfortable, livable space. The design embraces the building\'s original character - exposed brick walls, steel beams, and concrete floors - while introducing modern comforts and carefully curated furnishings that complement the space\'s industrial heritage.',
    process_description: 'The transformation focused on preserving and highlighting the existing architectural elements while improving functionality and comfort. We restored the original brick walls, refinished the concrete floors with a protective sealant, and introduced strategic lighting to warm the space. Industrial-style furniture and fixtures were selected to complement the existing structure.',
    style_characteristics: [
      'Exposed brick walls with restored mortar',
      'Steel beam ceiling structure left visible',
      'Concrete floors with polished finish',
      'Metal fixtures and hardware throughout',
      'Leather and distressed wood furniture',
      'Edison bulb lighting and industrial fixtures'
    ],
    room_specifications: [
      'Restored original hardwood where applicable',
      'Industrial pendant lighting with Edison bulbs',
      'Climate control system hidden within existing ductwork',
      'Sound dampening treatments for urban noise',
      'Original windows restored and weather-sealed',
      'Custom steel and wood furniture pieces'
    ],
    additional_media: [
      {
        type: 'image',
        url: '/images/industrial-loft-detail-1.jpg',
        caption: 'Detail of restored brick wall with custom steel shelving unit'
      },
      {
        type: 'video',
        url: '/videos/industrial-loft-lighting.mp4',
        caption: 'Evening lighting showcase demonstrating the warm ambiance'
      }
    ],
    before_after: {
      before_url: '/images/industrial-loft-before.jpg',
      after_url: '/images/industrial-loft-after.jpg',
      description: 'Before: Raw, unfinished space with potential. After: Refined industrial aesthetic with modern comfort.'
    }
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
  const [selectedTransformation, setSelectedTransformation] = useState<TransformationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransformationClick = (transformation: TransformationItem) => {
    setSelectedTransformation(transformation);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTransformation(null);
  };

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

  const galleryItems: TransformationItem[] = useMemo(() => {
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
            <Card 
              key={item.id} 
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTransformationClick(item)}
            >
              <div className="aspect-[4/3] bg-muted relative">
                <EnhancedVideo src={item.video_url} />
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
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
      
      {/* Transformation Modal */}
      <TransformationModal 
        transformation={selectedTransformation}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};