import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Messages() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/signup?mode=login')
      else {
        const { data: profData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(profData)
      }
    }
    checkAuth()
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem' }}>🔙</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>הודעות</h1>
      </nav>

      <div style={{ padding: '20px', textAlign: 'center', marginTop: '100px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>עדיין אין שיחות</h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>כאן תוכל לראות את כל השיחות שלך עם מנטורים ותלמידים.</p>
        <button 
          onClick={() => router.push('/feed')}
          style={{ marginTop: '30px', background: '#000', color: '#fff', padding: '15px 40px', borderRadius: '50px', fontWeight: 800, fontSize: '1.1rem' }}
        >
          מצא מנטור להתחלת שיחה
        </button>
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }} onClick={() => router.push('/search')}>🔍</div>
        <div style={{ fontSize: '1.8rem', color: '#000', cursor: 'pointer' }}>💬</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }} onClick={() => router.push('/calendar')}>📅</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
