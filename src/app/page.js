import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: ninjas } = await supabase.from('ninjas').select('*')
  return (
    <div className="grid gap-8 p-8">
      {ninjas.map(n=>(
        <div key={n.id} className="card">
          <img src={n.image_url} alt={n.name}/>
          <h3>{n.name}</h3>
          <p>Village: {n.village}</p>
          <p>Clan: {n.clan_id||'Sans clan'}</p>
          <p>Grade: {n.grade}</p>
          <p>{n.description}</p>
        </div>
      ))}
    </div>
  )
}
