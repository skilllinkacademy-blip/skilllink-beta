import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) setProfile(data)
      }
      fetchOpportunities()
    }
    init()
  }, [])

  const fetchOpportunities = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('opportunities')
      .select('*, profiles:employer_id(*)')
      .order('created_at', { ascending: false })
    if (!error) setOpportunities(data || [])
    setLoading(false)
  }

  const filteredOpps = opportunities.filter(opp => filter === 'all' || opp.category === filter)

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
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057' }}>🏠 בית</button>
          <button onClick={() => router.push('/new-opportunity')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057' }}>➕ הוסף הזדמנות</button>
          <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057' }}>👤 פרופיל</button>
        </div>
        
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>יציאה</button>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '48px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', marginBottom: '12px', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>📰 פיד הזדמנויות</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.95)' }}>מצא את ההזדמנות המושלמת עבורך</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'הכל' },
            { value: 'tech', label: '💻 טכנולוגיה' },
            { value: 'design', label: '🎨 עיצוב' },
            { value: 'marketing', label: '📣 שיווק' },
            { value: 'sales', label: '💼 מכירות' },
            { value: 'other', label: '🔧 אחר' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                background: filter === f.value ? 'white' : 'rgba(255,255,255,0.2)',
                color: filter === f.value ? '#667eea' : 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '24px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                boxShadow: filter === f.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'white', fontSize: '1.2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <div>טוען הזדמנויות...</div>
          </div>
        ) : filteredOpps.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#212529', marginBottom: '8px' }}>אין הזדמנויות זמינות</h2>
            <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '24px' }}>היה הראשון לפרסם הזדמנות!</p>
            <button onClick={() => router.push('/new-opportunity')} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>➕ צור הזדמנות</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredOpps.map((opp) => (
              <div key={opp.id} style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'all 0.3s', cursor: 'pointer', border: '2px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#212529', marginBottom: '8px' }}>{opp.title}</h3>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '8px' }}>📍 {opp.location || 'פתח תקווה'}</div>
                  </div>
                  <div style={{ background: '#e7e9fc', color: '#667eea', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {opp.category || 'כללי'}
                  </div>
                </div>
                
                <p style={{ color: '#495057', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.95rem' }}>{opp.description?.substring(0, 120)}{opp.description?.length > 120 && '...'}</p>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {opp.skills?.slice(0,3).map((skill:string, i:number) => (
                    <span key={i} style={{ background: '#f0e7fc', color: '#764ba2', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{skill}</span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>פורסם לפני {Math.floor((Date.now() - new Date(opp.created_at).getTime()) / (1000 * 60 * 60 * 24))} ימים</div>
                  <button onClick={() => router.push(`/opportunity/${opp.id}`)} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>צפה</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
