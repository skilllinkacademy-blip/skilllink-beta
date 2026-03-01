import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Calendar() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signup?mode=login'); return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(prof)
      setLoading(false)
    }
    init()
  }, [])

  const nav = {
    position: 'fixed' as const, bottom: 0, left: 0, right: 0, background: '#fff',
    borderTop: '1px solid #eee', padding: '15px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', zIndex: 100
  }

  const today = new Date()
  const daysOfWeek = ['אחד','שני','שלישי','רביעי','חמישי','שישי','שבת']
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>טוען...</div>

  return (
    <div style={{ background: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui,sans-serif', paddingBottom: '80px' }}>
      {/* Header */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>🔙</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>הלוח שיעורים</h1>
      </nav>

      {/* Calendar */}
      <div style={{ padding: '20px' }}>
        {/* Month navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>&gt;</button>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{months[currentMonth]} {currentYear}</h2>
          <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>&lt;</button>
        </div>

        {/* Days header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {daysOfWeek.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', fontWeight: 600, padding: '8px 0' }}>{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={'empty-' + i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
            return (
              <div key={day} style={{
                textAlign: 'center', padding: '10px 4px', borderRadius: '8px', cursor: 'pointer',
                background: isToday ? '#000' : '#f9f9f9',
                color: isToday ? '#fff' : '#333',
                fontWeight: isToday ? 800 : 400,
                border: '1px solid', borderColor: isToday ? '#000' : '#eee'
              }}>
                {day}
              </div>
            )
          })}
        </div>

        {/* Upcoming sessions */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>שיעורים קרובים</h3>
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📅</div>
            <p style={{ fontSize: '1rem', marginBottom: '16px' }}>אין שיעורים מתוכננים עדיין</p>
            <button onClick={() => router.push('/search')}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              מצא מנטור
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={nav}>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/feed')}>🏠</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/search')}>🔍</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/messages')}>💬</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#000' }}>📅</div>
        <div style={{ fontSize: '1.8rem', cursor: 'pointer', color: '#888' }} onClick={() => router.push('/profile')}>👤</div>
      </div>
    </div>
  )
}
