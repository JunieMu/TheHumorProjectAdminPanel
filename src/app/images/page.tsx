import { supabase } from '@/lib/supabase'
import { ArrowLeft, Image as ImageIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'

async function getImages() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_datetime_utc', { ascending: false })
  
  if (error) {
    console.error('Error fetching images:', error)
    return []
  }
  return data
}

export default async function ImagesPage() {
  const images = await getImages()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Image Library</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {image.url ? (
                <img 
                  src={image.url} 
                  alt={image.image_description || 'Humor Project Image'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              {image.is_public && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Public
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                {image.image_description || 'No description provided'}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500 font-medium">
                  {image.created_datetime_utc ? new Date(image.created_datetime_utc).toLocaleDateString() : 'Unknown date'}
                </span>
                {image.url && (
                  <a 
                    href={image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-500">The image library is currently empty.</p>
          </div>
        )}
      </div>
    </main>
  )
}
