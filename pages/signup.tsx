import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const professions = [
  'אינסטלטור / צנרת',
  'חשמלאי / טכנאי חשמל',
  'טכנאי מחשבים / סלולר',
  'נגר / רהיטים',
  'רתך / מסגר',
  'ספר גברים',
  'שף / בישול מקצועי',
  'נהג מקצועי / נהג רכב כבד',
  'מאמן כושר / מדריך ספורט',
  'צבע / שיפוצים',
  'מכונאי רכב / אופנועים',
  'תיקוני בית / עבודות שירותי בית',
  'אחר'
]

const areas = [
  'מרכז',
  'צפון',
  'דרום',
  'ירושלים',
  'שרון',
  'חיפה והסביבה',
  'באר שבע והדרום',
  'אזור פתח תקווה'
]

const experienceOptions = [
  'פחות מ-1 שנה',
  '1–3 שנים',
  '3–5 שנים',
  'יותר מ-5 שנים'
]

const goals = [
  'רוצה ללמוד מקצוע חדש',
  'רוצה לשפר מיומנות קיימת',
  'רוצה ניסיון מעשי בשטח',
  'רוצה להיות עצמאי ולהקים עסק',
  'רוצה להצטרף לעבודה קבועה עם בעל מקצוע מנוסה ולהגדיל איתו את העסק',
  'אחר'
]

export default function Signup() {
  const router = useRouter()
  const { role: initialRole } = router.query
  const [role, setRole] = useState<'mentor' | 'student' | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    area: '',
    specialties: [] as string[],
    otherSpecialty: '',
    experience: '',
    bio: '',
    goal: '',
    otherGoal: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialRole === 'mentor') setRole('mentor')
    if (initialRole === 'student') setRole('student')
  }, [initialRole])

  const toggleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s) 
        ? prev.specialties.filter(item => item !== s)
        : [...prev.specialties, s]
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create Auth User (using email if contact looks like one, or pseudo-email for phone)
      const isEmail = formData.contact.includes('@')
      const authEmail = isEmail ? formData.contact : `${formData.contact}@skilllink.phone`
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: formData.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

      // 2. Create Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          full_name: formData.fullName,
          role: role,
          city: formData.area,
          profession: role === 'mentor' ? formData.specialties.join(', ') : null,
          bio: formData.bio,
          phone: !isEmail ? formData.contact : null,
          // Extra metadata for matching
          experience_years: role === 'mentor' ? formData.experience : null,
          learning_goal: role === 'student' ? formData.goal : null
        }])

      if (profileError) throw profileError

      router.push('/feed')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!role) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', direction: 'rtl' }}>
        <h2>בחר סוג חשבון</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
          <button onClick={() => setRole('mentor')} style={{ padding: '20px 40px', fontSize: '1.2rem', cursor: 'pointer' }}>מנטור</button>
          <button onClick={() => setRole('student')} style={{ padding: '20px 40px', fontSize: '1.2rem', cursor: 'pointer' }}>תלמיד</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      direction: 'rtl',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>SkillLink</h1>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>הרשמה מהירה למערכת</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>בתור {role === 'mentor' ? 'מנטור' : 'תלמיד'}</p>

        {error && <div style={{ background: '#fff0f0', color: '#d32f2f', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffcdd2' }}>{error}</div>}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Base Fields */}
          <div style={{ position: 'relative' }}>
            <input
              required
              placeholder="שם מלא"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <input
            required
            placeholder="מייל / טלפון"
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
          />

          <select
            required
            value={formData.area}
            onChange={e => setFormData({ ...formData, area: e.target.value })}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fff' }}
          >
            <option value="">אזור / עיר בארץ</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Specialities (Multi-choice) */}
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '12px' }}>
              {role === 'mentor' ? 'תחום התמחות (בחר אחד או יותר):' : 'מה תרצה ללמוד? (בחר אחד או יותר):'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {professions.map(p => (
                <div
                  key={p}
                  onClick={() => toggleSpecialty(p)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    border: '1.5px solid',
                    borderColor: formData.specialties.includes(p) ? '#000' : '#ddd',
                    background: formData.specialties.includes(p) ? '#000' : '#fff',
                    color: formData.specialties.includes(p) ? '#fff' : '#000',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
            {formData.specialties.includes('אחר') && (
              <input
                placeholder="פרט תחום נוסף..."
                value={formData.otherSpecialty}
                onChange={e => setFormData({ ...formData, otherSpecialty: e.target.value })}
                style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            )}
          </div>

          {/* Role Specific Fields */}
          {role === 'mentor' && (
            <>
              <select
                required
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">ניסיון רלוונטי בשנים</option>
                {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <textarea
                required
                placeholder="תיאור קצר / למה כדאי ללמוד ממך? (1-2 משפטים)"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', resize: 'none' }}
              />
            </>
          )}

          {role === 'student' && (
            <>
              <select
                required
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">מטרה / סיבה ללמידה</option>
                {goals.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {formData.goal === 'אחר' && (
                <input
                  placeholder="פרט מטרה נוספת..."
                  value={formData.otherGoal}
                  onChange={e => setFormData({ ...formData, otherGoal: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              )}
            </>
          )}

          <input
            required
            type="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          />

          <button
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              background: '#e6b800',
              color: '#000',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'יוצר חשבון...' : 'צור חשבון והתחבר'}
          </button>

          <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
            על ידי הרשמה אתה מסכים לתנאי השימוש
          </p>
        </form>
      </div>
    </div>
  )
}
