import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [role, setRole] = useState<'mentor'|'mentee'|null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [profession, setProfession] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { title: 'SkillLink', sub: 'הצטרף לקהילתנו', choosRole: 'אני רוצה להצטרף כבחור:', mentor: 'מנטור', mentorSub: 'אני מלמד ומנחה', mentee: 'חניך', menteeSub: 'אני מחפש ללמוד', name: 'שם מלא', email: 'אימייל', password: 'סיסמא', phone: 'טלפון', profession: 'תחום / מקצוע', bio: 'קצת עליך', signup: 'הרשמה', haveAccount: 'יש לך כבר חשבון?', login: 'כניסה', loading: 'נרשם...' },
    en: { title: 'SkillLink', sub: 'Join our community', choosRole: 'I want to join as:', mentor: 'Mentor', mentorSub: 'I teach and guide', mentee: 'Apprentice', menteeSub: 'I want to learn', name: 'Full Name', email: 'Email', password: 'Password', phone: 'Phone', profession: 'Field / Profession', bio: 'About you', signup: 'Create Account', haveAccount: 'Already have an account?', login: 'Sign In', loading: 'Creating...' }
  }[lang]

  const handleSignup = async () => {
    if (!role) { setError(lang === 'he' ? 'בחר תפקיד' : 'Please select a role'); return }
    setLoading(true); setError('')
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, role: role === 'mentor' ? 'mentor' : 'apprentice', phone, profession, bio, city: 'פתח תקווה' })
      router.push('/dashboard')
    }
  }

  const RoleCard = ({ type, label, sub }: { type: 'mentor'|'mentee', label: string, sub: string }) => (
    <div onClick={() => setRole(type)} style={{ flex: 1, padding: '24px 16px', borderRadius: '16px', border: `2px solid ${role === type ? 'var(--primary)' : 'var(--border)'}`, background: role === type ? 'rgba(108,99,255,0.15)' : 'var(--bg-glass)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', transform: role === type ? 'scale(1.03)' : 'scale(1)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{type === 'mentor' ? '🎓' : '🎯'}</div>
      <div style={{ fontWeight: 700, color: role === type ? 'var(--primary-light)' : 'var(--text)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  )

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
      </div>

      <div className="glass animate-fadeIn" style={{ width: '100%', maxWidth: '480px', padding: '48px 40px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', color: 'white', margin: '0 auto 14px', boxShadow: 'var(--shadow)' }}>S</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.sub}</p>
        </div>

        {/* Role selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>{t.choosRole}</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <RoleCard type="mentor" label={t.mentor} sub={t.mentorSub} />
            <RoleCard type="mentee" label={t.mentee} sub={t.menteeSub} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[{label: t.name, val: name, set: setName, ph: lang==='he'?'שימון ישראלי':'John Doe', type:'text'},
            {label: t.email, val: email, set: setEmail, ph: 'you@email.com', type:'email'},
            {label: t.password, val: password, set: setPassword, ph: '••••••••', type:'password'},
            {label: t.phone, val: phone, set: setPhone, ph: '05X-XXXXXXX', type:'tel'},
            {label: t.profession, val: profession, set: setProfession, ph: lang==='he'?'פיתוח תוכנה, שיווק...':'Software, Marketing...', type:'text'}]
            .map(({label, val, set, ph, type}) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</label>
                <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} className="form-input" />
              </div>
            ))
          }
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>{t.bio}</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={lang==='he'?'ספר קצת על עצמך...':'Tell us about yourself...'} rows={3} className="form-input" style={{ resize: 'vertical' }} />
          </div>

          {error && <div style={{ background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#FF6584', fontSize: '0.85rem' }}>{error}</div>}

          <button onClick={handleSignup} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span className="spinner" />{t.loading}</> : t.signup}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.haveAccount}{' '}
          <a href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{t.login}</a>
        </div>
      </div>
    </div>
  )
}
