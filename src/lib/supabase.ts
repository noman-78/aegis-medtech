import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

export type Role = 'admin' | 'editor' | 'viewer'

export interface Profile {
  id: string
  email: string
  role: Role
  created_at: string
}

export interface ContentPage {
  id: string
  slug: string
  title: string
  body: string
  updated_by: string | null
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  organization: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'archived'
  ip_hash: string | null
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface AuditLogEntry {
  id: string
  actor_id: string | null
  action: string
  detail: string | null
  created_at: string
}
