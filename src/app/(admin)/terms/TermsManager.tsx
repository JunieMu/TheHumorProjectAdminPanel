'use client'

import { useState } from 'react'
import { BookOpen, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Star, Tag } from 'lucide-react'
import { createTerm, updateTerm, deleteTerm } from './actions'

interface TermsManagerProps {
  initialTerms: any[]
  termTypes: any[]
}

export default function TermsManager({ initialTerms, termTypes }: TermsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (editingItem) {
        await updateTerm(editingItem.id, formData)
      } else {
        await createTerm(formData)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (itemToDelete === null) return
    setIsSubmitting(true)
    try {
      await deleteTerm(itemToDelete)
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Glossary Terms</h1>
        <button
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Plus className="w-5 h-5" />
          Add Term
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialTerms.map((item) => (
          <div key={item.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-cyan-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingItem(item)
                    setIsModalOpen(true)
                  }}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item.id)
                    setIsDeleteModalOpen(true)
                  }}
                  className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-gray-900">{item.term}</h3>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                    {item.term_types?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.definition}</p>
              </div>

              {item.example && (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Example</span>
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    &ldquo;{item.example}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Star className={`w-3 h-3 ${item.priority > 0 ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                Priority: {item.priority}
              </div>
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">ID: {item.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-gray-900 mb-8">{editingItem ? 'Edit Term' : 'Add New Term'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Term</label>
                  <input name="term" defaultValue={editingItem?.term} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold" placeholder="e.g. Pun" required />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Type</label>
                  <select name="term_type_id" defaultValue={editingItem?.term_type_id} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm font-bold appearance-none" required>
                    {termTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Definition</label>
                <textarea name="definition" defaultValue={editingItem?.definition} rows={3} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm resize-none" placeholder="What does this mean?" required />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Example Usage</label>
                <textarea name="example" defaultValue={editingItem?.example} rows={2} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm resize-none italic" placeholder="Provide an example..." />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Priority</label>
                <input type="number" name="priority" defaultValue={editingItem?.priority || 0} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-2xl py-5 px-8 font-black text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-xl shadow-gray-200">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingItem ? 'Save Changes' : 'Create Term'}
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
            <h2 className="text-3xl font-black text-gray-900 mb-4">Delete Term?</h2>
            <p className="text-gray-500 mb-10 text-lg">This will remove this term from the glossary. This cannot be undone.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-100 text-gray-900 rounded-2xl py-4 px-6 font-bold hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="bg-red-600 text-white rounded-2xl py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
