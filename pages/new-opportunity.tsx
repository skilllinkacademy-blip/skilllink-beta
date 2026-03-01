import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const TRADE_PROFESSIONS = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Mechanic',
  'Barber',
  'Welder',
  'Construction Worker',
  'Auto Repair Specialist',
  'Painter',
  'Tiler',
  'HVAC Technician',
  'Locksmith',
  'Roofer',
  'Landscaper',
  'Handyman',
  'Mason',
  'Chef / Cook',
  'Tailor',
  'Other'
]

export default function NewOpportunity() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [profession, setProfession] = useState('Plumber')
  const [location, setLocation] = useState('Petah Tikva')
  const [duration, setDuration] = useState('')
  const [requirements, setRequirements] = useState('')
  const [spots, setSpots] = useState('1')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleSubmit = async () => {
    if (!title || !description || !profession) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const reqArray = requirements.split(',').map(r => r.trim()).filter(r => r)
    const { error: err } = await supabase.from('opportunities').insert({
      title,
      description,
      profession,
      location,
      duration,
      requirements: reqArray,
      available_spots: parseInt(spots),
      mentor_id: session.user.id,
    })

    if (err) { setError(err.message); setLoading(false) }
    else router.push('/apprenticeships')
  }

  const navStyle: React.CSSProperties = { background: '#1B1F2E', color: 'white', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }
  const mainStyle: React.CSSProperties = { minHeight: '100vh', background: '#F0F2F5', fontFamily: "'Segoe UI', Arial, sans-serif" }
  const formCardStyle: React.CSSProperties = { background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '700px', margin: '32px auto', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }
  const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#444', marginBottom: '6px' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: '0.95rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const fieldWrap: React.CSSProperties = { marginBottom: '20px' }

  return (
    <div style={mainStyle}>
      {/* Nav */}
      <nav style={navStyle}>
        <span onClick={() => router.push('/feed')} style={{ cursor: 'pointer', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#4A90D9' }}>Skill</span><span style={{ color: '#F5A623' }}>Link</span>
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => router.push('/feed')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Feed</button>
          <button onClick={() => router.push('/apprenticeships')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Apprenticeships</button>
        </div>
      </nav>

      {/* Form */}
      <div style={{ padding: '0 16px' }}>
        <div style={formCardStyle}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B1F2E', marginBottom: '6px' }}>Post an Apprenticeship</h1>
          <p style={{ color: '#666', marginBottom: '28px', fontSize: '0.95rem' }}>Connect with aspiring tradespeople looking to learn your craft</p>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', color: '#C62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div style={fieldWrap}>
            <label style={labelStyle}>Position Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Plumbing Apprentice Needed" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Trade / Profession *</label>
            <select value={profession} onChange={e => setProfession(e.target.value)} style={inputStyle}>
              {TRADE_PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What will the apprentice learn? What are you looking for?" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Duration</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3 months, 6 months" style={inputStyle} />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Requirements (comma-separated)</label>
            <input type="text" value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="e.g. Physical fitness, Basic tools, Eager to learn" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Available Spots</label>
            <input type="number" value={spots} onChange={e => setSpots(e.target.value)} min="1" max="20" style={{ ...inputStyle, width: '120px' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? '#aaa' : '#4A90D9', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
            {loading ? 'Posting...' : 'Post Apprenticeship'}
          </button>
        </div>
      </div>
    </div>
  )
}
