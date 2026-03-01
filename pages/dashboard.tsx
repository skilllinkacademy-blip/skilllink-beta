import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
        if (data) setProfile(data)
      })
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = profile?.full_name?.split(' ').map((n:string)=>n[0]).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Heebo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #E9ECEF', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-1px' }}>
            <span style={{ color: '#000000' }}>Skill</span>
            <span style={{ color: '#FF8C00' }}>Link</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#212529' }}>פיד</button>
          <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#212529' }}>פרופיל</button>
          <div onClick={() => router.push('/profile')} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FF8C00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, cursor: 'pointer', overflow: 'hidden' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #dee2e6', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, color: '#495057' }}>יציאה</button>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', border: '1px solid #E9ECEF', textAlign: 'center', marginBottom: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FF8C00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', margin: '0 auto 20px', overflow: 'hidden' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#212529', marginBottom: '8px' }}>ברוך הבא, {profile?.full_name || user?.email}!</h1>
          {profile?.role && <span style={{ background: '#FFF5E6', color: '#FF8C00', border: '1px solid #FFE0B3', padding: '4px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>{profile.role === 'mentor' ? 'מנטור' : 'חניך'}</span>}
          <p style={{ color: '#6C757D', marginTop: '12px', fontSize: '1rem' }}>צפה בפיד, שתף טיפים, שאל שאלות ועזור לקהילה</p>
          <button onClick={() => router.push('/feed')} style={{ background: '#000', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '14px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginTop: '24px' }}>פתח את הפיד →</button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: '💡', title: 'שתף טיפ', desc: 'שתף טיפים מקצועיים', color: '#FF8C00', bg: '#FFF5E6' },
            { icon: '❓', title: 'שאל שאלה', desc: 'קבל תשובות מהקהילה', color: '#007AFF', bg: '#E6F2FF' },
            { icon: '👤', title: 'עדך פרופיל', desc: 'צלם, שם, תחום מקצוע', color: '#6F42C1', bg: '#F3EEFF' },
          ].map((item, i) => (
            <div key={i} onClick={() => item.title === 'עדך פרופיל' ? router.push('/profile') : router.push('/feed')} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E9ECEF', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px', width: '52px', height: '52px', borderRadius: '14px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: item.color, marginBottom: '6px' }}>{item.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#ADB5BD' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
