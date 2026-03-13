import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, ListTree, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getSteps() {
  const supabase = createAdminClient()
  
  // Fetch steps with flavor info
  const { data, error } = await supabase
    .from('humor_flavor_steps')
    .select('*, humor_flavors(slug)')
    .order('humor_flavor_id', { ascending: true })
    .order('order_by', { ascending: true })
  
  if (error) {
    console.error('Error fetching steps:', error)
    return []
  }
  return data
}

export default async function StepsPage() {
  const steps = await getSteps()

  // Group steps by flavor slug
  const groupedSteps = steps.reduce((acc: any, step: any) => {
    const slug = step.humor_flavors?.slug || 'Unknown'
    if (!acc[slug]) acc[slug] = []
    acc[slug].push(step)
    return acc
  }, {})

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Flavor Steps</h1>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedSteps).map(([slug, flavorSteps]: [string, any]) => (
          <section key={slug}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-100 p-2 rounded-xl">
                <ListTree className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">{slug}</h2>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                {flavorSteps.length} Steps
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {flavorSteps.map((step: any) => (
                <div key={step.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                    {step.order_by}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{step.description || 'Unnamed Step'}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">
                        Model ID: {step.llm_model_id}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">System Prompt</span>
                        <p className="text-xs text-gray-600 line-clamp-3 font-mono leading-relaxed">
                          {step.llm_system_prompt || 'None'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">User Prompt</span>
                        <p className="text-xs text-gray-600 line-clamp-3 font-mono leading-relaxed">
                          {step.llm_user_prompt || 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-center hidden md:block">
                    <ChevronRight className="w-5 h-5 text-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {Object.keys(groupedSteps).length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <ListTree className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No steps found in the engine configuration.</p>
          </div>
        )}
      </div>
    </main>
  )
}
