import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const categories = [
  { name: 'חשמל', icon: '⚡', eng: 'Electricity' },
  { name: 'אינסטלציה', icon: '🚰', eng: 'Plumbing' },
  { name: 'מיזוג אוויר', icon: '❄️', eng: 'Air Conditioning' },
  { name: 'נגרות', icon: '🪚', eng: 'Carpentry' },
  { name: 'תיקוני בית', icon: '🏠', eng: 'Handyman' },
  { name: 'מכונאות', icon: '🔧', eng: 'Mechanic' }
]

export default function Feed() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mentors, setMentors] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data: profData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profData) setProfile(profData)
      }
      fetchMentors()
    }
    init()
  }, [])

  const fetchMentors = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'mentor').limit(6)
    if (data) setMentors(data)
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Nav */}
      <nav style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>SkillLink</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem' }}>🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600 }}>{profile?.full_name?.split(' ')[0] || 'אורח'}</span>
            <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 35, height: 35, borderRadius: '50%' }} />
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        {/* Search */}
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <span style={{ marginLeft: '10px' }}>🔍</span>
          <input placeholder="חפש מנטור, מקצוע או מיומנות..." style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>ברוכים הבאים, {profile?.full_name?.split(' ')[0] || 'דוד'}!</h2>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
          {categories.map(cat => (
            <div key={cat.name} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '15px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 700 }}>{cat.eng}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>15 מנטורים זמינים</div>
            </div>
          ))}
        </div>

        {/* Recommended Mentors */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontWeight: 800 }}>מנטורים מומלצים</h3>
          <span style={{ color: '#1877f2', fontSize: '0.9rem' }}>ראה הכל</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {mentors.map(m => (
            <div key={m.id} style={{ minWidth: '160px', background: '#fff', border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <img src={m.avatar_url || 'https://randomuser.me/api/portraits/men/45.jpg'} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.full_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>{m.profession || 'מנטור מוסמך'}</div>
                <div style={{ display: 'flex', color: '#ffc107', fontSize: '0.8rem', marginBottom: '10px' }}>★★★★★</div>
                <button onClick={() => router.push(`/profile/${m.id}`)} style={{ width: '100%', padding: '6px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 600 }}>צפה בפרופיל</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>🔍</div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>💬</div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>📅</div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
      <div style={{ height: '60px' }}></div>
    </div>
  )
}
