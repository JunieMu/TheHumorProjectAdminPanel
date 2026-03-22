import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, MessageSquare, Star, Heart, Database } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getDebugInfo() {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .from('captions')
    .select('*', { count: 'exact', head: true })
  
  return {
    count: count || 0,
    error,
    keyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keySnippet: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5)
  }
}

async function getCaptions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('captions')
    .select('*, profiles!profile_id(first_name, last_name), images(url, image_description)')
    .order('created_datetime_utc', { ascending: false })
    .limit(50)
  
  if (error) {
    console.error('Error fetching captions:', error)
    return { data: [], error }
  }
  return { data: data || [], error: null }
}

export default async function CaptionsPage() {
  const { data: captions, error } = await getCaptions()
  const debug = await getDebugInfo()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Captions</h1>
        </div>
      </div>

      {/* Debug Panel - Keeping for final verification */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4 text-blue-800 font-bold">
          <Database className="w-5 h-5" />
          Captions System Status
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-gray-500 block">Total Captions</span>
            <span className="text-xl font-black">{debug.count.toLocaleString()}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-gray-500 block">Fetch Status</span>
            <span className="text-xl font-black">{error ? 'Error' : captions.length > 0 ? 'Data Loaded' : 'Empty'}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-gray-500 block">Items Displayed</span>
            <span className="text-xl font-black">{captions.length}</span>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-2xl text-red-800 text-xs font-mono">
            {error.message}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {captions && captions.length > 0 ? (
          captions.map((caption: any) => (
            <div key={caption.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-48 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                {caption.images?.url ? (
                  <img 
                    src={caption.images.url} 
                    alt={caption.images.image_description || 'Related image'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                )}
                {caption.is_featured && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-white p-1.5 rounded-full shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                      By {caption.profiles?.first_name || 'Anonymous'} {caption.profiles?.last_name || ''}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(caption.created_datetime_utc).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold">{caption.like_count || 0}</span>
                  </div>
                </div>
                
                <blockquote className="text-2xl font-medium text-gray-900 mb-6 italic">
                  &ldquo;{caption.content}&rdquo;
                </blockquote>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                  {caption.is_public && (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">Public</span>
                  )}
                  {caption.humor_flavor_id && (
                    <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">Flavor #{caption.humor_flavor_id}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No captions found</h3>
            <p className="text-gray-500">The captions table might be empty or there was an error fetching data.</p>
          </div>
        )}
      </div>
    </main>
  )
}
