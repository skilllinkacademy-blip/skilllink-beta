import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: {
      title: 'SkillLink',
      welcome: 'ברוך הבא',
      logout: 'יציאה',
      myOpps: 'ההזדמנויות שלי',
      myApps: 'הבקשות שלי',
      addOpp: '+ הוסף הזדמנות',
      noOpps: 'אין הזדמנויות עדיין',
      noApps: 'אין בקשות עדיין',
      mentor: 'מנטור',
      apprentice: 'חניך',
      pending: 'ממתין',
      accepted: 'אושר',
      rejected: 'נדחה',
      spots: 'מקומות',
      duration: 'משך',
      profile: 'פרופיל',
      role: 'תפקיד',
    },
    en: {
      title: 'SkillLink',
      welcome: 'Welcome',
      logout: 'Logout',
      myOpps: 'My Opportunities',
      myApps: 'My Applications',
      addOpp: '+ Add Opportunity',
      noOpps: 'No opportunities yet',
      noApps: 'No applications yet',
      mentor: 'Mentor',
      apprentice: 'Apprentice',
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      spots: 'spots',
      duration: 'duration',
      profile: 'Profile',
      role: 'Role',
    }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
        if (data) setProfile(data)
      })
      supabase.from('opportunities').select('*').eq('created_by', session.user.id).order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setOpportunities(data)
      })
      supabase.from('applications').select('*, opportunities(title)').eq('applicant_id', session.user.id).order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setApplications(data)
      })
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const statusBadge = (status: string) => {
    const map: any = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected' }
    const label: any = { pending: t.pending, accepted: t.accepted, rejected: t.rejected }
    return <span className={`badge ${map[status] || 'badge-pending'}`}>{label[status] || status}</span>
  }

  const initials = profile?.full_name?.split(' ').map((n:string)=>n[0]).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif" }}>
      {/* BG Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white' }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillLink</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
          <div className="avatar" style={{ cursor: 'pointer' }}>{initials}</div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.3)', color: '#FF6584', padding: '8px 18px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>{t.logout}</button>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 2 }}>
        {/* Hero greeting */}
        <div className="animate-fadeIn" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>{initials}</div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{t.welcome}{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                {profile?.role && <span className="badge" style={{ background: profile.role === 'mentor' ? 'rgba(108,99,255,0.2)' : 'rgba(67,233,123,0.2)', color: profile.role === 'mentor' ? 'var(--primary-light)' : 'var(--accent)', border: `1px solid ${profile.role === 'mentor' ? 'rgba(108,99,255,0.3)' : 'rgba(67,233,123,0.3)'}` }}>{profile.role === 'mentor' ? t.mentor : t.apprentice}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        {profile?.role === 'mentor' && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>{t.myOpps}</h2>
              <button onClick={() => router.push('/new-opportunity')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>{t.addOpp}</button>
            </div>
            {opportunities.length === 0 ? (
              <div className="glass" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
                <p>{t.noOpps}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {opportunities.map((opp) => (
                  <div key={opp.id} className="glass card-hover" style={{ padding: '24px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '8px' }}>{opp.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{opp.description?.slice(0,100)}{opp.description?.length > 100 ? '...' : ''}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>⏱ {opp.duration}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>👥 {opp.spots} {t.spots}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Applications Section */}
        {profile?.role === 'apprentice' && (
          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>{t.myApps}</h2>
            {applications.length === 0 ? (
              <div className="glass" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
                <p>{t.noApps}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.map((app) => (
                  <div key={app.id} className="glass card-hover" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{app.opportunities?.title || 'Opportunity'}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    {statusBadge(app.status)}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Browse opportunities for apprentices */}
        {profile?.role === 'apprentice' && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button onClick={() => router.push('/opportunities')} className="btn-primary">{lang === 'he' ? 'עיין בהזדמנויות' : 'Browse Opportunities'}</button>
          </div>
        )}
      </main>
    </div>
  )
}
