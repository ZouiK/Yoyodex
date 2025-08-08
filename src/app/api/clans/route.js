import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('clans').select('*')
  return new Response(JSON.stringify(error?{error}:data), {
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}

export async function POST(req) {
  const { name, description, village_origin } = await req.json()
  const { data, error } = await supabase
    .from('clans')
    .insert([{ name, description, village_origin }])
  return new Response(JSON.stringify(error?{error}:data[0]), {
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}
