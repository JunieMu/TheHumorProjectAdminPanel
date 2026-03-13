'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// Provider Actions
export async function createProvider(formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  const { error } = await supabase.from('llm_providers').insert([{ name, slug }])
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function updateProvider(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  const { error } = await supabase.from('llm_providers').update({ name, slug }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function deleteProvider(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('llm_providers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

// Model Actions
export async function createModel(formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)

  const { error } = await supabase.from('llm_models').insert([{ name, slug, llm_provider_id }])
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function updateModel(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)

  const { error } = await supabase.from('llm_models').update({ name, slug, llm_provider_id }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function deleteModel(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('llm_models').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}
