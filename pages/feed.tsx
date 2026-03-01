import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const categories = [
  { name: 'חשמל', icon: '⚡', color: '#FFF4E5' },
  { name: 'אינסטלציה', icon: '💧', color: '#E5F6FF' },
  { name: 'מיזוג אוויר', icon: '❄', color: '#F0F0FF' },
  { name: 'נגרות', icon: '🪵', color: '#F5EFE6' },
  { name: 'תיקוני בית', icon: '🏠', color: '#E8F5E9' },
  { name: 'מכונאות', icon: '🔧', color: '#F5F5F5' },
  { name: 'שיפוצים', icon: '🏗', color: '#FFF0F0' }
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
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 100, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-1px' }}>SkillLink</div>
        <img
          src={profile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=000&color=fff'}
          style={{ width: 40, height: 40, borderRadius: '12px', cursor: 'pointer', border: '1px solid #eee' }}
          onClick={() => router.push('/profile')}
        />
      </nav>

      <div style={{ padding: '20px 20px 100px 20px' }}>
        <div style={{ margin: '20px 0 30px 0' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px' }}>
            מצא את המקצוען הבא שלך
          </h1>
          <div style={{ display: 'flex', background: '#f8f8f8', borderRadius: '20px', padding: '15px 20px', alignItems: 'center', border: '1px solid #eee' }}>
            <span style={{ fontSize: '1.2rem', marginLeft: '12px' }}>🔍</span>
            <input
              placeholder={'חפש חשמלאי, נגר, או כל תחום אחר...'}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '25px' }}>
          <button
            onClick={() => setActiveCategory('הכל')}
            style={{ padding: '10px 22px', borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', border: 'none', background: activeCategory === 'הכל' ? '#000' : '#f5f5f5', color: activeCategory === 'הכל' ? '#fff' : '#000' }}
          >
            הכל
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{ padding: '10px 22px', borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', border: 'none', background: activeCategory === cat.name ? '#000' : cat.color, color: activeCategory === cat.name ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>מקצוענים מובילים</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loading && <p>טוען...</p>}
            {!loading && mentors.length === 0 && <p>לא נמצאו מקצוענים.</p>}
            {mentors.map(m => (
              <div
                key={m.id}
                onClick={() => router.push('/profile/' + m.id)}
                style={{ background: '#fff', border: '2px solid #f0f0f0', borderRadius: '20px', padding: '15px', display: 'flex', gap: '15px', cursor: 'pointer' }}
              >
                <img
                  src={m.avatar_url || 'https://ui-avatars.com/api/?name=' + m.full_name + '&background=random'}
                  style={{ width: 75, height: 75, borderRadius: '15px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{m.full_name}</h4>
                      <p style={{ margin: '3px 0 8px', color: '#666', fontSize: '0.85rem' }}>{m.profession || 'מנטור מומחה'}</p>
                    </div>
                    <div style={{ background: '#fff9e6', color: '#b8860b', padding: '3px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, height: 'fit-content' }}>
                      ★ 4.9
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: '#f5f5f5', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{m.experience_years || '5+ שנים'}</span>
                    <span style={{ background: '#f5f5f5', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{m.city || 'פתח תקווה'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.9)', borderRadius: '30px', padding: '15px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }}>💬</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }}>📅</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
