import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, Send, User, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getRequests() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('caption_requests')
    .select('*, profiles(first_name, last_name, email), images(url, image_description)')
    .order('created_datetime_utc', { ascending: false })
    .limit(100)
  
  if (error) {
    console.error('Error fetching requests:', error)
    return []
  }
  return data
}

export default async function CaptionRequestsPage() {
  const requests = await getRequests()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Caption Requests</h1>
        <p className="text-gray-500 mt-2">Latest 100 API calls for caption generation.</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Request Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Target Image</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <Send className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">ID: {req.id}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Request Log</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-900">
                          {req.profiles?.first_name} {req.profiles?.last_name}
                        </span>
                        <span className="block text-xs text-gray-400">{req.profiles?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 max-w-xs">
                      {req.images?.url ? (
                        <img src={req.images.url} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="Thumbnail" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2 italic">
                        "{req.images?.image_description || 'No description'}"
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(req.created_datetime_utc).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
