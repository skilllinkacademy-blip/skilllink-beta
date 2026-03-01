import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { title: 'SkillLink', welcome: 'ברוך הבא', logout: 'יציאה', feed: 'Feed', profile: 'פרופיל', mentor: 'מנטור', apprentice: 'חניך', welcomeMsg: 'ברוך הבא ל-SkillLink בטא!', exploreMsg: 'עיין ב-Feed, שתף טיפים, שאל שאלות, ותן פתרונות' },
    en: { title: 'SkillLink', welcome: 'Welcome', logout: 'Logout', feed: 'Feed', profile: 'Profile', mentor: 'Mentor', apprentice: 'Apprentice', welcomeMsg: 'Welcome to SkillLink Beta!', exploreMsg: 'Browse the Feed, share tips, ask questions, and provide solutions' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
        if (data) setProfile(data)
      })
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = profile?.full_name?.split(' ').map((n:string)=>n[0]).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillLink</span>
          </div>
          <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>{t.feed}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
          <div className="avatar" style={{ cursor: 'pointer' }}>{initials}</div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.3)', color: '#FF6584', padding: '8px 18px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>{t.logout}</button>
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Hero */}
        <div className="animate-fadeIn" style={{ marginBottom: '48px' }}>
          <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 24px' }}>{initials}</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>{t.welcomeMsg}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 600 }}>{profile?.full_name || user?.email}</span>
            {profile?.role && <span className="badge" style={{ background: profile.role === 'mentor' ? 'rgba(108,99,255,0.2)' : 'rgba(67,233,123,0.2)', color: profile.role === 'mentor' ? 'var(--primary-light)' : 'var(--accent)', border: `1px solid ${profile.role === 'mentor' ? 'rgba(108,99,255,0.3)' : 'rgba(67,233,123,0.3)'}` }}>{profile.role === 'mentor' ? t.mentor : t.apprentice}</span>}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>{t.exploreMsg}</p>
        </div>

        {/* CTA */}
        <button onClick={() => router.push('/feed')} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', marginBottom: '32px' }}>
          💭 {t.feed}
        </button>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '48px' }}>
          {[
            { icon: '💡', title: lang === 'he' ? 'שתף טיפים' : 'Share Tips', desc: lang === 'he' ? 'שתף טיפים מקצועיים' : 'Share professional tips' },
            { icon: '❓', title: lang === 'he' ? 'שאל שאלות' : 'Ask Questions', desc: lang === 'he' ? 'קבל תשובות מהקהילה' : 'Get answers from community' },
            { icon: '✅', title: lang === 'he' ? 'ספק פתרונות' : 'Provide Solutions', desc: lang === 'he' ? 'עזור לאחרים' : 'Help others' }
          ].map((f, i) => (
            <div key={i} className="glass card-hover" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
