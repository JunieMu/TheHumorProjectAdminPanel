'use client'

import { useState } from 'react'
import { Image as ImageIcon, Plus, Pencil, Trash2, X, Loader2, Upload, ExternalLink } from 'lucide-react'
import { createImage, updateImage, deleteImage, uploadImageFile } from './actions'

interface ImageGridProps {
  initialImages: any[]
}

export default function ImageGrid({ initialImages }: ImageGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingImage, setEditingImage] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (editingImage) {
        await updateImage(editingImage.id, formData)
      } else {
        await createImage(formData)
      }
      setIsModalOpen(false)
      setEditingImage(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    setIsDeleting(id)
    try {
      await deleteImage(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadProgress(true)
    try {
      const publicUrl = await uploadImageFile(file)
      // Set the URL input value
      const urlInput = document.getElementById('url-input') as HTMLInputElement
      if (urlInput) urlInput.value = publicUrl
    } catch (error) {
      alert('Upload failed. Ensure you have an "images" bucket in Supabase storage.')
    } finally {
      setUploadProgress(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Image Library</h1>
        <button
          onClick={() => {
            setEditingImage(null)
            setIsModalOpen(true)
          }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {initialImages.map((image) => (
          <div key={image.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              {image.url ? (
                <img 
                  src={image.url} 
                  alt={image.image_description || 'Humor Project Image'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setEditingImage(image)
                    setIsModalOpen(true)
                  }}
                  className="bg-white p-3 rounded-2xl text-gray-900 hover:scale-110 transition-transform shadow-lg"
                  title="Edit Image"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={isDeleting === image.id}
                  className="bg-white p-3 rounded-2xl text-red-600 hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                  title="Delete Image"
                >
                  {isDeleting === image.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
                {image.url && (
                  <a 
                    href={image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-3 rounded-2xl text-blue-600 hover:scale-110 transition-transform shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              {image.is_public && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  Public
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] text-sm leading-relaxed">
                {image.image_description || 'No description provided'}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {image.created_datetime_utc ? new Date(image.created_datetime_utc).toLocaleDateString() : 'Unknown'}
                </span>
                {image.is_common_use && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase">Common</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-black text-gray-900 mb-8">
              {editingImage ? 'Edit Image' : 'Add New Image'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Image Source
                </label>
                <div className="flex gap-4 mb-4">
                  <div className="flex-grow">
                    <input
                      id="url-input"
                      name="url"
                      defaultValue={editingImage?.url}
                      placeholder="Enter Image URL or Upload File"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                      required
                    />
                  </div>
                  <label className="bg-amber-100 p-4 rounded-2xl text-amber-600 cursor-pointer hover:bg-amber-200 transition-colors flex-shrink-0">
                    {uploadProgress ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploadProgress} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Description
                </label>
                <textarea
                  name="image_description"
                  defaultValue={editingImage?.image_description}
                  rows={3}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm resize-none"
                  placeholder="What is this image about?"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Additional Context
                </label>
                <textarea
                  name="additional_context"
                  defaultValue={editingImage?.additional_context}
                  rows={2}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-900 transition-all text-sm resize-none"
                  placeholder="Any extra metadata?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="is_public"
                    defaultChecked={editingImage ? editingImage.is_public : true}
                    className="w-5 h-5 rounded-lg border-none bg-white text-gray-900 focus:ring-0"
                  />
                  <span className="text-sm font-bold text-gray-700">Public</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="is_common_use"
                    defaultChecked={editingImage?.is_common_use}
                    className="w-5 h-5 rounded-lg border-none bg-white text-gray-900 focus:ring-0"
                  />
                  <span className="text-sm font-bold text-gray-700">Common Use</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white rounded-2xl py-5 px-8 font-black text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl shadow-gray-200"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingImage ? 'Save Changes' : 'Create Image'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
