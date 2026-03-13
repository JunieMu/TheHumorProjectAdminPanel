'use client'

import { useState } from 'react'
import { Save, Loader2, Minus, Plus, SlidersHorizontal } from 'lucide-react'
import { updateHumorMix } from './actions'

interface HumorMixListProps {
  initialMix: any[]
}

export default function HumorMixList({ initialMix }: HumorMixListProps) {
  const [mix, setMix] = useState(initialMix)
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleCountChange = (id: string, delta: number) => {
    setMix(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, caption_count: Math.max(0, item.caption_count + delta) }
      }
      return item
    }))
  }

  const handleSave = async (id: string, count: number) => {
    setSavingId(id)
    try {
      await updateHumorMix(id, count)
    } catch (error) {
      alert('Failed to update: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mix.map((item) => (
        <div key={item.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 group">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                {item.humor_flavors?.slug || 'Unknown'}
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Flavor Mix ID: {item.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Caption Count (Per Batch)
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleCountChange(item.id, -1)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-grow bg-gray-50 rounded-2xl h-12 flex items-center justify-center font-black text-2xl text-gray-900">
                  {item.caption_count}
                </div>
                <button
                  onClick={() => handleCountChange(item.id, 1)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => handleSave(item.id, item.caption_count)}
              disabled={savingId === item.id}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 px-6 font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
            >
              {savingId === item.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Configuration
            </button>
          </div>
        </div>
      ))}

      {mix.length === 0 && (
        <div className="col-span-full py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No mix configurations found.</p>
        </div>
      )}
    </div>
  )
}
