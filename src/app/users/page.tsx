import { supabase } from '@/lib/supabase'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getUsers() {
  // We use profiles table from the schema.sql
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_datetime_utc', { ascending: false })
  
  if (error) {
    return { data: null, error }
  }
  return { data, error: null }
}

export default async function UsersPage() {
  const { data: users, error } = await getUsers()

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

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 flex items-start gap-4 text-red-700">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-1">Database Error</h3>
            <p className="text-sm opacity-90">{error.message}</p>
            <p className="mt-4 text-xs font-mono bg-white/50 p-2 rounded-lg">
              Code: {error.code}
            </p>
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
              {users && users.map((user) => (
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
              {(!users || users.length === 0) && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 p-4 rounded-3xl">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-gray-500 font-medium">No users found in the "profiles" table.</div>
                      <p className="text-sm text-gray-400 max-w-md mx-auto">
                        If you have data but it's not showing, check your Row Level Security (RLS) policies in Supabase or use the Service Role Key.
                      </p>
                    </div>
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
