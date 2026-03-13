import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import LLMManager from './LLMManager'

export const dynamic = 'force-dynamic'

async function getLLMData() {
  const supabase = createAdminClient()
  
  const { data: providers } = await supabase
    .from('llm_providers')
    .select('*')
    .order('name', { ascending: true })

  const { data: models } = await supabase
    .from('llm_models')
    .select('*, llm_providers(name)')
    .order('name', { ascending: true })
  
  return {
    providers: providers || [],
    models: models || []
  }
}

export default async function LLMConfigPage() {
  const { providers, models } = await getLLMData()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">LLM Configuration</h1>
        <p className="text-gray-600 text-lg">Manage AI model providers and the specific models used by the engine.</p>
      </div>

      <LLMManager providers={providers} models={models} />
    </main>
  )
}
