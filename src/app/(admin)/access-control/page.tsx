import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SecurityManager from './SecurityManager'

export const dynamic = 'force-dynamic'

async function getAccessData() {
  const supabase = createAdminClient()
  
  const { data: domains } = await supabase
    .from('allowed_signup_domains')
    .select('*')
    .order('domain_name', { ascending: true })

  const { data: emails } = await supabase
    .from('whitelist_email_addresses')
    .select('*')
    .order('email_address', { ascending: true })
  
  return {
    domains: domains || [],
    emails: emails || []
  }
}

export default async function AccessControlPage() {
  const { domains, emails } = await getAccessData()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Control</h1>
        <p className="text-gray-600 text-lg">Manage which users are permitted to sign up for The Humor Project.</p>
      </div>

      <SecurityManager domains={domains} emails={emails} />
    </main>
  )
}
