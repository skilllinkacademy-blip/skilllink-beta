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
    he: { choosRole: 'אני רוצה להצטרף בתור:', mentor: 'מנטור', mentorSub: 'אני מלמד ומנחה', mentee: 'חניך', menteeSub: 'אני רוצה ללמוד מקצוע', name: 'שם מלא', email: 'אימייל', password: 'סיסמא', phone: 'טלפון (WhatsApp)', profession: 'תחום / מקצוע', bio: 'כמה משפטות עליך', submit: 'הצטרף ל-SkillLink', hasAccount: 'יש כבר חשבון?', login: 'כניסה', loading: 'יוצר חשבון...' },
    en: { choosRole: 'I want to join as:', mentor: 'Mentor', mentorSub: 'I teach and guide', mentee: 'Apprentice', menteeSub: 'I want to learn a profession', name: 'Full Name', email: 'Email', password: 'Password', phone: 'Phone (WhatsApp)', profession: 'Field / Profession', bio: 'A few words about you', submit: 'Join SkillLink', hasAccount: 'Already have an account?', login: 'Sign In', loading: 'Creating account...' }
  }[lang]

  const handleSignup = async () => {
    if (!role) { setError(lang==='he'?'בחר תפקיד':'Please select a role'); return }
    setLoading(true); setError('')
    const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, phone, role, profession, bio, city: 'פתח תקווה' })
    }
    router.push('/dashboard')
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e0e0e0', borderRadius:10, fontSize:'0.93rem', outline:'none', fontFamily:"'Segoe UI', Arial, sans-serif", boxSizing:'border-box', transition:'border-color 0.2s' }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8f9fb 0%,#eef0ff 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', fontFamily:"'Segoe UI', Arial, sans-serif" }}>
      <div style={{ position:'absolute', top:20, right:24 }}>
        <button onClick={() => setLang(lang==='he'?'en':'he')} style={{ background:'white', border:'1px solid #ddd', borderRadius:20, padding:'0.3rem 0.9rem', cursor:'pointer', fontSize:'0.8rem', color:'#555', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>{lang==='he'?'EN':'HE'}</button>
      </div>
      <div style={{ background:'white', borderRadius:20, padding:'2.5rem', width:'100%', maxWidth:480, boxShadow:'0 8px 40px rgba(108,99,255,0.12)', direction: lang==='he'?'rtl':'ltr' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2.2rem', fontWeight:900, background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillLink</div>
        </div>

        {/* ROLE SELECT */}
        <p style={{ fontWeight:700, color:'#333', marginBottom:'0.8rem', fontSize:'0.95rem' }}>{t.choosRole}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem', marginBottom:'1.5rem' }}>
          {(['mentor','mentee'] as const).map(r => (
            <div key={r} onClick={() => setRole(r)} style={{ border:`2px solid ${role===r?'#6c63ff':'#e0e0e0'}`, borderRadius:12, padding:'1rem', cursor:'pointer', textAlign:'center', background: role===r?'#f0eeff':'white', transition:'all 0.2s' }}>
              <div style={{ fontSize:'1.6rem', marginBottom:'0.3rem' }}>{r==='mentor'?'🎯':'🌱'}</div>
              <div style={{ fontWeight:700, color: role===r?'#6c63ff':'#333', fontSize:'0.95rem' }}>{r==='mentor'?t.mentor:t.mentee}</div>
              <div style={{ fontSize:'0.75rem', color:'#888', marginTop:'0.2rem' }}>{r==='mentor'?t.mentorSub:t.menteeSub}</div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
          {[{label:t.name, val:name, set:setName, type:'text', ph:lang==='he'?'שם מלא':'Full name'},{label:t.email, val:email, set:setEmail, type:'email', ph:'you@example.com'},{label:t.password, val:password, set:setPassword, type:'password', ph:'••••••••'},{label:t.phone, val:phone, set:setPhone, type:'tel', ph:'05X-XXXXXXX'},{label:t.profession, val:profession, set:setProfession, type:'text', ph:lang==='he'?'צילום, שיעורי ניהול, קוסמטיקה...':'Photography, Management, Cosmetology...'}].map(f => (
            <div key={f.label}>
              <label style={{ fontSize:'0.8rem', fontWeight:600, color:'#555', display:'block', marginBottom:'0.35rem' }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} type={f.type} placeholder={f.ph} style={inputStyle} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
          ))}
          <div>
            <label style={{ fontSize:'0.8rem', fontWeight:600, color:'#555', display:'block', marginBottom:'0.35rem' }}>{t.bio}</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={lang==='he'?'ספר קצת על עצמך...':'Tell us a bit about yourself...'} style={{ ...inputStyle, minHeight:80, resize:'vertical' }} onFocus={e => e.target.style.borderColor='#6c63ff'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
          </div>
        </div>

        {error && <div style={{ background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:8, padding:'0.6rem 0.8rem', fontSize:'0.83rem', color:'#c62828', marginTop:'0.8rem' }}>{error}</div>}

        <button onClick={handleSignup} disabled={loading} style={{ width:'100%', background: loading?'#ccc':'linear-gradient(135deg,#6c63ff,#3ecfcf)', color:'white', border:'none', borderRadius:10, padding:'0.9rem', fontSize:'1rem', fontWeight:700, cursor: loading?'default':'pointer', boxShadow: loading?'none':'0 4px 14px rgba(108,99,255,0.35)', marginTop:'1.2rem' }}>
          {loading ? t.loading : t.submit}
        </button>

        <div style={{ textAlign:'center', marginTop:'1.2rem', fontSize:'0.87rem', color:'#888' }}>
          {t.hasAccount} <a href="/login" style={{ color:'#6c63ff', fontWeight:700, textDecoration:'none' }}>{t.login}</a>
        </div>
      </div>
    </div>
  )
}
