'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// Domain Actions
export async function createDomain(formData: FormData) {
  const supabase = createAdminClient()
  const domain_name = formData.get('domain_name') as string

  const { error } = await supabase
    .from('allowed_signup_domains')
    .insert([{ domain_name, created_datetime_utc: new Date().toISOString() }])

  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
  revalidatePath('/')
}

export async function updateDomain(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const domain_name = formData.get('domain_name') as string

  const { error } = await supabase
    .from('allowed_signup_domains')
    .update({ domain_name, modified_datetime_utc: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
}

export async function deleteDomain(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('allowed_signup_domains').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
  revalidatePath('/')
}

// Email Actions
export async function createEmail(formData: FormData) {
  const supabase = createAdminClient()
  const email_address = formData.get('email_address') as string

  const { error } = await supabase
    .from('whitelist_email_addresses')
    .insert([{ email_address, created_datetime_utc: new Date().toISOString() }])

  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
  revalidatePath('/')
}

export async function updateEmail(id: number, formData: FormData) {
  const supabase = createAdminClient()
  const email_address = formData.get('email_address') as string

  const { error } = await supabase
    .from('whitelist_email_addresses')
    .update({ email_address, modified_datetime_utc: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
}

export async function deleteEmail(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('whitelist_email_addresses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/access-control')
  revalidatePath('/')
}
