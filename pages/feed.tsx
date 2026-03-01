import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const categories = [
  { name: 'חשמל', icon: '⚡', color: '#FFF4E5' },
  { name: 'אינסטלציה', icon: '💧', color: '#E5F6FF' },
  { name: 'מיזוג אוויר', icon: '❄️', color: '#F0F0FF' },
  { name: 'נגרות', icon: '🪵', color: '#F5EFE6' },
  { name: 'תיקוני בית', icon: '🏠', color: '#E8F5E9' },
  { name: 'מכונאות', icon: '🔧', color: '#F5F5F5' },
  { name: 'שיפוצים', icon: '🏗️', color: '#FFF0F0' }
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

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: '\"Segoe UI\", system-ui, sans-serif' }}>
      {/* Header */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
        <div style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-1px' }}>SkillLink</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            <div style={{ position: 'absolute', top: 2, right: 0, width: '10px', height: '10px', background: 'red', borderRadius: '50%', border: '2px solid #fff' }} />
          </div>
          <img 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=000&color=fff`} 
            style={{ width: 40, height: 40, borderRadius: '12px', cursor: 'pointer', border: '1px solid #eee' }} 
            onClick={() => router.push('/profile')}
          />
        </div>
      </nav>

      <div style={{ padding: '0 20px 100px 20px' }}>
        {/* Welcome Section */}
        <div style={{ margin: '20px 0 30px 0' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '10px' }}>
            מצא את המקצוען<br />הבא שלך
          </h1>
          <div style={{ display: 'flex', background: '#f8f8f8', borderRadius: '20px', padding: '15px 20px', alignItems: 'center', border: '1px solid #eee' }}>
            <span style={{ fontSize: '1.2rem', marginLeft: '12px' }}>🔍</span>
            <input 
              placeholder=\"חפש חשמלאי, נגר, או כל תחום אחר...\" 
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: 500 }} 
            />
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '20px', margin: '0 -20px', paddingRight: '20px', paddingLeft: '20px' }}>
          <div 
            onClick={() => setActiveCategory('הכל')}
            style={{ 
              padding: '12px 24px', borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer',
              background: activeCategory === 'הכל' ? '#000' : '#f5f5f5',
              color: activeCategory === 'הכל' ? '#fff' : '#000'
            }}
          >
            הכל
          </div>
          {categories.map(cat => (
            <div 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{ 
                padding: '12px 24px', borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                background: activeCategory === cat.name ? '#000' : cat.color,
                color: activeCategory === cat.name ? '#fff' : '#000'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </div>
          ))}
        </div>

        {/* Mentors List */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>מקצוענים מובילים בפתח תקווה</h3>
            <span style={{ color: '#666', fontWeight: 600, fontSize: '0.9rem' }}>ראה הכל</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loading ? (
              <p>טוען מקצוענים...</p>
            ) : mentors.length === 0 ? (
              <p>לא נמצאו מנטורים כרגע.</p>
            ) : mentors.map(m => (
              <div 
                key={m.id} 
                onClick={() => router.push(`/profile/${m.id}`)}
                style={{ 
                  background: '#fff', border: '2px solid #f0f0f0', borderRadius: '24px', padding: '15px', display: 'flex', gap: '15px', cursor: 'pointer',
                  transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.full_name}&background=random`} 
                    style={{ width: 80, height: 80, borderRadius: '18px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: -5, right: -5, width: '24px', height: '24px', background: '#00c853', borderRadius: '50%', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '0.6rem' }}>✓</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{m.full_name}</h4>
                      <p style={{ margin: '2px 0 8px 0', color: '#666', fontSize: '0.9rem', fontWeight: 600 }}>{m.profession || 'מנטור מומחה'}</p>
                    </div>
                    <div style={{ background: '#fff9e6', color: '#b8860b', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                      ★ 4.9
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {m.experience_years || '5+ שנים'}
                    </div>
                    <div style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {m.city || 'פתח תקווה'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '15px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <div style={{ color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }}>💬</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }}>📅</div>
        <div style={{ color: '#888', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
