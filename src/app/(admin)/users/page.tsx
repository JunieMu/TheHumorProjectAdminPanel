import { createAdminClient } from '@/utils/supabase/admin'
import { ArrowLeft, User, AlertCircle, Database } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getDebugInfo() {
  const supabase = createAdminClient()
  
  // 1. Check profiles count
  const { count: profileCount, error: profileError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 2. Check auth users count (requires service role)
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  return {
    profileCount: profileCount || 0,
    authCount: authData?.users?.length || 0,
    profileError,
    authError,
    // Safely check if key is being picked up (first 5 chars)
    keyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keySnippet: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5)
  }
}

async function getUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_datetime_utc', { ascending: false })
  
  return { data: data || [], error }
}

export default async function UsersPage() {
  const { data: users, error } = await getUsers()
  const debug = await getDebugInfo()

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
        </div>
      </div>

      {/* Debug Panel - Only visible if no users */}
      {users.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4 text-blue-800 font-bold">
            <Database className="w-5 h-5" />
            Admin Debug Info
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-gray-500 block">Profiles Count</span>
              <span className="text-xl font-black">{debug.profileCount}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-gray-500 block">Auth Users Count</span>
              <span className="text-xl font-black">{debug.authCount}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-gray-500 block">Service Key Loaded</span>
              <span className={`text-xl font-black ${debug.keyPresent ? 'text-emerald-500' : 'text-red-500'}`}>
                {debug.keyPresent ? `Yes (${debug.keySnippet}...)` : 'No'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-gray-500 block">Profiles Table Status</span>
              <span className="text-xl font-black">{debug.profileError ? 'Error' : 'Empty but Valid'}</span>
            </div>
          </div>
          {debug.authCount > 0 && debug.profileCount === 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-xs">
              <strong>Tip:</strong> Found {debug.authCount} users in Auth but 0 in Profiles. This usually means you need to create a 
              Supabase Trigger to automatically insert a row into <code>public.profiles</code> when a user signs up.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 flex items-start gap-4 text-red-700">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-1">Database Error</h3>
            <p className="text-sm opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Superadmin</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-xl">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.first_name || 'Unnamed'} {user.last_name || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email || 'No email'}</td>
                  <td className="px-6 py-4">
                    {user.is_superadmin ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Yes</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {user.created_datetime_utc ? new Date(user.created_datetime_utc).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="text-gray-500 font-medium">No users found in the "profiles" table.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
