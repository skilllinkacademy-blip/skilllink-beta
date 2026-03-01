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
    <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Heebo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-1px' }}>
            <span style={{ color: '#667eea' }}>Skill</span>
            <span style={{ color: '#764ba2' }}>Link</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057', transition: 'color 0.2s' }}>📰 פיד הזדמנויות</button>
          <button onClick={() => router.push('/new-opportunity')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057', transition: 'color 0.2s' }}>➕ הוסף הזדמנות</button>
          <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057', transition: 'color 0.2s' }}>👤 פרופיל</button>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#212529', marginBottom: '2px' }}>שלום, {profile?.full_name || user?.email?.split('@')[0] || 'משתמש'}</div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{profile?.role && <span style={{ background: '#e7f5ff', color: '#1864ab', border: '1px solid #74c0fc', padding: '2px 8px', borderRadius: '4px' }}>{profile.role}</span>}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)', transition: 'transform 0.2s' }}>יציאה</button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '48px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '16px', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>ברוכים הבאים ל-SkillLink! 🎯</h1>
          <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.95)', marginBottom: '8px' }}>הפלטפורמה שמחברת בין מעסיקים לעובדים מיומנים בפתח תקווה</p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
          {[
            { icon: '📰', title: 'פיד הזדמנויות', desc: 'עיין בהזדמנויות עבודה זמינות', color: '#667eea', bg: '#e7e9fc', action: '/feed' },
            { icon: '➕', title: 'פרסם הזדמנות', desc: 'צור הזדמנות עבודה חדשה', color: '#764ba2', bg: '#f0e7fc', action: '/new-opportunity' },
            { icon: '👤', title: 'ערוך פרופיל', desc: 'עדכן את הפרטים האישיים שלך', color: '#20c997', bg: '#d3f9e8', action: '/profile' },
          ].map((item, i) => (
            <div key={i} onClick={() => router.push(item.action)} style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'all 0.3s', border: '2px solid transparent' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#212529', marginBottom: '8px' }}>{item.title}</div>
              <div style={{ fontSize: '0.95rem', color: '#6c757d', lineHeight: '1.5' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#212529', marginBottom: '24px' }}>📊 סטטיסטיקות</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: 'linear-gradient(135deg, #e7e9fc, #f0e7fc)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#667eea', marginBottom: '8px' }}>20</div>
              <div style={{ fontSize: '1rem', color: '#495057', fontWeight: 600 }}>משתמשים רשומים</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: 'linear-gradient(135deg, #f0e7fc, #e7e9fc)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#764ba2', marginBottom: '8px' }}>0</div>
              <div style={{ fontSize: '1rem', color: '#495057', fontWeight: 600 }}>הזדמנויות פעילות</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: 'linear-gradient(135deg, #d3f9e8, #d3f9f5)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#20c997', marginBottom: '8px' }}>100%</div>
              <div style={{ fontSize: '1rem', color: '#495057', fontWeight: 600 }}>שביעות רצון</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
