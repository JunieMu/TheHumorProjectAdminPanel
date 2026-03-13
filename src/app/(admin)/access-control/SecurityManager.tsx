'use client'

import { useState, useEffect } from 'react'
import { Globe, Mail, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  createDomain, updateDomain, deleteDomain,
  createEmail, updateEmail, deleteEmail 
} from './actions'

interface SecurityManagerProps {
  domains: any[]
  emails: any[]
}

export default function SecurityManager({ domains, emails }: SecurityManagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as 'domains' | 'emails' || 'domains'
  
  const [activeTab, setActiveTab] = useState<'domains' | 'emails'>(initialTab)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync tab with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', activeTab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [activeTab])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (activeTab === 'domains') {
        if (editingItem) await updateDomain(editingItem.id, formData)
        else await createDomain(formData)
      } else {
        if (editingItem) await updateEmail(editingItem.id, formData)
        else await createEmail(formData)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Action failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (deletingId === null) return
    setIsSubmitting(true)
    try {
      if (activeTab === 'domains') await deleteDomain(deletingId)
      else await deleteEmail(deletingId)
      setIsDeleteModalOpen(false)
      setDeletingId(null)
    } catch (error) {
      alert('Delete failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('domains')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'domains' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <Globe className="w-4 h-4" />
            Allowed Domains ({domains.length})
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'emails' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <Mail className="w-4 h-4" />
            Whitelist Emails ({emails.length})
          </button>
        </div>

        <button
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'domains' ? 'Domain' : 'Email'}
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-8 py-6">{activeTab === 'domains' ? 'Domain Name' : 'Email Address'}</th>
              <th className="px-8 py-6">Created At</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(activeTab === 'domains' ? domains : emails).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`${activeTab === 'domains' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                      {activeTab === 'domains' ? <Globe className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="block font-black text-gray-900 text-lg">{activeTab === 'domains' ? item.domain_name : item.email_address}</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">ID: {item.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-gray-500">
                    {new Date(item.created_datetime_utc).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setDeletingId(item.id); setIsDeleteModalOpen(true); }}
                      className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(activeTab === 'domains' ? domains : emails).length === 0 && (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                  No {activeTab} configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Access Grant Info */}
      <div className="mt-8 bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 flex items-start gap-6">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-emerald-900 font-black uppercase tracking-tight text-sm mb-1">Access Logic</h4>
          <p className="text-emerald-700/80 text-sm leading-relaxed max-w-2xl font-medium">
            Users can sign up if their email address is specifically whitelisted **OR** if their email domain is in the allowed list. 
            Whitelisted emails take precedence for individual access control.
          </p>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-gray-900 mb-8">
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'domains' ? 'Domain' : 'Email'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  {activeTab === 'domains' ? 'Domain (e.g. university.edu)' : 'Email Address'}
                </label>
                <input 
                  name={activeTab === 'domains' ? 'domain_name' : 'email_address'} 
                  defaultValue={activeTab === 'domains' ? editingItem?.domain_name : editingItem?.email_address} 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold" 
                  placeholder={activeTab === 'domains' ? 'mit.edu' : 'user@example.com'}
                  required 
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-2xl py-5 px-8 font-black text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-xl">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Save Access Rule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl text-center">
            <div className="bg-red-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Revoke Access?</h2>
            <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed">This rule will be removed immediately. Affected users may no longer be able to sign up.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-100 text-gray-900 rounded-2xl py-4 px-6 font-bold hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 text-white rounded-2xl py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />} Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
