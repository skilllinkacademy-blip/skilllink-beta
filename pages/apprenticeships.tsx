import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Apprenticeships() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      
      const { data } = await supabase
        .from('opportunities')
        .select('*, profiles!opportunities_mentor_id_fkey(full_name, profession)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      setOpportunities(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const navStyle: React.CSSProperties = { background: '#1B1F2E', color: 'white', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }
  const sidebarStyle: React.CSSProperties = { width: '240px', background: 'white', padding: '20px 16px', borderRight: '1px solid #E4E6EB', position: 'fixed', left: 0, top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }
  const mainStyle: React.CSSProperties = { marginLeft: '240px', background: '#F0F2F5', minHeight: 'calc(100vh - 56px)', padding: '24px', fontFamily: "'Segoe UI', Arial, sans-serif" }
  const cardStyle: React.CSSProperties = { background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', transition: 'transform 0.2s, box-shadow 0.2s' }

  return (
    <div>
      {/* Top Nav */}
      <nav style={navStyle}>
        <span onClick={() => router.push('/feed')} style={{ cursor: 'pointer', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#4A90D9' }}>Skill</span><span style={{ color: '#F5A623' }}>Link</span>
        </span>
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 32px' }}>
          <input type="text" placeholder="Search for professions, mentors..." style={{ width: '100%', padding: '8px 16px', borderRadius: '20px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>💬</span>
          <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>🔔</span>
          <div onClick={() => router.push('/profile')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4A90D9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      {/* Left Sidebar */}
      <div style={sidebarStyle}>
        <div onClick={() => router.push('/feed')} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', background: '#F0F2F5' }}>
          <span style={{ fontSize: '1.3rem' }}>🏠</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Home</span>
        </div>
        <div onClick={() => router.push('/profile')} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.3rem' }}>👤</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>My Profile</span>
        </div>
        <div onClick={() => router.push('/apprenticeships')} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', background: '#E7F3FF' }}>
          <span style={{ fontSize: '1.3rem' }}>🎓</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4A90D9' }}>Apprenticeships</span>
        </div>
        <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.3rem' }}>💬</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Messages</span>
        </div>
        <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.3rem' }}>🔖</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Saved</span>
        </div>
        <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.3rem' }}>⚙️</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Settings</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B1F2E', margin: 0 }}>Available Apprenticeships</h1>
          <button onClick={() => router.push('/new-opportunity')} style={{ background: '#4A90D9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>+ Post New</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading...</div>
        ) : opportunities.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>No apprenticeships yet</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Be the first to post an apprenticeship opportunity!</p>
            <button onClick={() => router.push('/new-opportunity')} style={{ background: '#4A90D9', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Post Apprenticeship</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {opportunities.map(opp => (
              <div key={opp.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E7F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginRight: '12px' }}>🛠️</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{opp.profiles?.full_name || 'Mentor'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{opp.profession}</div>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#1B1F2E' }}>{opp.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.4', marginBottom: '12px' }}>{opp.description?.substring(0, 120)}{opp.description?.length > 120 && '...'}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {opp.requirements?.slice(0, 3).map((req: string, i: number) => (
                    <span key={i} style={{ background: '#F0F2F5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#555' }}>{req}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E4E6EB' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>📍 {opp.location}</div>
                  <button style={{ background: '#4A90D9', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
