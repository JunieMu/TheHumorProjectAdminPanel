'use client'

import { useState } from 'react'
import { Cpu, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Building2, Globe } from 'lucide-react'
import { 
  createProvider, updateProvider, deleteProvider,
  createModel, updateModel, deleteModel 
} from './actions'

interface LLMManagerProps {
  providers: any[]
  models: any[]
}

export default function LLMManager({ providers, models }: LLMManagerProps) {
  const [activeTab, setActiveTab] = useState<'models' | 'providers'>('models')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (activeTab === 'providers') {
        if (editingItem) await updateProvider(editingItem.id, formData)
        else await createProvider(formData)
      } else {
        if (editingItem) await updateModel(editingItem.id, formData)
        else await createModel(formData)
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
      if (activeTab === 'providers') await deleteProvider(deletingId)
      else await deleteModel(deletingId)
      setIsDeleteModalOpen(false)
      setDeletingId(null)
    } catch (error) {
      alert('Delete failed. Ensure no dependencies exist (e.g., models using this provider).')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 self-start">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'models' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Models ({models.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'providers' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Providers ({providers.length})
          </button>
        </div>

        <button
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'models' ? 'Model' : 'Provider'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'models' ? (
          models.map((model) => (
            <div key={model.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-100 p-3 rounded-2xl">
                  <Cpu className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(model); setIsModalOpen(true); }} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { setDeletingId(model.id); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{model.name}</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4 italic">{model.slug}</span>
              <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Provider: {model.llm_providers?.name || 'Unknown'}</span>
              </div>
            </div>
          ))
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(provider); setIsModalOpen(true); }} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { setDeletingId(provider.id); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{provider.name}</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block italic">{provider.slug}</span>
            </div>
          ))
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-gray-900 mb-8">{editingItem ? 'Edit' : 'Add'} {activeTab === 'models' ? 'Model' : 'Provider'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Display Name</label>
                <input name="name" defaultValue={editingItem?.name} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold" placeholder="e.g. GPT-4 Turbo" required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">System Slug (Unique)</label>
                <input name="slug" defaultValue={editingItem?.slug} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-mono" placeholder="e.g. gpt-4-turbo" required />
              </div>
              {activeTab === 'models' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Provider</label>
                  <select name="llm_provider_id" defaultValue={editingItem?.llm_provider_id} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold appearance-none" required>
                    {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-2xl py-5 px-8 font-black text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-xl shadow-gray-200">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingItem ? 'Save Changes' : 'Create Entry'}
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
            <h2 className="text-3xl font-black text-gray-900 mb-4">Are you sure?</h2>
            <p className="text-gray-500 mb-10 text-lg">Deleting this will permanently remove it from the system configuration.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-100 text-gray-900 rounded-2xl py-4 px-6 font-bold hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 text-white rounded-2xl py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
