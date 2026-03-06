import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. Data might be hidden by RLS.')
  }

  return createClient(supabaseUrl, serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
