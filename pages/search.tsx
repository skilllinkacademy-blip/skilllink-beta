import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/signup?mode=login')
    }
    checkAuth()
  }, [])

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    let q = supabase.from('profiles').select('*')
    if (filter === 'mentor') q = q.eq('role', 'mentor')
    else if (filter === 'student') q = q.eq('role', 'student')
    q = q.or(`full_name.ilike.%${query}%,profession.ilike.%${query}%,bio.ilike.%${query}%,city.ilike.%${query}%`)
    const { data } = await q.limit(20)
    setResults(data || [])
    setLoading(false)
  }

  const nav = {
    position: 'fixed' as const, bottom: 0, left: 0, right: 0, background: '#fff',
    borderTop: '1px solid #eee', padding: '15px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', zIndex: 100
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui,sans-serif', paddingBottom: '80px' }}>
      {/* Header */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px' }}>חיפוש מנטורים</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text" value={query} placeholder="חפש לפי שם, מקצוע, עיר..."
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <button onClick={search}
            style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            חפש
          </button>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {[{v:'all',l:'הכל'},{v:'mentor',l:'מנטורים'},{v:'student',l:'תלמידים'}].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid', borderColor: filter === f.v ? '#000' : '#ddd',
                background: filter === f.v ? '#000' : '#fff', color: filter === f.v ? '#fff' : '#666',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              {f.l}
            </button>
          ))}
        </div>
      </nav>

      {/* Results */}
      <div style={{ padding: '20px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>מחפש...</div>}
        {!loading && results.length === 0 && query && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p>לא נמצאו תוצאות. נסה מילות חיפוש שונות.</p>
          </div>
        )}
        {!loading && results.length === 0 && !query && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
            <p>חפש מנטור לפי מקצוע, שם או עיר</p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map(p => (
            <div key={p.id} onClick={() => {}} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', cursor: 'pointer', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <img src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'U')}&background=000&color=fff&size=60`}
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{p.full_name}</h3>
                    <span style={{ background: p.role === 'mentor' ? '#000' : '#e0e0e0', color: p.role === 'mentor' ? '#fff' : '#333',
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {p.role === 'mentor' ? 'מנטור' : 'תלמיד'}
                    </span>
                  </div>
                  {p.profession && <p style={{ color: '#555', margin: '4px 0', fontSize: '0.95rem' }}>🔧 {p.profession}</p>}
                  {p.city && <p style={{ color: '#888', margin: '4px 0', fontSize: '0.9rem' }}>📍 {p.city}</p>}
                  {p.bio && <p style={{ color: '#666', margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>{p.bio.slice(0, 100)}{p.bio.length > 100 ? '...' : ''}</p>}
                  {p.role === 'mentor' && p.hourly_rate && <p style={{ fontWeight: 700, margin: '8px 0 0', color: '#000' }}>{p.hourly_rate}₪/שעה</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={nav}>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#000' }}>🔍</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/messages')}>💬</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/calendar')}>📅</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
