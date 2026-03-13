import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ExampleGrid from './ExampleGrid'

export const dynamic = 'force-dynamic'

async function getExamples() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('caption_examples')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_datetime_utc', { ascending: false })
  
  if (error) {
    console.error('Error fetching examples:', error)
    return []
  }
  return data
}

export default async function CaptionExamplesPage() {
  const examples = await getExamples()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <ExampleGrid initialExamples={examples} />

      {examples.length === 0 && (
        <div className="col-span-full py-24 text-center">
          <p className="text-gray-500 font-medium">No caption examples found.</p>
        </div>
      )}
    </main>
  )
}
