'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createExample(formData: FormData) {
  const supabase = createAdminClient()
  
  const image_description = formData.get('image_description') as string
  const caption = formData.get('caption') as string
  const explanation = formData.get('explanation') as string
  const priority = parseInt(formData.get('priority') as string) || 0
  const image_id = formData.get('image_id') as string || null

  const { error } = await supabase
    .from('caption_examples')
    .insert([{
      image_description,
      caption,
      explanation,
      priority,
      image_id,
      created_datetime_utc: new Date().toISOString()
    }])

  if (error) throw new Error(error.message)
  
  revalidatePath('/caption-examples')
  revalidatePath('/')
}

export async function updateExample(id: string, formData: FormData) {
  const supabase = createAdminClient()
  
  const image_description = formData.get('image_description') as string
  const caption = formData.get('caption') as string
  const explanation = formData.get('explanation') as string
  const priority = parseInt(formData.get('priority') as string) || 0
  const image_id = formData.get('image_id') as string || null

  const { error } = await supabase
    .from('caption_examples')
    .update({
      image_description,
      caption,
      explanation,
      priority,
      image_id,
      modified_datetime_utc: new Date().toISOString()
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/caption-examples')
}

export async function deleteExample(id: string) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('caption_examples')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/caption-examples')
  revalidatePath('/')
}
