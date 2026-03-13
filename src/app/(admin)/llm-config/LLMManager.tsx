'use client'

import { useState } from 'react'
import { Cpu, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Building2, Globe, ListTree, MessageSquareQuote, Clock, Coins, Activity } from 'lucide-react'
import { 
  createProvider, updateProvider, deleteProvider,
  createModel, updateModel, deleteModel 
} from './actions'

interface LLMManagerProps {
  providers: any[]
  models: any[]
  initialChains: any[]
  initialResponses: any[]
}

export default function LLMManager({ providers, models, initialChains, initialResponses }: LLMManagerProps) {
  const [activeTab, setActiveTab] = useState<'models' | 'providers' | 'chains' | 'responses'>('models')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (activeTab === 'providers') {
        if (editingItem) await updateProvider(editingItem.id, formData)
        else await createProvider(formData)
      } else if (activeTab === 'models') {
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
      alert('Delete failed. Ensure no dependencies exist.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-6 font-bold">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => setActiveTab('models')} className={`px-6 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'models' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}>Models</button>
          <button onClick={() => setActiveTab('providers')} className={`px-6 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'providers' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}>Providers</button>
          <button onClick={() => setActiveTab('chains')} className={`px-6 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'chains' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}>Prompt Chains</button>
          <button onClick={() => setActiveTab('responses')} className={`px-6 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'responses' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}>Model Responses</button>
        </div>

        {(activeTab === 'models' || activeTab === 'providers') && (
          <button
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 self-start"
          >
            <Plus className="w-5 h-5" />
            Add {activeTab === 'models' ? 'Model' : 'Provider'}
          </button>
        )}
      </div>

      {activeTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-100 p-3 rounded-2xl"><Cpu className="w-6 h-6 text-slate-600" /></div>
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
          ))}
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl"><Globe className="w-6 h-6 text-indigo-600" /></div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(provider); setIsModalOpen(true); }} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { setDeletingId(provider.id); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{provider.name}</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block italic">{provider.slug}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chains' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Chain ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Request Ref</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialChains.map((chain) => (
                <tr key={chain.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><ListTree className="w-4 h-4" /></div>
                      <span className="font-bold text-gray-900">{chain.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">Request #{chain.caption_request_id}</td>
                  <td className="px-8 py-6 text-right text-xs text-gray-400 font-bold">{new Date(chain.created_datetime_utc).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'responses' && (
        <div className="space-y-4">
          {initialResponses.map((res) => (
            <div key={res.id} onClick={() => setSelectedLog(res)} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0 bg-slate-100 p-4 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-black text-gray-900 uppercase">Flavor: {res.humor_flavors?.slug || 'N/A'}</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-0.5 bg-emerald-50 rounded-lg">{res.llm_models?.name}</span>
                </div>
                <p className="text-sm text-gray-500 truncate italic">&ldquo;{res.response_content}&rdquo;</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {res.latency ? `${res.latency}ms` : '-'}</div>
                <div className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> {res.total_tokens || 0}</div>
                <div className="w-32 text-right">{new Date(res.created_datetime_utc).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl font-bold">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-gray-900 mb-8">{editingItem ? 'Edit' : 'Add'} {activeTab === 'models' ? 'Model' : 'Provider'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Display Name</label>
                <input name="name" defaultValue={editingItem?.name} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm" placeholder="e.g. GPT-4" required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">System Slug</label>
                <input name="slug" defaultValue={editingItem?.slug} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-mono" placeholder="e.g. gpt-4" required />
              </div>
              {activeTab === 'models' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Provider</label>
                  <select name="llm_provider_id" defaultValue={editingItem?.llm_provider_id} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm appearance-none" required>
                    {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-2xl py-5 px-8 font-black text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-xl">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Save Entry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Response Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="bg-white w-full max-w-4xl rounded-[40px] p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedLog(null)} className="absolute top-10 right-10 text-gray-400 hover:text-gray-900"><X className="w-8 h-8" /></button>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-slate-900 text-white p-4 rounded-3xl"><Activity className="w-8 h-8" /></div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Response Trace</h2>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                  <span>ID: {selectedLog.id}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span>{new Date(selectedLog.created_datetime_utc).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">System Prompt</label>
                  <p className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{selectedLog.prompt_system || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">User Prompt</label>
                  <p className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{selectedLog.prompt_user}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 h-full">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4">Model Output</label>
                  <p className="text-lg font-bold text-gray-900 leading-relaxed italic">&ldquo;{selectedLog.response_content}&rdquo;</p>
                  
                  <div className="mt-12 pt-8 border-t border-amber-200/50 grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">Tokens</span>
                      <span className="text-xl font-black text-gray-900">{selectedLog.total_tokens || 0}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">Latency</span>
                      <span className="text-xl font-black text-gray-900">{selectedLog.latency}ms</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">Cost</span>
                      <span className="text-xl font-black text-gray-900">${selectedLog.cost || '0.00'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">Model</span>
                      <span className="text-sm font-black text-gray-900 uppercase truncate block">{selectedLog.llm_models?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Shared) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl text-center">
            <div className="bg-red-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Are you sure?</h2>
            <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed">Deleting this configuration will permanently remove it from the system.</p>
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
