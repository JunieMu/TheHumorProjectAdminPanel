'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateHumorMix(id: string, captionCount: number) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('humor_flavor_mix')
    .update({ caption_count: captionCount })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/humor-mix')
  revalidatePath('/')
}
