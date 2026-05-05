import { supabase } from './supabase'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface AppUser {
  id: string
  email: string
  role: UserRole
  name: string
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, name')
    .eq('user_id', user.id)
    .single()

  if (!roleData) return null

  return {
    id: user.id,
    email: user.email ?? '',
    role: roleData.role as UserRole,
    name: roleData.name,
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}
