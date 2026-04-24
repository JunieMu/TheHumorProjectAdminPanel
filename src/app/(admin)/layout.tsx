import SignOutButton from '@/components/SignOutButton'
import { LayoutDashboard, Users, Image as ImageIcon, MessageSquare, ShieldCheck, FileText, Send, Zap, Sliders, Cpu, BookOpen, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/users', label: 'Users', icon: Users },
    { href: '/images', label: 'Images', icon: ImageIcon },
    { href: '/captions', label: 'Captions', icon: MessageSquare },
    { href: '/humor-engine', label: 'Engine', icon: Zap },
    { href: '/humor-mix', label: 'Mix', icon: Sliders },
    { href: '/llm-config', label: 'LLM', icon: Cpu },
    { href: '/access-control', label: 'Access', icon: ShieldCheck },
    { href: '/caption-requests', label: 'Requests', icon: Send },
    { href: '/caption-examples', label: 'Examples', icon: FileText },
    { href: '/terms', label: 'Terms', icon: BookOpen },
    { href: '/ratings', label: 'Ratings', icon: ThumbsUp },
  ]

  return (
    <div className="min-h-screen bg-[#FAF4EA]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="bg-gray-900 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-gray-900 text-lg tracking-tight hidden lg:inline-block">Humor Admin</span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1 font-bold text-gray-500 text-[13px]">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="px-3 py-2 hover:text-gray-900 transition-colors flex items-center gap-2 rounded-lg hover:bg-gray-50"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-6 w-px bg-gray-100 hidden md:block" />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="py-8">
        {children}
      </main>
      
      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest border-t border-gray-100 mt-12">
        &copy; {new Date().getFullYear()} The Humor Project &bull; Admin Management Suite
      </footer>
    </div>
  )
}
