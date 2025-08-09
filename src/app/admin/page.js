'use client'

import { useEffect, useMemo, useState } from 'react'

async function api(path, init) {
  const res = await fetch(`/api/${path}`, init)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

const emptyNinja = { id: null, name: '', village: '', clan_id: null, kekkei_id: null, grade: '', description: '', image_url: '' }
const emptyClan = { id: null, name: '', description: '', image_url: '' }
const emptyKekkei = { id: null, name: '', description: '', image_url: '' }

export default function Admin() {
  const [ninjas, setNinjas] = useState([])
  const [clans, setClans] = useState([])
  const [kekkeis, setKekkeis] = useState([])
  const [ninjaForm, setNinjaForm] = useState(emptyNinja)
  const [clanForm, setClanForm] = useState(emptyClan)
  const [kekkeiForm, setKekkeiForm] = useState(emptyKekkei)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const clanOptions = useMemo(() => [{ id: null, name: 'Sans clan' }, ...clans], [clans])
  const kekkeiOptions = useMemo(() => [{ id: null, name: 'Sans kekkei' }, ...kekkeis], [kekkeis])

  const loadAll = async () => {
    setError('')
    try {
      const [n, c, k] = await Promise.all([
        api('ninjas', { cache: 'no-store' }),
        api('clans', { cache: 'no-store' }),
        api('kekkei_genkai', { cache: 'no-store' }),
      ])
      setNinjas(n); setClans(c); setKekkeis(k)
    } catch (e) { setError(e.message || 'Erreur') }
  }

  useEffect(() => { loadAll() }, [])

  const onSubmitNinja = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const payload = { ...ninjaForm, clan_id: ninjaForm.clan_id || null, kekkei_id: ninjaForm.kekkei_id || null }
      if (ninjaForm.id) await api(`ninjas/${ninjaForm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      else await api('ninjas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      setNinjaForm(emptyNinja); await loadAll()
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const onDeleteNinja = async (id) => {
    setLoading(true); setError('')
    try { await api(`ninjas/${id}`, { method: 'DELETE' }); await loadAll() } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const onSubmitClan = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (clanForm.id) await api(`clans/${clanForm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clanForm) })
      else await api('clans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clanForm) })
      setClanForm(emptyClan); await loadAll()
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const onDeleteClan = async (id) => {
    setLoading(true); setError('')
    try { await api(`clans/${id}`, { method: 'DELETE' }); await loadAll() } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const onSubmitKekkei = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (kekkeiForm.id) await api(`kekkei_genkai/${kekkeiForm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kekkeiForm) })
      else await api('kekkei_genkai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kekkeiForm) })
      setKekkeiForm(emptyKekkei); await loadAll()
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const onDeleteKekkei = async (id) => {
    setLoading(true); setError('')
    try { await api(`kekkei_genkai/${id}`, { method: 'DELETE' }); await loadAll() } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      {error ? <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-3 py-2">{error}</div> : null}
      <section className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmitNinja} className="space-y-4 border rounded-xl bg-white p-4">
          <h2 className="text-lg font-medium">Ninja</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm">Nom</span>
              <input required className="border rounded-md px-3 py-2" value={ninjaForm.name} onChange={e=>setNinjaForm(v=>({...v,name:e.target.value}))}/>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">Village</span>
              <input className="border rounded-md px-3 py-2" value={ninjaForm.village} onChange={e=>setNinjaForm(v=>({...v,village:e.target.value}))}/>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">Clan</span>
              <select className="border rounded-md px-3 py-2" value={ninjaForm.clan_id ?? ''} onChange={e=>setNinjaForm(v=>({...v,clan_id:e.target.value?e.target.value:null}))}>
                {clanOptions.map(c=><option key={String(c.id)} value={c.id??''}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">Kekkei</span>
              <select className="border rounded-md px-3 py-2" value={ninjaForm.kekkei_id ?? ''} onChange={e=>setNinjaForm(v=>({...v,kekkei_id:e.target.value?e.target.value:null}))}>
                {kekkeiOptions.map(k=><option key={String(k.id)} value={k.id??''}>{k.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm">Grade</span>
              <input className="border rounded-md px-3 py-2" value={ninjaForm.grade} onChange={e=>setNinjaForm(v=>({...v,grade:e.target.value}))}/>
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm">Image URL</span>
              <input className="border rounded-md px-3 py-2" placeholder="https://..." value={ninjaForm.image_url} onChange={e=>setNinjaForm(v=>({...v,image_url:e.target.value}))}/>
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm">Description</span>
              <textarea className="border rounded-md px-3 py-2 min-h-[100px]" value={ninjaForm.description} onChange={e=>setNinjaForm(v=>({...v,description:e.target.value}))}/>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={loading} className="px-4 py-2 rounded-lg bg-neutral-900 text-white">{ninjaForm.id?'Mettre à jour':'Créer'}</button>
            {ninjaForm.id ? <button type="button" onClick={()=>setNinjaForm(emptyNinja)} className="px-4 py-2 rounded-lg border">Annuler</button> : null}
          </div>
        </form>

        <div className="space-y-4">
          <div className="border rounded-xl bg-white p-4">
            <h2 className="text-lg font-medium mb-3">Clans</h2>
            <form onSubmit={onSubmitClan} className="grid gap-3">
              <input required className="border rounded-md px-3 py-2" placeholder="Nom" value={clanForm.name} onChange={e=>setClanForm(v=>({...v,name:e.target.value}))}/>
              <input className="border rounded-md px-3 py-2" placeholder="Image URL" value={clanForm.image_url} onChange={e=>setClanForm(v=>({...v,image_url:e.target.value}))}/>
              <textarea className="border rounded-md px-3 py-2" placeholder="Description" value={clanForm.description} onChange={e=>setClanForm(v=>({...v,description:e.target.value}))}/>
              <div className="flex items-center gap-2">
                <button disabled={loading} className="px-4 py-2 rounded-lg bg-neutral-900 text-white">{clanForm.id?'Mettre à jour':'Créer'}</button>
                {clanForm.id ? <button type="button" onClick={()=>setClanForm(emptyClan)} className="px-4 py-2 rounded-lg border">Annuler</button> : null}
              </div>
            </form>
            <ul className="mt-4 divide-y">
              {clans.map(c=>(
                <li key={c.id} className="py-2 flex items-center justify-between">
                  <span>{c.name}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>setClanForm(c)} className="px-3 py-1 rounded border">Éditer</button>
                    <button onClick={()=>onDeleteClan(c.id)} className="px-3 py-1 rounded bg-red-600 text-white">Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-xl bg-white p-4">
            <h2 className="text-lg font-medium mb-3">Kekkei</h2>
            <form onSubmit={onSubmitKekkei} className="grid gap-3">
              <input required className="border rounded-md px-3 py-2" placeholder="Nom" value={kekkeiForm.name} onChange={e=>setKekkeiForm(v=>({...v,name:e.target.value}))}/>
              <input className="border rounded-md px-3 py-2" placeholder="Image URL" value={kekkeiForm.image_url} onChange={e=>setKekkeiForm(v=>({...v,image_url:e.target.value}))}/>
              <textarea className="border rounded-md px-3 py-2" placeholder="Description" value={kekkeiForm.description} onChange={e=>setKekkeiForm(v=>({...v,description:e.target.value}))}/>
              <div className="flex items-center gap-2">
                <button disabled={loading} className="px-4 py-2 rounded-lg bg-neutral-900 text-white">{kekkeiForm.id?'Mettre à jour':'Créer'}</button>
                {kekkeiForm.id ? <button type="button" onClick={()=>setKekkeiForm(emptyKekkei)} className="px-4 py-2 rounded-lg border">Annuler</button> : null}
              </div>
            </form>
            <ul className="mt-4 divide-y">
              {kekkeis.map(k=>(
                <li key={k.id} className="py-2 flex items-center justify-between">
                  <span>{k.name}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>setKekkeiForm(k)} className="px-3 py-1 rounded border">Éditer</button>
                    <button onClick={()=>onDeleteKekkei(k.id)} className="px-3 py-1 rounded bg-red-600 text-white">Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border rounded-xl bg-white p-4">
        <h2 className="text-lg font-medium mb-4">Ninjas existants</h2>
        <div className="grid gap-3">
          {ninjas.map(n=>(
            <div key={n.id} className="flex items-center justify-between border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100">
                  {n.image_url ? <img src={n.image_url} alt={n.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                  <div className="font-medium">{n.name}</div>
                  <div className="text-sm text-neutral-600">{n.clan_id ? n.clan_id : 'Sans clan'} · {n.kekkei_id ? n.kekkei_id : 'Sans kekkei'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setNinjaForm({
                  id:n.id,name:n.name||'',village:n.village||'',clan_id:n.clan_id??null,kekkei_id:n.kekkei_id??null,grade:n.grade||'',description:n.description||'',image_url:n.image_url||'',
                })} className="px-3 py-1 rounded border">Éditer</button>
                <button onClick={()=>onDeleteNinja(n.id)} className="px-3 py-1 rounded bg-red-600 text-white">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
