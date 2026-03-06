import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID}.supabase.co`

// For admin panels, it's often better to use the SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
// However, ONLY use this on the server side. Never expose it in the browser.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
