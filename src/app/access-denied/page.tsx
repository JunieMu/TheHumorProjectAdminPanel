import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AccessDenied() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div className="w-full max-w-md bg-white rounded-[40px] p-12 shadow-sm border border-gray-100">
        <div className="bg-red-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-12 text-lg">
          Your account does not have superadmin privileges. Please contact the administrator if you believe this is an error.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-900 font-bold hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Sign In
        </Link>
      </div>
    </main>
  )
}
