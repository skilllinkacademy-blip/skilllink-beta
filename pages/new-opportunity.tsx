import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function NewOpportunity() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [spots, setSpots] = useState('1')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { back: '← חזרה', heading: 'פרסום תוכנית חניכה', sub: 'מלא את הפרטים וקבל חניכים מתאימים', title: 'כותרת התוכנית', titlePh: 'למשל: השתלמות בצילום מקצועי', desc: 'תיאור התוכנית', descPh: 'מה ילמד החניך? מה התהליך? אילו ניסיון דרוש?', duration: 'משך התוכנית', durationPh: 'למשל: 3 חודשים', spots: 'מספר מקומות', submit: 'פרסם תוכנית', loading: 'מפרסם...' },
    en: { back: '← Back', heading: 'Post Apprenticeship Program', sub: 'Fill in the details and find the right apprentices', title: 'Program Title', titlePh: 'e.g. Professional Photography Training', desc: 'Program Description', descPh: 'What will the apprentice learn? What experience is required?', duration: 'Duration', durationPh: 'e.g. 3 months', spots: 'Available Spots', submit: 'Post Program', loading: 'Posting...' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) { setError(lang==='he'?'חובה להזין כותרת':'Title is required'); return }
    setLoading(true); setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { error } = await supabase.from('opportunities').insert({
      title, description, city: 'פתח תקווה', status: 'open', mentor_id: session.user.id
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'0.8rem 1rem', border:'1.5px solid #e0e0e0', borderRadius:10, fontSize:'0.93rem', outline:'none', fontFamily:"'Segoe UI', Arial, sans-serif", boxSizing:'border-box', transition:'border-color 0.2s', background:'white' }

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fb', fontFamily:"'Segoe UI', Arial, sans-serif" }}>
      {/* NAV */}
      <nav style={{ background:'white', borderBottom:'1px solid #ececec', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:64, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize:'1.4rem', fontWeight:900, background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillLink</span>
        <button onClick={() => setLang(lang==='he'?'en':'he')} style={{ background:'#f0f0f0', border:'none', borderRadius:20, padding:'0.3rem 0.8rem', cursor:'pointer', fontSize:'0.8rem', color:'#555' }}>{lang==='he'?'EN':'HE'}</button>
      </nav>

      <div style={{ maxWidth:640, margin:'2rem auto', padding:'0 1.5rem', direction: lang==='he'?'rtl':'ltr' }}>
        <a href="/dashboard" style={{ color:'#6c63ff', textDecoration:'none', fontSize:'0.9rem', fontWeight:600, display:'inline-block', marginBottom:'1.5rem' }}>{t.back}</a>

        <div style={{ background:'white', borderRadius:20, padding:'2.5rem', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Header */}
          <div style={{ marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #f0f0f0' }}>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#1a1a2e', margin:'0 0 0.3rem' }}>{t.heading}</h1>
            <p style={{ color:'#888', margin:0, fontSize:'0.9rem' }}>{t.sub}</p>
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
            <div>
              <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.title}</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.titlePh} style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
            <div>
              <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.desc}</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t.descPh} style={{ ...inputStyle, minHeight:120, resize:'vertical' }} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.duration}</label>
                <input value={duration} onChange={e => setDuration(e.target.value)} placeholder={t.durationPh} style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
              <div>
                <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.spots}</label>
                <input value={spots} onChange={e => setSpots(e.target.value)} type="number" min="1" max="10" style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
            </div>
          </div>

          {error && <div style={{ background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:8, padding:'0.6rem 0.8rem', fontSize:'0.83rem', color:'#c62828', marginTop:'1rem' }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', background: loading?'#ccc':'linear-gradient(135deg,#6c63ff,#3ecfcf)', color:'white', border:'none', borderRadius:10, padding:'0.9rem', fontSize:'1rem', fontWeight:700, cursor: loading?'default':'pointer', boxShadow: loading?'none':'0 4px 14px rgba(108,99,255,0.35)', marginTop:'1.5rem' }}>
            {loading ? t.loading : t.submit}
          </button>
        </div>
      </div>
    </div>
  )
}
