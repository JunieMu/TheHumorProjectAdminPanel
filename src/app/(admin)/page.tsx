import { createAdminClient } from '@/utils/supabase/admin'
import { 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  SlidersHorizontal, 
  Send, 
  Lightbulb, 
  Cpu,
  BookOpen,
  ShieldCheck,
  Globe,
  Mail
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = createAdminClient()
  
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: imageCount } = await supabase.from('images').select('*', { count: 'exact', head: true })
  const { count: captionCount } = await supabase.from('captions').select('*', { count: 'exact', head: true })
  const { count: flavorCount } = await supabase.from('humor_flavors').select('*', { count: 'exact', head: true })
  const { count: requestCount } = await supabase.from('caption_requests').select('*', { count: 'exact', head: true })
  const { count: exampleCount } = await supabase.from('caption_examples').select('*', { count: 'exact', head: true })
  const { count: termCount } = await supabase.from('terms').select('*', { count: 'exact', head: true })
  const { count: domainCount } = await supabase.from('allowed_signup_domains').select('*', { count: 'exact', head: true })
  const { count: emailCount } = await supabase.from('whitelist_email_addresses').select('*', { count: 'exact', head: true })

  return {
    users: userCount || 0,
    images: imageCount || 0,
    captions: captionCount || 0,
    flavors: flavorCount || 0,
    requests: requestCount || 0,
    examples: exampleCount || 0,
    terms: termCount || 0,
    domains: domainCount || 0,
    emails: emailCount || 0,
  }
}

export default async function Dashboard() {
  const stats = await getStats()

  const mainCards = [
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

  const engineCards = [
    {
      title: 'Humor Flavors',
      description: 'Manage humor flavors and prompt strategies.',
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      href: '/humor-engine',
      count: stats.flavors,
      color: 'bg-purple-100',
    },
    {
      title: 'Humor Mix',
      description: 'Control the balance of flavors in generation.',
      icon: <SlidersHorizontal className="w-8 h-8 text-indigo-600" />,
      href: '/humor-mix',
      count: 'Config',
      color: 'bg-indigo-100',
    },
    {
      title: 'LLM Center',
      description: 'Manage models, providers, and view generation logs.',
      icon: <Cpu className="w-8 h-8 text-slate-600" />,
      href: '/llm-config',
      count: 'Config',
      color: 'bg-slate-100',
    },
  ]

  const knowledgeCards = [
    {
      title: 'Caption Requests',
      description: 'History of all API calls for caption generation.',
      icon: <Send className="w-8 h-8 text-orange-600" />,
      href: '/caption-requests',
      count: stats.requests,
      color: 'bg-orange-100',
    },
    {
      title: 'Caption Examples',
      description: 'Manage few-shot examples for learning.',
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      href: '/caption-examples',
      count: stats.examples,
      color: 'bg-yellow-100',
    },
    {
      title: 'Terms',
      description: 'Manage the glossary and knowledge base.',
      icon: <BookOpen className="w-8 h-8 text-cyan-600" />,
      href: '/terms',
      count: stats.terms,
      color: 'bg-cyan-100',
    },
  ]

  const securityCards = [
    {
      title: 'Allowed Domains',
      description: 'Domains permitted for user sign-up.',
      icon: <Globe className="w-8 h-8 text-rose-600" />,
      href: '/access-control?tab=domains',
      count: stats.domains,
      color: 'bg-rose-100',
    },
    {
      title: 'Whitelist Emails',
      description: 'Specific emails granted access.',
      icon: <Mail className="w-8 h-8 text-emerald-600" />,
      href: '/access-control?tab=emails',
      count: stats.emails,
      color: 'bg-emerald-100',
    },
  ]

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">The Humor Project Overview</p>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Core Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainCards.map((card) => (
            <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start">
              <div className={`${card.color} p-4 rounded-2xl mb-6`}>
                {card.icon}
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{card.title}</div>
              <p className="text-gray-600 mb-8 text-sm">{card.description}</p>
              <Link 
                href={card.href}
                className="mt-auto inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm"
              >
                Manage {card.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Humor Engine</h2>
            <div className="grid grid-cols-1 gap-6">
              {engineCards.map((card) => (
                <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start">
                  <div className="flex items-center gap-6 w-full">
                    <div className={`${card.color} p-4 rounded-2xl flex-shrink-0`}>
                      {card.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">{card.title}</div>
                      <div className="text-xl font-black text-gray-900">{card.count}</div>
                    </div>
                    <Link 
                      href={card.href}
                      className="bg-gray-50 p-3 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Security & Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {securityCards.map((card) => (
                <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start">
                  <div className={`${card.color} p-4 rounded-2xl mb-6`}>
                    {card.icon}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{card.title}</div>
                  <p className="text-gray-600 mb-6 text-xs">{card.description}</p>
                  <Link 
                    href={card.href}
                    className="mt-auto inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-all text-xs"
                  >
                    Open
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Knowledge & History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {knowledgeCards.map((card) => (
            <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start">
              <div className={`${card.color} p-4 rounded-2xl mb-6`}>
                {card.icon}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{card.title}</div>
              <p className="text-gray-600 mb-6 text-xs">{card.description}</p>
              <Link 
                href={card.href}
                className="mt-auto inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-all text-xs"
              >
                Open
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-medium text-sm">Supabase Connection</span>
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-medium text-sm">LLM API Gateway</span>
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
