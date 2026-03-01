import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { title: 'SkillLink', welcome: 'ברוך הבא', logout: 'יציאה', apprenticeships: 'תוכניות חניכה', addNew: '+ פרסם תוכנית', empty: 'אין תוכניות חניכה עדיין', emptyHint: 'לחץ על "פרסם תוכנית" כדי להתחיל', open: 'פתוחה', closed: 'סגורה', location: 'מיקום', apply: 'הגש בקשה', myProfile: 'הפרופיל שלי', mentor: 'מנטור', mentee: 'חניך', home: 'בית', search: 'חיפוש', messages: 'הודעות' },
    en: { title: 'SkillLink', welcome: 'Welcome', logout: 'Logout', apprenticeships: 'Apprenticeships', addNew: '+ Post Program', empty: 'No apprenticeship programs yet', emptyHint: 'Click "Post Program" to get started', open: 'Open', closed: 'Closed', location: 'Location', apply: 'Apply', myProfile: 'My Profile', mentor: 'Mentor', mentee: 'Apprentice', home: 'Home', search: 'Search', messages: 'Messages' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
    })
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('opportunities').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setOpportunities(data)
    })
  }, [user])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  if (!user) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f8f9fb' }}>
      <div style={{ width:40, height:40, border:'4px solid #e0e0e0', borderTop:'4px solid #6c63ff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fb', fontFamily:"'Segoe UI', Arial, sans-serif" }}>
      {/* NAV */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #ececec', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:64, position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
          <span style={{ fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillLink</span>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            {[{label: t.home, href:'#'}, {label: t.apprenticeships, href:'#'}, {label: t.messages, href:'#'}].map(item => (
              <a key={item.label} href={item.href} style={{ color:'#555', textDecoration:'none', fontSize:'0.9rem', fontWeight:500, padding:'0.3rem 0', borderBottom:'2px solid transparent' }}>{item.label}</a>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={() => setLang(lang==='he'?'en':'he')} style={{ background:'#f0f0f0', border:'none', borderRadius:20, padding:'0.3rem 0.8rem', cursor:'pointer', fontSize:'0.8rem', color:'#555' }}>{lang==='he'?'EN':'HE'}</button>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.9rem' }}>{profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}</div>
            <span style={{ fontSize:'0.85rem', color:'#333', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile?.name || user?.email}</span>
          </div>
          <span style={{ fontSize:'0.75rem', background: profile?.role==='mentor'?'#e8f5e9':'#e3f2fd', color: profile?.role==='mentor'?'#2e7d32':'#1565c0', padding:'0.2rem 0.6rem', borderRadius:20, fontWeight:600 }}>{profile?.role==='mentor' ? t.mentor : t.mentee}</span>
          <button onClick={handleLogout} style={{ background:'transparent', border:'1px solid #ddd', borderRadius:8, padding:'0.35rem 0.9rem', cursor:'pointer', fontSize:'0.82rem', color:'#666' }}>{t.logout}</button>
        </div>
      </nav>

      {/* BODY */}
      <div style={{ maxWidth:1100, margin:'2rem auto', padding:'0 1.5rem', direction: lang==='he'?'rtl':'ltr' }}>
        {/* HEADER ROW */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#1a1a2e', margin:0 }}>{t.apprenticeships}</h1>
            <p style={{ color:'#888', margin:'0.3rem 0 0', fontSize:'0.9rem' }}>Petah Tikva</p>
          </div>
          {profile?.role === 'mentor' && (
            <a href="/new-opportunity" style={{ background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', color:'white', border:'none', borderRadius:10, padding:'0.7rem 1.5rem', cursor:'pointer', fontSize:'0.95rem', fontWeight:700, textDecoration:'none', boxShadow:'0 4px 14px rgba(108,99,255,0.3)' }}>{t.addNew}</a>
          )}
        </div>

        {/* GRID */}
        {opportunities.length === 0 ? (
          <div style={{ textAlign:'center', padding:'5rem 2rem', background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🌱</div>
            <h3 style={{ color:'#333', margin:'0 0 0.5rem' }}>{t.empty}</h3>
            <p style={{ color:'#aaa', fontSize:'0.9rem' }}>{t.emptyHint}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.5rem' }}>
            {opportunities.map((o) => (
              <div key={o.id} style={{ background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ background:'linear-gradient(135deg,#6c63ff22,#3ecfcf22)', padding:'1.5rem 1.5rem 1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:700, color:'#1a1a2e', lineHeight:1.4 }}>{o.title}</h3>
                    <span style={{ background: o.status==='open'?'#e8f5e9':'#ffebee', color: o.status==='open'?'#2e7d32':'#c62828', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700, whiteSpace:'nowrap', marginRight:'0.5rem' }}>{o.status==='open'?t.open:t.closed}</span>
                  </div>
                </div>
                <div style={{ padding:'1rem 1.5rem 1.5rem' }}>
                  <p style={{ color:'#666', fontSize:'0.88rem', lineHeight:1.6, margin:'0 0 1rem', minHeight:48 }}>{o.description || ''}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.8rem', color:'#999' }}>📍 {o.city || 'Petah Tikva'}</span>
                    {profile?.role === 'mentee' && o.status === 'open' && (
                      <button style={{ background:'linear-gradient(135deg,#6c63ff,#3ecfcf)', color:'white', border:'none', borderRadius:8, padding:'0.4rem 1rem', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>{t.apply}</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
