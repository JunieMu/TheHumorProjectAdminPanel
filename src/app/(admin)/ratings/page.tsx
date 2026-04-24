import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, ThumbsUp, ThumbsDown, Vote, BarChart3, Star, Users, CircleDot } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getRatingsData() {
  const supabase = createAdminClient()

  const [votesRes, captionsRes, flavorsRes, profilesRes] = await Promise.all([
    supabase
      .from('caption_votes')
      .select('vote_value, caption_id, profile_id, created_datetime_utc'),
    supabase
      .from('captions')
      .select('id, humor_flavor_id, like_count, content, images!image_id(url)'),
    supabase.from('humor_flavors').select('id, slug'),
    supabase.from('profiles').select('id, first_name, last_name'),
  ])

  const allVotes = (votesRes.data || []) as any[]
  const allCaptions = (captionsRes.data || []) as any[]
  const allFlavors = (flavorsRes.data || []) as any[]
  const allProfiles = (profilesRes.data || []) as any[]

  // Lookups
  const flavorById: Record<number, string> = {}
  for (const f of allFlavors) flavorById[f.id] = f.slug

  const captionMap: Record<string, any> = {}
  for (const c of allCaptions) captionMap[c.id] = c

  const profileMap: Record<string, string> = {}
  for (const p of allProfiles) {
    profileMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Anonymous'
  }

  // Summary
  const totalVotes = allVotes.length
  const upvotes = allVotes.filter((v) => v.vote_value > 0).length
  const downvotes = allVotes.filter((v) => v.vote_value < 0).length
  const approvalRate = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0

  // Votes over time — last 14 days
  const votesPerDay = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const date = d.toISOString().split('T')[0]
    return {
      date,
      count: allVotes.filter((v) => v.created_datetime_utc?.startsWith(date)).length,
    }
  })

  // Approval rate per flavor
  const flavorStats: Record<string, { slug: string; up: number; down: number }> = {}
  for (const vote of allVotes) {
    const caption = captionMap[vote.caption_id]
    const slug = caption?.humor_flavor_id != null ? flavorById[caption.humor_flavor_id] : null
    if (!slug) continue
    if (!flavorStats[slug]) flavorStats[slug] = { slug, up: 0, down: 0 }
    if (vote.vote_value > 0) flavorStats[slug].up++
    else flavorStats[slug].down++
  }
  const flavorData = Object.values(flavorStats)
    .map((f) => ({
      slug: f.slug,
      up: f.up,
      down: f.down,
      total: f.up + f.down,
      rate: f.up + f.down > 0 ? Math.round((f.up / (f.up + f.down)) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate)

  // Top 5 captions by like_count (only those with content)
  const topCaptions = [...allCaptions]
    .filter((c) => c.content)
    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
    .slice(0, 5)

  // Most active voters
  const voterCounts: Record<string, { name: string; count: number }> = {}
  for (const vote of allVotes) {
    const pid = vote.profile_id
    if (!voterCounts[pid]) voterCounts[pid] = { name: profileMap[pid] || 'Anonymous', count: 0 }
    voterCounts[pid].count++
  }
  const topVoters = Object.values(voterCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Unrated captions
  const ratedIds = new Set(allVotes.map((v) => v.caption_id))
  const unratedCount = allCaptions.filter((c) => !ratedIds.has(c.id)).length

  // Most controversial: most votes but closest to 50/50
  const controversial = Object.entries(
    allVotes.reduce((acc: Record<string, { up: number; down: number }>, v) => {
      const id = v.caption_id
      if (!acc[id]) acc[id] = { up: 0, down: 0 }
      if (v.vote_value > 0) acc[id].up++
      else acc[id].down++
      return acc
    }, {})
  )
    .map(([id, counts]) => {
      const total = counts.up + counts.down
      const diff = Math.abs(counts.up - counts.down)
      return { id, total, diff, caption: captionMap[id] }
    })
    .filter((x) => x.total >= 3 && x.caption?.content)
    .sort((a, b) => a.diff - b.diff || b.total - a.total)
    .slice(0, 3)

  return {
    totalVotes,
    upvotes,
    downvotes,
    approvalRate,
    votesPerDay,
    flavorData,
    topCaptions,
    topVoters,
    unratedCount,
    totalCaptions: allCaptions.length,
    controversial,
  }
}

export default async function RatingsPage() {
  const data = await getRatingsData()
  const maxDayVotes = Math.max(...data.votesPerDay.map((d) => d.count), 1)

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Caption Ratings</h1>
        <p className="text-gray-500 text-lg font-medium">How users are voting on generated captions</p>
      </div>

      {/* Summary stat boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: 'Total Votes',
            value: data.totalVotes.toLocaleString(),
            icon: <Vote className="w-5 h-5" />,
            color: 'bg-violet-100',
            text: 'text-violet-600',
          },
          {
            label: 'Upvotes',
            value: data.upvotes.toLocaleString(),
            icon: <ThumbsUp className="w-5 h-5" />,
            color: 'bg-emerald-100',
            text: 'text-emerald-600',
          },
          {
            label: 'Downvotes',
            value: data.downvotes.toLocaleString(),
            icon: <ThumbsDown className="w-5 h-5" />,
            color: 'bg-rose-100',
            text: 'text-rose-600',
          },
          {
            label: 'Approval Rate',
            value: `${data.approvalRate}%`,
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'bg-blue-100',
            text: 'text-blue-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-start">
            <div className={`${stat.color} ${stat.text} p-3 rounded-2xl mb-6`}>{stat.icon}</div>
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Votes over time + quick signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-2xl">
                <Vote className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Votes Over Time</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last 14 Days</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {data.votesPerDay.map((day) => {
              const height = (day.count / maxDayVotes) * 100
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div
                    style={{ height: `${Math.max(height, 2)}%` }}
                    className="w-full bg-violet-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-300 cursor-help shadow-sm min-h-[4px]"
                  />
                  <div className="absolute -top-12 bg-gray-900 text-white text-[10px] font-black py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                    <div className="text-violet-400 mb-0.5">{day.date}</div>
                    <div>{day.count} votes</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
            <span className="text-xs font-bold text-gray-900">{data.votesPerDay[0]?.date}</span>
            <span className="text-xs font-bold text-gray-900">{data.votesPerDay[data.votesPerDay.length - 1]?.date}</span>
          </div>
        </div>

        {/* Quick signals */}
        <div className="space-y-6">
          {/* Upvote vs Downvote visual split */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Vote Breakdown</h3>
            <div className="flex rounded-full overflow-hidden h-4 mb-4">
              <div
                className="bg-emerald-400 transition-all"
                style={{ width: `${data.totalVotes > 0 ? (data.upvotes / data.totalVotes) * 100 : 50}%` }}
              />
              <div className="bg-rose-400 flex-1" />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-600 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {data.upvotes.toLocaleString()}</span>
              <span className="text-rose-600 flex items-center gap-1">{data.downvotes.toLocaleString()} <ThumbsDown className="w-3 h-3" /></span>
            </div>
          </div>

          {/* Unrated captions */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-2xl">
                <CircleDot className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unrated Captions</h3>
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{data.unratedCount.toLocaleString()}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              of {data.totalCaptions} total
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${data.totalCaptions > 0 ? ((data.totalCaptions - data.unratedCount) / data.totalCaptions) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {data.totalCaptions > 0 ? Math.round(((data.totalCaptions - data.unratedCount) / data.totalCaptions) * 100) : 0}% rated
            </p>
          </div>
        </div>
      </div>

      {/* Approval rate by flavor */}
      {data.flavorData.length > 0 && (
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-100 p-3 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Approval Rate by Flavor</h2>
          </div>
          <div className="space-y-5">
            {data.flavorData.map((f, i) => (
              <div key={f.slug}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-300 w-4">{i + 1}</span>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{f.slug}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400">{f.total} votes</span>
                    <span className="text-sm font-black text-gray-900 w-10 text-right">{f.rate}%</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-400 rounded-l-full transition-all duration-500"
                    style={{ width: `${f.rate}%` }}
                  />
                  <div className="h-full bg-rose-300 flex-1 rounded-r-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top captions + Most active voters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Top rated captions */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Top Rated</h2>
          </div>
          <div className="space-y-5">
            {data.topCaptions.map((c: any, i: number) => (
              <div key={c.id} className="flex gap-4 items-start">
                <span className="text-2xl font-black text-gray-100 shrink-0 w-6 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm italic text-gray-700 leading-snug line-clamp-2">
                    &ldquo;{c.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                      ♥ {c.like_count || 0}
                    </span>
                  </div>
                </div>
                {c.images?.url && (
                  <img src={c.images.url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                )}
              </div>
            ))}
            {data.topCaptions.length === 0 && (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center py-8">No caption data yet</p>
            )}
          </div>
        </div>

        {/* Most active voters + controversial */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Users className="w-6 h-6 text-violet-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Most Active Voters</h2>
            </div>
            <div className="space-y-5">
              {data.topVoters.map((v, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-bold text-sm truncate max-w-[160px]">{v.name}</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                    {v.count} votes
                  </span>
                </div>
              ))}
              {data.topVoters.length === 0 && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center py-4">No voters yet</p>
              )}
            </div>
          </div>

          {/* Most controversial */}
          {data.controversial.length > 0 && (
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-rose-100 p-3 rounded-2xl">
                  <ThumbsUp className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Most Controversial</h2>
              </div>
              <div className="space-y-5">
                {data.controversial.map((item, i) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <span className="text-2xl font-black text-gray-100 shrink-0 w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm italic text-gray-700 leading-snug line-clamp-2">
                        &ldquo;{item.caption?.content}&rdquo;
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">
                        {item.total} votes · nearly 50/50
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
