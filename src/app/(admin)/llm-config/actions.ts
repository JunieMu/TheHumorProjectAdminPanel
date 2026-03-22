'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getCurrentUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

// Provider Actions
export async function createProvider(formData: FormData) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  const { error } = await supabase.from('llm_providers').insert([{ 
    name, 
    slug,
    created_by_user_id: userId,
    modified_by_user_id: userId
  }])
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function updateProvider(id: number, formData: FormData) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  const { error } = await supabase.from('llm_providers').update({ 
    name, 
    slug,
    modified_by_user_id: userId
  }).eq('id', id)
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
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)

  const { error } = await supabase.from('llm_models').insert([{ 
    name, 
    slug, 
    llm_provider_id,
    created_by_user_id: userId,
    modified_by_user_id: userId
  }])
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function updateModel(id: number, formData: FormData) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)

  const { error } = await supabase.from('llm_models').update({ 
    name, 
    slug, 
    llm_provider_id,
    modified_by_user_id: userId
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}

export async function deleteModel(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('llm_models').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/llm-config')
}
