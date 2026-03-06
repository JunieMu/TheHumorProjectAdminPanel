'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl font-bold text-gray-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
    >
      {isSigningOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {isSigningOut ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
