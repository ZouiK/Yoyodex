import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('ninjas')
    .select('*')
    .order('name', { ascending: true })
  return new Response(JSON.stringify(error ? [] : data), { status: error ? 500 : 200 })
}

export async function POST(req) {
  const body = await req.json()
  if (!body?.name) return new Response(JSON.stringify({ error: 'name requis' }), { status: 400 })
  const payload = {
    name: String(body.name).trim(),
    village: body.village || null,
    clan_id: body.clan_id || null,
    kekkei_id: body.kekkei_id || null,
    grade: body.grade || null,
    description: body.description || null,
    image_url: body.image_url || null,
  }
  const { data, error } = await supabase.from('ninjas').insert(payload).select().single()
  return new Response(JSON.stringify(error ? { error: error.message } : data), { status: error ? 500 : 201 })
}
