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
    he: { back: '← חזרה', heading: 'פרסום הזדמנות חניכה', sub: 'מלא את הפרטים וקבל חניכים מתאימים', title: 'שם ההזדמנות', titlePh: 'למשל: מנטור לפיתוח תוכנה', desc: 'תיאור', descPh: 'תאר מה תלמד החניך ומה אתה מחפש...', dur: 'משך החניכות', durPh: 'למשל: 3 חודשים', spotsLabel: 'מספר מקומות', submit: 'פרסם הזדמנות', loading: 'מפרסם...' },
    en: { back: '← Back', heading: 'Post Apprenticeship', sub: 'Fill in the details and find the right apprentice', title: 'Title', titlePh: 'e.g. Mentoring in Software Dev', desc: 'Description', descPh: 'What will the apprentice learn and what are you looking for...', dur: 'Duration', durPh: 'e.g. 3 months', spotsLabel: 'Available Spots', submit: 'Post Opportunity', loading: 'Posting...' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleSubmit = async () => {
    if (!title || !description || !duration) { setError(lang === 'he' ? 'מלא את כל השדות' : 'Please fill all fields'); return }
    setLoading(true); setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { error: err } = await supabase.from('opportunities').insert({ title, description, duration, spots: parseInt(spots), created_by: session.user.id, city: 'פתח תקווה' })
    if (err) { setError(err.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Navbar */}
      <nav style={{ background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>{t.back}</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillLink</div>
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
        </div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="animate-fadeIn" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', marginBottom: '8px' }}>{t.heading}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.sub}</p>
        </div>

        {/* Form Card */}
        <div className="glass animate-fadeIn" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.title}</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.titlePh} className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.desc}</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t.descPh} rows={5} className="form-input" style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.dur}</label>
                <input value={duration} onChange={e => setDuration(e.target.value)} placeholder={t.durPh} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.spotsLabel}</label>
                <input value={spots} onChange={e => setSpots(e.target.value)} type="number" min="1" max="20" className="form-input" />
              </div>
            </div>

            {error && <div style={{ background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#FF6584', fontSize: '0.85rem' }}>{error}</div>}

            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="spinner" />{t.loading}</> : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
