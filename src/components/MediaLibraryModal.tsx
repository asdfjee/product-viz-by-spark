import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, Image, Video, MagnifyingGlass, Check } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { galleryAPI } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  title?: string
  created_at: string
}

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMedia: (url: string) => void
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia
}) => {
  const [activeTab, setActiveTab] = useState('browse')
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  // Load media items from Supabase
  const loadMediaItems = async () => {
    setLoading(true)
    try {
      const items = await galleryAPI.getAll()
      const mappedItems: MediaItem[] = items.map(item => ({
        id: item.id,
        url: item.video_url,
        type: item.media_type || 'video',
        title: item.title,
        created_at: item.created_at
      }))
      setMediaItems(mappedItems)
    } catch (error) {
      console.error('Failed to load media items:', error)
      toast.error('Failed to load media items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMediaItems()
    }
  }, [isOpen])

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please upload a video file (mp4, mov, avi)')
      return
    }
    
    if (uploadType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file (jpg, png, gif, webp)')
      return
    }

    // Size limits
    const maxSize = uploadType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for image
    if (file.size > maxSize) {
      const sizeLimit = uploadType === 'video' ? '100MB' : '10MB'
      toast.error(`File size must be less than ${sizeLimit}`)
      return
    }

    setUploading(true)
    try {
      const url = await galleryAPI.uploadMedia(file, uploadType)
      toast.success(`${uploadType === 'video' ? 'Video' : 'Image'} uploaded successfully!`)
      await loadMediaItems() // Refresh the media list
      setActiveTab('browse') // Switch to browse tab
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload ${uploadType}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleSelectMedia = (url: string) => {
    setSelectedMedia(url)
    onSelectMedia(url)
    onClose()
    toast.success('Media selected successfully!')
  }

  const filteredMediaItems = mediaItems.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Media Library</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-6 grid w-full grid-cols-2">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <MagnifyingGlass className="w-4 h-4" />
              Browse Media
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 px-6 pb-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Media Grid */}
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredMediaItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No media found matching your search.' : 'No media uploaded yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMediaItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:border-primary/50",
                          selectedMedia === item.url ? "border-primary ring-2 ring-primary/20" : "border-border"
                        )}
                        onClick={() => handleSelectMedia(item.url)}
                      >
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          {item.type === 'video' ? (
                            <div className="relative w-full h-full">
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Video className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title || 'Media'}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        {/* Type Badge */}
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 text-xs"
                        >
                          {item.type}
                        </Badge>
                        
                        {/* Title */}
                        {item.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
                            {item.title}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 px-6 pb-6">
            <div className="space-y-4">
              {/* Upload Type Selection */}
              <div className="flex gap-2">
                <Button
                  variant={uploadType === 'image' ? 'default' : 'outline'}
                  onClick={() => setUploadType('image')}
                  className="flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  Image
                </Button>
                <Button
                  variant={uploadType === 'video' ? 'default' : 'outline'}
                  onClick={() => setUploadType('video')}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Video
                </Button>
              </div>

              {/* Upload Zone */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
                  dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                  uploading && "pointer-events-none opacity-50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById(`${uploadType}-upload`)?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {uploading ? 'Uploading...' : `Drop ${uploadType} files here`}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {uploadType === 'video' 
                    ? 'or click to browse (mp4, mov, avi - max 100MB)'
                    : 'or click to browse (jpg, png, gif, webp - max 10MB)'
                  }
                </p>
                <input
                  type="file"
                  accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                  id={`${uploadType}-upload`}
                  disabled={uploading}
                />
                <Button variant="outline" disabled={uploading}>
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Choose File
                </Button>
                {uploading && (
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse w-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default MediaLibraryModal