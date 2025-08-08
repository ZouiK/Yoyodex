'use client'
import { useState, useEffect } from 'react'

export default function Admin() {
  const [clans, setClans] = useState([])
  const [kekkei, setKekkei] = useState([])

  useEffect(()=>{
    fetch('/api/clans').then(r=>r.json()).then(setClans)
    fetch('/api/kekkei').then(r=>r.json()).then(setKekkei)
  },[])

  const post = async (url, form) => {
    const data = Object.fromEntries(new FormData(form))
    await fetch(url, {
      method:'POST',
      credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
  }

  return (
    <main className="p-8 flex flex-col gap-8">
      <h1>⚔️ Admin Yoyodex</h1>

      <form onSubmit={e=>{ e.preventDefault(); post('/api/clans', e.target).then(()=>fetch('/api/clans').then(r=>r.json()).then(setClans)) }}>
        <h2>Créer Clan</h2>
        <input name="name" required placeholder="Nom"/>
        <textarea name="description" placeholder="Description"/>
        <input name="village_origin" placeholder="Village"/>
        <button type="submit">OK</button>
      </form>

      <form onSubmit={e=>{ e.preventDefault(); post('/api/kekkei', e.target).then(()=>fetch('/api/kekkei').then(r=>r.json()).then(setKekkei)) }}>
        <h2>Créer Kekkei Genkai</h2>
        <input name="name" required placeholder="Nom"/>
        <textarea name="description" placeholder="Description"/>
        <textarea name="abilities" placeholder="Capacités"/>
        <button type="submit">OK</button>
      </form>

      <form onSubmit={e=>{ e.preventDefault(); post('/api/ninjas', e.target) }}>
        <h2>Créer Ninja</h2>
        <input name="name" required placeholder="Nom"/>
        <input name="village" placeholder="Village"/>
        <select name="clan_id">
          <option value="">Sans clan</option>
          {clans.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="kekkei_id">
          <option value="">Sans kekkei</option>
          {kekkei.map(k=> <option key={k.id} value={k.id}>{k.name}</option>)}
        </select>
        <select name="grade">
          <option>Genin</option>
          <option>Chūnin</option>
          <option>Jōnin</option>
        </select>
        <textarea name="description" placeholder="Bio"/>
        <input name="image_url" placeholder="URL image"/>
        <button type="submit">OK</button>
      </form>
    </main>
  )
}
