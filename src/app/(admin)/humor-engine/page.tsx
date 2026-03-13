import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, Zap, ListTree, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getEngineData() {
  const supabase = createAdminClient()
  
  // Fetch flavors
  const { data: flavors, error: flavorError } = await supabase
    .from('humor_flavors')
    .select('*')
    .order('slug', { ascending: true })

  // Fetch steps
  const { data: steps, error: stepError } = await supabase
    .from('humor_flavor_steps')
    .select('*')
    .order('order_by', { ascending: true })
  
  if (flavorError || stepError) {
    console.error('Error fetching engine data:', flavorError || stepError)
    return { flavors: [], steps: [] }
  }
  return { flavors: flavors || [], steps: steps || [] }
}

export default async function HumorEnginePage() {
  const { flavors, steps } = await getEngineData()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Humor Engine Config</h1>
        <p className="text-gray-600 text-lg">Manage flavors and their underlying prompt strategies.</p>
      </div>

      <div className="space-y-16">
        {flavors.map((flavor) => {
          const flavorSteps = steps.filter(s => s.humor_flavor_id === flavor.id)
          
          return (
            <section key={flavor.id} className="relative">
              {/* Flavor Header Card */}
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-purple-100 p-4 rounded-3xl">
                      <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{flavor.slug}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flavor ID: {flavor.id}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{flavorSteps.length} Prompt Steps</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-50">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Strategy Description</label>
                  <p className="text-gray-600 leading-relaxed text-lg italic">
                    "{flavor.description || 'No description provided for this humor strategy.'}"
                  </p>
                </div>
              </div>

              {/* Nested Steps */}
              <div className="ml-4 md:ml-12 space-y-4 border-l-2 border-gray-100 pl-4 md:pl-12">
                <div className="flex items-center gap-2 mb-6 text-gray-400">
                  <ListTree className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Execution Pipeline</span>
                </div>

                {flavorSteps.length > 0 ? (
                  flavorSteps.map((step) => (
                    <div key={step.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-shrink-0 flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-gray-200">
                            {step.order_by}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{step.description || `Step ${step.order_by}`}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Temp: {step.llm_temperature || '0.7'}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Model: {step.llm_model_id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-5 rounded-2xl">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">System Instruction</span>
                            <div className="text-xs text-gray-600 font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                              {step.llm_system_prompt || 'No system prompt defined.'}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-5 rounded-2xl">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">User Prompt Template</span>
                            <div className="text-xs text-gray-600 font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                              {step.llm_user_prompt || 'No user prompt defined.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 text-center">
                    <p className="text-amber-700 font-bold text-sm">No steps defined for this flavor. The engine will skip this strategy.</p>
                  </div>
                )}
              </div>
            </section>
          )
        })}

        {flavors.length === 0 && (
          <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900">No Engine Data</h3>
            <p className="text-gray-500">Humor flavors and steps will appear here once configured.</p>
          </div>
        )}
      </div>
    </main>
  )
}
