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
    he: { title: 'SkillLink', sub: 'הפלטפורמה לחניכה מקצועית', email: 'אימייל', password: 'סיסמא', login: 'כניסה', noAccount: 'אין קונטו?', register: 'הצטרף ל-SkillLink', loading: 'התחברות...' },
    en: { title: 'SkillLink', sub: 'Professional apprenticeship platform', email: 'Email', password: 'Password', login: 'Sign In', noAccount: "Don't have an account?", register: 'Join SkillLink', loading: 'Signing in...' }
  }[lang]

  const handleLogin = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'0.8rem 1rem', border:'1.5px solid #e0e0e0', borderRadius:10, fontSize:'0.95rem', outline:'none', transition:'border-color 0.2s', fontFamily:"'Segoe UI', Arial, sans-serif", boxSizing:'border-box' }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8f9fb 0%,#eef0ff 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI', Arial, sans-serif" }}>
      <div style={{ position:'absolute', top:20, right:24 }}>
        <button onClick={() => setLang(lang==='he'?'en':'he')} style={{ background:'white', border:'1px solid #ddd', borderRadius:20, padding:'0.3rem 0.9rem', cursor:'pointer', fontSize:'0.8rem', color:'#555', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>{lang==='he'?'EN':'HE'}</button>
      </div>
      <div style={{ background:'white', borderRadius:20, padding:'2.5rem 2.5rem', width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(108,99,255,0.12)', direction: lang==='he'?'rtl':'ltr' }}>
        {/* LOGO */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2.2rem', fontWeight:900, background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'0.3rem' }}>SkillLink</div>
          <p style={{ color:'#888', fontSize:'0.88rem', margin:0 }}>{t.sub}</p>
        </div>

        {/* FORM */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'0.82rem', fontWeight:600, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.email}</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
          </div>
          <div>
            <label style={{ fontSize:'0.82rem', fontWeight:600, color:'#444', display:'block', marginBottom:'0.4rem' }}>{t.password}</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} onKeyDown={e => e.key==='Enter' && handleLogin()} />
          </div>

          {error && (
            <div style={{ background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:8, padding:'0.6rem 0.8rem', fontSize:'0.83rem', color:'#c62828' }}>{error}</div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ background: loading?'#ccc':'linear-gradient(135deg,#6c63ff,#3ecfcf)', color:'white', border:'none', borderRadius:10, padding:'0.85rem', fontSize:'1rem', fontWeight:700, cursor: loading?'default':'pointer', boxShadow: loading?'none':'0 4px 14px rgba(108,99,255,0.35)', transition:'all 0.2s', marginTop:'0.5rem' }}>
            {loading ? t.loading : t.login}
          </button>
        </div>

        <div style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.87rem', color:'#888' }}>
          {t.noAccount} <a href="/signup" style={{ color:'#6c63ff', fontWeight:700, textDecoration:'none' }}>{t.register}</a>
        </div>
      </div>
    </div>
  )
}
