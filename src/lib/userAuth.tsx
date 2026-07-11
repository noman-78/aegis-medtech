import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, type UserProfile } from './supabase'

interface UserAuthContextValue {
  session: Session | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: (uid?: string) => Promise<void>
}

const UserAuthContext = createContext<UserAuthContextValue | undefined>(undefined)

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (uid: string, email?: string) => {
    // First try to select
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle()

    if (data) {
      setUserProfile(data as UserProfile)
      return data as UserProfile
    }

    // Row missing — create it now (handles users created before trigger was fixed)
    const emailToUse = email ?? (await supabase.auth.getUser()).data.user?.email ?? ''
    const { data: upserted } = await supabase
      .from('user_profiles')
      .upsert({ id: uid, email: emailToUse, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      .select()
      .maybeSingle()
    if (upserted) setUserProfile(upserted as UserProfile)
    return upserted as UserProfile | null
  }

  const refreshProfile = async (uid?: string) => {
    const targetUid = uid ?? session?.user?.id
    if (!targetUid) return
    await loadProfile(targetUid)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        loadProfile(data.session.user.id, data.session.user.email).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        loadProfile(newSession.user.id, newSession.user.email ?? undefined)
      } else {
        setUserProfile(null)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    if (data.user) {
      // Upsert immediately — don't depend on trigger timing
      const { data: row } = await supabase
        .from('user_profiles')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email ?? email,
            full_name: fullName ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select()
        .maybeSingle()
      if (row) setUserProfile(row as UserProfile)
    }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
    setSession(null)
  }

  return (
    <UserAuthContext.Provider value={{ session, userProfile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUserAuth must be used inside UserAuthProvider')
  return ctx
}
