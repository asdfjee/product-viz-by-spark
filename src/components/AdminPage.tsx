import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Trash, Pen, Plus, Upload, Star } from '@phosphor-icons/react'
import { galleryAPI, GalleryProject } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

interface MediaFormData {
  title: string
  description: string
  room_type: string
  style_type: string
  featured: boolean
  media_type: 'video' | 'image'
}

const initialFormData: MediaFormData = {
  title: '',
  description: '',
  room_type: '',
  style_type: '',
  featured: false,
  media_type: 'video'
}

const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Hallway']
const styleTypes = ['Modern', 'Scandinavian', 'Minimalist', 'Industrial', 'Traditional', 'Contemporary', 'Rustic']

const MediaUploadZone = ({ 
  onMediaUploaded, 
  mediaType 
}: { 
  onMediaUploaded: (url: string) => void
  mediaType: 'video' | 'image'
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    // Validate file type based on media type
    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please upload a video file (mp4, mov, avi)')
      return
    }
    
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file (jpg, png, gif, webp)')
      return
    }

    // Size limits
    const maxSize = mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for image
    if (file.size > maxSize) {
      const sizeLimit = mediaType === 'video' ? '100MB' : '10MB'
      toast.error(`File size must be less than ${sizeLimit}`)
      return
    }

    setUploading(true)
    try {
      const url = await galleryAPI.uploadMedia(file, mediaType)
      onMediaUploaded(url)
      toast.success(`${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload ${mediaType}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
    >
      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {uploading ? 'Uploading...' : `Drop ${mediaType} files here`}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {mediaType === 'video' 
          ? 'or click to browse (mp4, mov, avi - max 100MB)'
          : 'or click to browse (jpg, png, gif, webp - max 10MB)'
        }
      </p>
      <input
        type="file"
        accept={mediaType === 'video' ? 'video/*' : 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
        id={`${mediaType}-upload`}
        disabled={uploading}
      />
      <Button asChild variant="outline" disabled={uploading}>
        <label htmlFor={`${mediaType}-upload`} className="cursor-pointer">
          Choose File
        </label>
      </Button>
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  )
}

const MediaFormDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title 
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MediaFormData & { video_url?: string }) => void
  initialData?: Partial<MediaFormData>
  title: string
}) => {
  const [formData, setFormData] = useState<MediaFormData>(initialFormData)
  const [mediaUrl, setMediaUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialFormData, ...initialData })
    } else {
      setFormData(initialFormData)
      setMediaUrl('')
    }
  }, [initialData, isOpen])

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.room_type || !formData.style_type) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!initialData && !mediaUrl) {
      toast.error(`Please upload a ${formData.media_type}`)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ ...formData, video_url: mediaUrl })
      onClose()
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edit media details' : 'Add new media to the gallery'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!initialData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="media_type">Media Type *</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: 'video' | 'image') => setFormData(prev => ({ ...prev, media_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <MediaUploadZone 
                onMediaUploaded={setMediaUrl} 
                mediaType={formData.media_type}
              />
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Modern Living Room"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room_type">Room Type *</Label>
              <Select
                value={formData.room_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style_type">Style Type *</Label>
            <Select
              value={formData.style_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, style_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style type" />
              </SelectTrigger>
              <SelectContent>
                {styleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the room transformation..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured {formData.media_type}</Label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : (initialData ? 'Update' : `Add ${formData.media_type}`)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const AdminPage = () => {
  const navigate = useNavigate()
  const [mediaItems, setMediaItems] = useState<GalleryProject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    data?: GalleryProject
  }>({ isOpen: false, mode: 'add' })

  // Check admin authentication
  useEffect(() => {
    const isAdminAuth = localStorage.getItem('admin-auth')
    if (!isAdminAuth) {
      navigate('/admin/login')
    }
  }, [navigate])

  // Load media items
  const loadMediaItems = async () => {
    try {
      setLoading(true)
      const data = await galleryAPI.getAll()
      setMediaItems(data)
    } catch (error) {
      console.error('Failed to load media items:', error)
      toast.error('Failed to load media items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMediaItems()
  }, [])

  const handleAddMedia = async (data: MediaFormData & { video_url?: string }) => {
    try {
      await galleryAPI.create({
        title: data.title,
        description: data.description,
        room_type: data.room_type,
        style_type: data.style_type,
        video_url: data.video_url!,
        thumbnail_url: data.video_url!, // Using media URL as thumbnail for now
        featured: data.featured,
        media_type: data.media_type
      })
      toast.success(`${data.media_type === 'video' ? 'Video' : 'Image'} added successfully!`)
      loadMediaItems()
    } catch (error) {
      console.error('Failed to add media:', error)
      toast.error('Failed to add media')
    }
  }

  const handleEditMedia = async (data: MediaFormData) => {
    if (!dialogState.data) return
    
    try {
      await galleryAPI.update(dialogState.data.id, {
        title: data.title,
        description: data.description,
        room_type: data.room_type,
        style_type: data.style_type,
        featured: data.featured
      })
      const mediaType = dialogState.data.media_type || 'video'
      toast.success(`${mediaType === 'video' ? 'Video' : 'Image'} updated successfully!`)
      loadMediaItems()
    } catch (error) {
      console.error('Failed to update media:', error)
      toast.error('Failed to update media')
    }
  }

  const handleDeleteMedia = async (id: string, mediaType: string = 'video') => {
    if (!confirm(`Are you sure you want to delete this ${mediaType}?`)) return
    
    try {
      await galleryAPI.delete(id)
      toast.success(`${mediaType === 'video' ? 'Video' : 'Image'} deleted successfully!`)
      loadMediaItems()
    } catch (error) {
      console.error('Failed to delete media:', error)
      toast.error('Failed to delete media')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-auth')
    navigate('/admin/login')
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery Administration</h1>
          <p className="text-muted-foreground mt-2">Manage gallery media and content</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setDialogState({ isOpen: true, mode: 'add' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Media ({mediaItems.length})</CardTitle>
          <CardDescription>
            Manage media content in the gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading media...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Style Type</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={item.media_type === 'video' ? 'default' : 'secondary'}>
                        {item.media_type === 'video' ? 'Video' : 'Image'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.room_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.style_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.featured && <Star className="w-4 h-4 text-accent" />}
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDialogState({ 
                            isOpen: true, 
                            mode: 'edit', 
                            data: item 
                          })}
                        >
                          <Pen className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMedia(item.id, item.media_type)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && mediaItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No media in the gallery yet.</p>
              <Button onClick={() => setDialogState({ isOpen: true, mode: 'add' })}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Media
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MediaFormDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, mode: 'add' })}
        onSubmit={dialogState.mode === 'add' ? handleAddMedia : handleEditMedia}
        initialData={dialogState.data}
        title={dialogState.mode === 'add' ? 'Add New Media' : 'Edit Media'}
      />
    </div>
  )
}