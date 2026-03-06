import SignOutButton from '@/components/SignOutButton'
import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF4EA]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gray-900 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">Humor Admin</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 font-bold text-gray-500 text-sm">
              <Link href="/users" className="px-4 py-2 hover:text-gray-900 transition-colors">Users</Link>
              <Link href="/images" className="px-4 py-2 hover:text-gray-900 transition-colors">Images</Link>
              <Link href="/captions" className="px-4 py-2 hover:text-gray-900 transition-colors">Captions</Link>
            </nav>
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
