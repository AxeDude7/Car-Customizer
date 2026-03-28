import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export const authService = {
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getCurrentUser: () => supabase.auth.getUser(),
}

// Customizations storage
export const customizationService = {
  save: (userId: string, customization: any) =>
    supabase
      .from('customizations')
      .upsert({ user_id: userId, data: customization, updated_at: new Date() }),
  
  getAll: (userId: string) =>
    supabase
      .from('customizations')
      .select('*')
      .eq('user_id', userId),
  
  delete: (id: string) =>
    supabase
      .from('customizations')
      .delete()
      .eq('id', id),
}

// User profiles
export const userService = {
  updateProfile: (userId: string, profile: any) =>
    supabase
      .from('profiles')
      .upsert({ id: userId, ...profile }),
  
  getProfile: (userId: string) =>
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),
}
