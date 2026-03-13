import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getFlavors() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('humor_flavors')
    .select('*')
    .order('slug', { ascending: true })
  
  if (error) {
    console.error('Error fetching flavors:', error)
    return []
  }
  return data
}

export default async function FlavorsPage() {
  const flavors = await getFlavors()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Humor Flavors</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flavors.map((flavor) => (
          <div key={flavor.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{flavor.slug}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {flavor.id}</span>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed italic mb-6">
              "{flavor.description || 'No description provided.'}"
            </p>

            <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Created</span>
              <span>{new Date(flavor.created_datetime_utc).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {flavors.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No flavors found</h3>
            <p className="text-gray-500">Add flavors to the database to see them here.</p>
          </div>
        )}
      </div>
    </main>
  )
}
