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

export async function createTerm(formData: FormData) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  
  const term = formData.get('term') as string
  const definition = formData.get('definition') as string
  const example = formData.get('example') as string
  const priority = parseInt(formData.get('priority') as string) || 0
  const term_type_id = parseInt(formData.get('term_type_id') as string)

  const { error } = await supabase
    .from('terms')
    .insert([{
      term,
      definition,
      example,
      priority,
      term_type_id,
      created_by_user_id: userId,
      modified_by_user_id: userId
    }])

  if (error) throw new Error(error.message)
  
  revalidatePath('/terms')
  revalidatePath('/')
}

export async function updateTerm(id: number, formData: FormData) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  
  const term = formData.get('term') as string
  const definition = formData.get('definition') as string
  const example = formData.get('example') as string
  const priority = parseInt(formData.get('priority') as string) || 0
  const term_type_id = parseInt(formData.get('term_type_id') as string)

  const { error } = await supabase
    .from('terms')
    .update({
      term,
      definition,
      example,
      priority,
      term_type_id,
      modified_by_user_id: userId
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/terms')
}

export async function deleteTerm(id: number) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('terms')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/terms')
  revalidatePath('/')
}
