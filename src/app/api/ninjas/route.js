import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('ninjas').select('*')
  return new Response(JSON.stringify(error?{error}:data), {
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}

export async function POST(req) {
  const { name, village, clan_id, kekkei_id, grade, description, image_url } =
    await req.json()
  const { data, error } = await supabase
    .from('ninjas')
    .insert([{ name, village, clan_id, kekkei_id, grade, description, image_url }])
  return new Response(JSON.stringify(error?{error}:data[0]), {
    status: error?500:200, headers:{'Content-Type':'application/json'}
  })
}
