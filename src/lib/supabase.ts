import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create Supabase client if both URL and key are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface GalleryProject {
  id: string
  title: string
  description: string
  room_type: string
  style_type: string
  video_url: string
  thumbnail_url: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface UserProject {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  user_id: string | null
  thumbnail: string | null
  visualization_requests: any[]
}

// Gallery operations with fallback handling
export const galleryAPI = {
  async getAll(): Promise<GalleryProject[]> {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array')
      return []
    }
    
    const { data, error } = await supabase
      .from('gallery_projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(project: Omit<GalleryProject, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryProject> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('gallery_projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<GalleryProject>): Promise<GalleryProject> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('gallery_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase
      .from('gallery_projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadVideo(file: File): Promise<string> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const bucketName = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'gallery-media'
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)
    
    return publicUrl
  }
}

// Project operations with fallback handling
export const projectAPI = {
  async getAll(): Promise<UserProject[]> {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array')
      return []
    }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return []

    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<UserProject | null> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(project: Omit<UserProject, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<UserProject> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('user_projects')
      .insert({ ...project })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<UserProject>): Promise<UserProject> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('user_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async migrateFromLocalStorage(localProjects: any[]): Promise<UserProject[]> {
    if (!supabase || !localProjects.length) {
      return []
    }

    const migratedProjects: UserProject[] = []
    for (const localProject of localProjects) {
      try {
        const migratedProject = await this.create({
          name: localProject.name,
          description: localProject.description || '',
          thumbnail: localProject.thumbnail || null,
          visualization_requests: localProject.visualizationRequests || []
        })
        migratedProjects.push(migratedProject)
      } catch (error) {
        console.error('Failed to migrate project:', localProject.name, error)
      }
    }

    return migratedProjects
  }
}