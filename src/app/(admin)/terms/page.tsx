import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import TermsManager from './TermsManager'

export const dynamic = 'force-dynamic'

async function getTermsData() {
  const supabase = createAdminClient()
  
  const { data: terms } = await supabase
    .from('terms')
    .select('*, term_types(name)')
    .order('term', { ascending: true })

  const { data: termTypes } = await supabase
    .from('term_types')
    .select('*')
    .order('name', { ascending: true })
  
  return {
    terms: terms || [],
    termTypes: termTypes || []
  }
}

export default async function TermsPage() {
  const { terms, termTypes } = await getTermsData()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <TermsManager initialTerms={terms} termTypes={termTypes} />

      {terms.length === 0 && (
        <div className="col-span-full py-24 text-center">
          <p className="text-gray-500 font-medium">No terms found in the glossary.</p>
        </div>
      )}
    </main>
  )
}
