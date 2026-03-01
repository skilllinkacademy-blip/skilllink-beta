import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function NewOpportunity() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('tech')
  const [location, setLocation] = useState('פתח תקווה')
  const [skills, setSkills] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleSubmit = async () => {
    if (!title || !description) {
      setError('מלא את כל השדות החובה')
      return
    }
    setLoading(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s)
    const { error: err } = await supabase.from('opportunities').insert({
      title,
      description,
      category,
      location,
      skills: skillsArray,
      employer_id: session.user.id,
    })
    
    if (err) { setError(err.message); setLoading(false) }
    else router.push('/feed')
  }

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
          <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057' }}>📰 פיד</button>
          <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#495057' }}>👤 פרופיל</button>
        </div>
        
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>יציאה</button>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '48px 32px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', marginBottom: '12px', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>➕ צור הזדמנות חדשה</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.95)' }}>מלא את הפרטים ומצא את העובד המושלם</p>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
          {error && (
            <div style={{ background: '#ffe0e0', border: '1px solid #ffb3b3', color: '#cc0000', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '8px' }}>🎯 כותרת ההזדמנות</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: מפתח Full Stack"
              style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none', transition: 'border 0.3s' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '8px' }}>📋 תיאור התפקיד</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תאר את התפקיד, הדרישות והמיומנויות הנדרשות..."
              rows={6}
              style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: "'Heebo', sans-serif" }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '8px' }}>📚 קטגוריה</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none', background: 'white', cursor: 'pointer' }}
            >
              <option value="tech">💻 טכנולוגיה</option>
              <option value="design">🎨 עיצוב</option>
              <option value="marketing">📣 שיווק</option>
              <option value="sales">💼 מכירות</option>
              <option value="other">🔧 אחר</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '8px' }}>📍 מיקום</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '8px' }}>🛠️ מיומנויות נדרשות (הפרד בפסיקים)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="למשל: React, Node.js, TypeScript"
              style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#adb5bd' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ מפרסם...' : '🚀 פרסם הזדמנות'}
          </button>
        </div>
      </main>
    </div>
  )
}
