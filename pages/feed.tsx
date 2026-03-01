import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const categories = [
  { name: 'חשמל', icon: '⚡', en: 'Electricity' },
  { name: 'אינסטלציה', icon: '🚰', en: 'Plumbing' },
  { name: 'מיזוג אוויר', icon: '❄️', en: 'Air Conditioning' },
  { name: 'נגרות', icon: '🪚', en: 'Carpentry' }
]

export default function Feed() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mentors, setMentors] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('הכל')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profData) setProfile(profData)
      }
      fetchMentors()
    }
    init()
  }, [])

  const fetchMentors = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'mentor').order('created_at', { ascending: false }).limit(20)
    if (data) setMentors(data)
    setLoading(false)
  }

  const fontStyle = { fontFamily: 'system-ui, sans-serif' }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', ...fontStyle }}>
      {/* Header */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
        <div style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-1px' }}>SkillLink</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=random`} 
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #eee' }}
          />
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile?.full_name?.split(' ')[0] || 'אורח'} 👑</div>
          <div style={{ fontSize: '1.4rem', position: 'relative' }}>🔔</div>
        </div>
      </nav>

      <div style={{ padding: '0 20px 100px 20px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', padding: '15px 20px', alignItems: 'center', border: '3px solid #000' }}>
            <input 
              placeholder='חפש מנטור, מקצוע או מיומנות...' 
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: 600, textAlign: 'right' }} 
            />
            <span style={{ fontSize: '1.4rem', marginRight: '10px' }}>🔍</span>
          </div>
        </div>

        {/* Welcome Message */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '30px' }}>
          ברוכים הבאים, {profile?.full_name?.split(' ')[0] || 'חבר'}!
        </h1>

        {/* Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
          {categories.map(cat => (
            <div key={cat.name} style={{ background: '#fff', borderRadius: '20px', padding: '20px', textAlign: 'center', border: '1px solid #f0f0f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{cat.en}</div>
              <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 600 }}>15 מנטורים זמינים</div>
            </div>
          ))}
        </div>

        {/* Recommended Mentors */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px' }}>מנטורים מומלצים</h3>
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px' }}>
            {mentors.map(m => (
              <div key={m.id} style={{ minWidth: '200px', background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <img src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.full_name}&background=random`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '15px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 5px', fontWeight: 800 }}>{m.full_name}</h4>
                  <p style={{ margin: '0 0 10px', color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>{m.profession || 'חשמלאי מוסמך'}</p>
                  <div style={{ color: '#FFD700', marginBottom: '15px' }}>★★★★★</div>
                  <button style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}>צפה בפרופיל</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>🔍</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>💬</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>📅</div>
        <div style={{ fontSize: '1.8rem', color: '#888', cursor: 'pointer' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
