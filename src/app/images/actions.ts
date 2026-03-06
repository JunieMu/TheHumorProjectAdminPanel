'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createImage(formData: FormData) {
  const supabase = createAdminClient()
  
  const url = formData.get('url') as string
  const image_description = formData.get('image_description') as string
  const is_public = formData.get('is_public') === 'on'
  const is_common_use = formData.get('is_common_use') === 'on'
  const additional_context = formData.get('additional_context') as string

  const { error } = await supabase
    .from('images')
    .insert([{
      url,
      image_description,
      is_public,
      is_common_use,
      additional_context,
      created_datetime_utc: new Date().toISOString()
    }])

  if (error) throw new Error(error.message)
  
  revalidatePath('/images')
  revalidatePath('/')
}

export async function updateImage(id: string, formData: FormData) {
  const supabase = createAdminClient()
  
  const url = formData.get('url') as string
  const image_description = formData.get('image_description') as string
  const is_public = formData.get('is_public') === 'on'
  const is_common_use = formData.get('is_common_use') === 'on'
  const additional_context = formData.get('additional_context') as string

  const { error } = await supabase
    .from('images')
    .update({
      url,
      image_description,
      is_public,
      is_common_use,
      additional_context,
      modified_datetime_utc: new Date().toISOString()
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/images')
}

export async function deleteImage(id: string) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/images')
  revalidatePath('/')
}

export async function uploadImageFile(file: File) {
  const supabase = createAdminClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  // Ensure 'images' bucket exists in your Supabase storage
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrl
}
