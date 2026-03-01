import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('opportunities').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setOpportunities(data)
    })
  }, [user])

  return (
    <div style={{ padding: '2rem', direction: 'rtl', fontFamily: 'Arial' }}>
      <h1>SkillLink - לוח בקרה</h1>
      <p>ברוך הבא!</p>
      <a href="/new-opportunity">+ הוסף הזדמנות</a>
      <h2>הזדמנויות</h2>
      <ul>
        {opportunities.map((o) => (
          <li key={o.id}><strong>{o.title}</strong> - {o.city} ({o.status})</li>
        ))}
      </ul>
    </div>
  )
}
