export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: ninjas = [] } = await supabase
    .from('ninjas')
    .select('id,name,village,clan_id,kekkei_id,grade,description,image_url')
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Liste des ninjas</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ninjas.map(n => (
          <li key={n.id} className="border rounded-xl bg-white p-4 flex flex-col gap-3">
            <div className="w-full aspect-video overflow-hidden rounded-lg bg-neutral-100">
              {n.image_url ? <img src={n.image_url} alt={n.name} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium">{n.name}</div>
              <div className="text-sm text-neutral-600">Village: {n.village || '—'}</div>
              <div className="text-sm text-neutral-600">Clan: {n.clan_id ? n.clan_id : 'Sans clan'}</div>
              <div className="text-sm text-neutral-600">Kekkei: {n.kekkei_id ? n.kekkei_id : 'Sans kekkei'}</div>
              <div className="text-sm text-neutral-600">Grade: {n.grade || '—'}</div>
              <p className="text-sm">{n.description || ''}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
