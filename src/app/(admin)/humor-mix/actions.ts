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

export async function updateHumorMix(id: string, captionCount: number) {
  const userId = await getCurrentUserId()
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('humor_flavor_mix')
    .update({ 
      caption_count: captionCount,
      modified_by_user_id: userId
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/humor-mix')
  revalidatePath('/')
}
