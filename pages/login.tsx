import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { title: 'SkillLink', sub: 'הפלטפורמה לחניכות מקצועית', email: 'אימייל', password: 'סיסמא', login: 'כניסה', signup: 'הרשמה', noAccount: 'אין לך חשבון?', loading: 'מתחבר...', emailPh: 'הזן אימייל', passPh: 'הזן סיסמא' },
    en: { title: 'SkillLink', sub: 'Professional apprenticeship platform', email: 'Email', password: 'Password', login: 'Sign In', signup: 'Sign Up', noAccount: "Don't have an account?", loading: 'Connecting...', emailPh: 'Enter your email', passPh: 'Enter your password' }
  }[lang]

  const handleLogin = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
      </div>

      <div className="glass animate-fadeIn" style={{ width: '100%', maxWidth: '420px', padding: '48px 40px', position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.8rem', color: 'white', margin: '0 auto 16px', boxShadow: 'var(--shadow)' }}>S</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.sub}</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPh}
              className="form-input"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.passPh}
              className="form-input"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#FF6584', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span className="spinner" />{t.loading}</> : t.login}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.noAccount}{' '}
          <a href="/signup" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{t.signup}</a>
        </div>
      </div>
    </div>
  )
}
