import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import HumorMixList from './HumorMixList'

export const dynamic = 'force-dynamic'

async function getMix() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('humor_flavor_mix')
    .select('*, humor_flavors(slug)')
    .order('id', { ascending: true })
  
  if (error) {
    console.error('Error fetching mix:', error)
    return []
  }
  return data
}

export default async function HumorMixPage() {
  const mix = await getMix()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Humor Mix Configuration</h1>
          <p className="text-gray-500 mt-2">Adjust the number of captions generated for each humor flavor.</p>
        </div>
      </div>

      <HumorMixList initialMix={mix} />
    </main>
  )
}
