import { supabase } from '@/lib/supabase'

export async function PATCH(req, { params }) {
  const id = params.id
  const body = await req.json()
  const update = {}
  if ('name' in body) update.name = String(body.name || '').trim()
  if ('description' in body) update.description = body.description || null
  if ('image_url' in body) update.image_url = body.image_url || null
  const { data, error } = await supabase.from('clans').update(update).eq('id', id).select().single()
  return new Response(JSON.stringify(error ? { error: error.message } : data), { status: error ? 500 : 200 })
}

export async function DELETE(req, { params }) {
  const id = params.id
  const { error } = await supabase.from('clans').delete().eq('id', id)
  return new Response(JSON.stringify(error ? { error: error.message } : { ok: true }), { status: error ? 500 : 200 })
}
