import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error')
      } finally {
        setLoading(false)
      }
    })()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user, loading, error }
}

export function useSavedCustomizations(userId: string | undefined) {
  const [customizations, setCustomizations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('customizations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (!error) setCustomizations(data || [])
      setLoading(false)
    })()
  }, [userId])

  return { customizations, loading }
}
