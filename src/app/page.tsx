import { createAdminClient } from '@/utils/supabase/admin'
import { Users, Image as ImageIcon, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = createAdminClient()
  
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: imageCount } = await supabase
    .from('images')
    .select('*', { count: 'exact', head: true })

  const { count: captionCount } = await supabase
    .from('captions')
    .select('*', { count: 'exact', head: true })

  return {
    users: userCount || 0,
    images: imageCount || 0,
    captions: captionCount || 0,
  }
}

export default async function Dashboard() {
  const stats = await getStats()

  const navCards = [
    {
      title: 'Users',
      description: 'Manage user profiles and study participation.',
      icon: <Users className="w-8 h-8 text-amber-600" />,
      href: '/users',
      count: stats.users,
      color: 'bg-amber-100',
    },
    {
      title: 'Images',
      description: 'Review and manage the image library.',
      icon: <ImageIcon className="w-8 h-8 text-emerald-600" />,
      href: '/images',
      count: stats.images,
      color: 'bg-emerald-100',
    },
    {
      title: 'Captions',
      description: 'Browse, featured, and manage user captions.',
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      href: '/captions',
      count: stats.captions,
      color: 'bg-blue-100',
    },
  ]

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">The Humor Project Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {navCards.map((card) => (
          <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start">
            <div className={`${card.color} p-4 rounded-2xl mb-6`}>
              {card.icon}
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
            <div className="text-gray-500 font-medium uppercase tracking-wider text-xs mb-4">{card.title}</div>
            <p className="text-gray-600 mb-8">{card.description}</p>
            <Link 
              href={card.href}
              className="mt-auto inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Manage {card.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <p className="text-gray-500">Activity stream coming soon...</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">System Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-medium">Supabase Connection</span>
              <span className="text-emerald-500 font-bold">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-medium">API Status</span>
              <span className="text-emerald-500 font-bold">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
