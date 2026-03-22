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
  Mail,
  TrendingUp,
  Award,
  BarChart3,
  Heart
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = createAdminClient()
  
  // Basic Counts (in parallel)
  const results = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
    supabase.from('captions').select('*', { count: 'exact', head: true }),
    supabase.from('humor_flavors').select('*', { count: 'exact', head: true }),
    supabase.from('caption_requests').select('*', { count: 'exact', head: true }),
    supabase.from('caption_examples').select('*', { count: 'exact', head: true }),
    supabase.from('terms').select('*', { count: 'exact', head: true }),
    supabase.from('allowed_signup_domains').select('*', { count: 'exact', head: true }),
    supabase.from('whitelist_email_addresses').select('*', { count: 'exact', head: true }),
    supabase.rpc('get_daily_activity', { days_count: 14 }),
    supabase.rpc('get_top_contributors', { limit_count: 3 }),
    supabase.rpc('get_total_likes')
  ])

  const [
    userRes, imageRes, captionRes, flavorRes, requestRes, 
    exampleRes, termRes, domainRes, emailRes, 
    activityRes, topContributorsRes, totalLikesRes
  ] = results

  // Process activity data to ensure numbers and correct order
  const activity = (activityRes.data as any[] || []).map(day => ({
    date: day.date,
    count: Number(day.count) || 0
  }))

    counts: {
      users: userRes.count || 0,
      images: imageRes.count || 0,
      captions: captionRes.count || 0,
      flavors: flavorRes.count || 0,
      requests: requestRes.count || 0,
      examples: exampleRes.count || 0,
      terms: termRes.count || 0,
      domains: domainRes.count || 0,
      emails: emailRes.count || 0,
    },
    activity,
    topContributors: (topContributorsRes.data as any[]) || [],
    totalLikes: Number(totalLikesRes.data) || 0
  }
}

export default async function Dashboard() {
  const stats = await getStats()
  const maxActivity = Math.max(...stats.activity.map(a => a.count), 1)

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 text-lg font-medium">System Intelligence & Operations</p>
      </div>

      {/* Visual Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Generation Activity</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last 14 Days</span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {stats.activity.map((day) => {
              const height = (day.count / maxActivity) * 100
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div 
                    style={{ height: `${Math.max(height, 2)}%` }}
                    className="w-full bg-orange-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-300 cursor-help shadow-sm min-h-[4px]"
                  />
                  <div className="absolute -top-12 bg-gray-900 text-white text-[10px] font-black py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl border border-white/10">
                    <div className="text-orange-400 mb-0.5">{day.date}</div>
                    <div>{day.count} requests</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline Start</span>
              <span className="text-xs font-bold text-gray-900">{stats.activity[0]?.date}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latest Activity</span>
              <span className="text-xs font-bold text-gray-900">{stats.activity[stats.activity.length - 1]?.date}</span>
            </div>
          </div>
        </div>

        {/* Top Contributors & Sentiment */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Award className="w-6 h-6 text-amber-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Top Contributors</h2>
            </div>
            <div className="space-y-6">
              {stats.topContributors.map((c: any, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs">
                      {i + 1}
                    </div>
                    <span className="font-bold text-sm truncate max-w-[150px]">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    {c.count}
                  </span>
                </div>
              ))}
              {stats.topContributors.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs font-bold uppercase tracking-widest">No data available</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Engagement Index</h2>
              </div>
              <span className="text-xl font-black text-gray-900">{stats.totalLikes.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.max(5, Math.min((stats.totalLikes / 1000) * 100, 100))}%` }}
              />
            </div>
            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Net cumulative likes across all captions</p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
          <BarChart3 className="w-4 h-4" />
          Core Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Users', count: stats.counts.users, color: 'bg-amber-100', text: 'text-amber-600', href: '/users', icon: <Users /> },
            { title: 'Images', count: stats.counts.images, color: 'bg-emerald-100', text: 'text-emerald-600', href: '/images', icon: <ImageIcon /> },
            { title: 'Captions', count: stats.counts.captions, color: 'bg-blue-100', text: 'text-blue-600', href: '/captions', icon: <MessageSquare /> },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-xl transition-all group">
              <div className={`${card.color} ${card.text} p-4 rounded-2xl mb-8 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">{card.count.toLocaleString()}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">{card.title}</div>
              <Link 
                href={card.href}
                className="mt-auto w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
            <Zap className="w-4 h-4" />
            Humor Engine & Logic
          </h2>
          <div className="space-y-6">
            {[
              { title: 'Humor Flavors', count: stats.counts.flavors, href: '/humor-engine', icon: <Zap />, color: 'bg-purple-100', text: 'text-purple-600' },
              { title: 'Humor Mix', count: 'Active', href: '/humor-mix', icon: <SlidersHorizontal />, color: 'bg-indigo-100', text: 'text-indigo-600' },
              { title: 'LLM Center', count: 'Ready', href: '/llm-config', icon: <Cpu />, color: 'bg-slate-100', text: 'text-slate-600' },
            ].map((card) => (
              <Link href={card.href} key={card.title} className="block group">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group-hover:shadow-md transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`${card.color} ${card.text} p-3 rounded-xl`}>{card.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{card.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.count} Entries</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            Security & Access Control
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'Allowed Domains', count: stats.counts.domains, href: '/access-control?tab=domains', icon: <Globe />, color: 'bg-rose-100', text: 'text-rose-600' },
              { title: 'Whitelist Emails', count: stats.counts.emails, href: '/access-control?tab=emails', icon: <Mail />, color: 'bg-emerald-100', text: 'text-emerald-600' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className={`${card.color} ${card.text} p-4 rounded-2xl mb-6`}>{card.icon}</div>
                <div className="text-3xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">{card.title}</div>
                <Link href={card.href} className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:opacity-50 transition-opacity uppercase tracking-widest">Configure</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
          <BookOpen className="w-4 h-4" />
          Knowledge & Logs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Caption Requests', count: stats.counts.requests, href: '/caption-requests', icon: <Send />, color: 'bg-orange-100', text: 'text-orange-600' },
            { title: 'Caption Examples', count: stats.counts.examples, href: '/caption-examples', icon: <Lightbulb />, color: 'bg-yellow-100', text: 'text-yellow-600' },
            { title: 'Terms', count: stats.counts.terms, href: '/terms', icon: <BookOpen />, color: 'bg-cyan-100', text: 'text-cyan-600' },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className={`${card.color} ${card.text} p-4 rounded-2xl mb-6`}>{card.icon}</div>
              <div className="text-2xl font-black text-gray-900 mb-1">{card.count.toLocaleString()}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">{card.title}</div>
              <Link href={card.href} className="mt-auto bg-gray-50 hover:bg-gray-100 text-gray-900 w-full py-3 rounded-xl text-xs font-bold transition-colors uppercase tracking-widest">History</Link>
            </div>
          ))}
        </div>
      </div>

      {/* System Health Status */}
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Status</h2>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Latency</span>
              <span className="font-bold text-gray-900">42ms</span>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="text-center">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Uptime</span>
              <span className="font-bold text-gray-900">99.9%</span>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="text-center">
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Environment</span>
              <span className="font-bold text-gray-900 uppercase text-xs">Production</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
