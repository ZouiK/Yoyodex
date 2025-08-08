import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('kekkei_genkai').select('*')
  return new Response(JSON.stringify(error?{error}:data), {
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}

export async function POST(req) {
  const { name, description, abilities } = await req.json()
  const { data, error } = await supabase
    .from('kekkei_genkai')
    .insert([{ name, description, abilities }])
  return new Response(JSON.stringify(error?{error}:data[0]),{
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}
