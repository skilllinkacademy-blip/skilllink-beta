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
  'מרכז', 'צפון', 'דרום', 'ירושלים', 'שרון', 'חיפה והסביבה', 'באר שבע והדרום', 'אזור פתח תקווה'
]

const experienceOptions = [
  'פחות מ-1 שנה', '1–3 שנים', '3–5 שנים', 'יותר מ-5 שנים'
]

const goals = [
  'רוצה ללמוד מקצוע חדש', 'רוצה לשפר מיומנות קיימת', 'רוצה ניסיון מעשי בשטח', 'רוצה להיות עצמאי ולהקים עסק', 'רוצה להצטרף לעבודה קבועה עם בעל מקצוע מנוסה ולהגדיל איתו את העסק', 'אחר'
]

export default function Signup() {
  const router = useRouter()
  const { role: initialRole } = router.query
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'mentor' | 'student' | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    area: '',
    specialties: [] as string[],
    experience: '',
    bio: '',
    goal: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialRole === 'mentor') {
      setRole('mentor')
      setStep(2)
    } else if (initialRole === 'student') {
      setRole('student')
      setStep(2)
    }
  }, [initialRole])

  const toggleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s) 
        ? prev.specialties.filter(item => item !== s)
        : [...prev.specialties, s]
    }))
  }

  const handleSignup = async () => {
    setError('')
    setLoading(true)
    try {
      const isEmail = formData.contact.includes('@')
      const authEmail = isEmail ? formData.contact : `${formData.contact}@skilllink.phone`
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: formData.password,
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

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

  const renderStep1 = () => (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px' }}>מי אתה?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <button 
          onClick={() => { setRole('mentor'); setStep(2); }}
          style={{ padding: '25px', fontSize: '1.5rem', fontWeight: 800, borderRadius: '50px', border: '3px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}
        >
          אני מנטור / מקצוען
        </button>
        <button 
          onClick={() => { setRole('student'); setStep(2); }}
          style={{ padding: '25px', fontSize: '1.5rem', fontWeight: 800, borderRadius: '50px', border: '3px solid #000', background: '#fff', color: '#000', cursor: 'pointer' }}
        >
          אני תלמיד / מחפש עבודה
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>פרטים אישיים</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>אנחנו צריכים כמה פרטים כדי להתחיל</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input 
          placeholder="שם מלא"
          value={formData.fullName}
          onChange={e => setFormData({...formData, fullName: e.target.value})}
          style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}
        />
        <input 
          placeholder="מייל או טלפון"
          value={formData.contact}
          onChange={e => setFormData({...formData, contact: e.target.value})}
          style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}
        />
        <input 
          type="password"
          placeholder="בחר סיסמה"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}
        />
        <button 
          onClick={() => setStep(3)}
          disabled={!formData.fullName || !formData.contact || !formData.password}
          style={{ padding: '20px', fontSize: '1.3rem', fontWeight: 800, borderRadius: '50px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer', marginTop: '10px' }}
        >
          המשך
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>
        {role === 'mentor' ? 'הגדר פרופיל מקצועי' : 'מה המטרה שלך?'}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <select 
          value={formData.area}
          onChange={e => setFormData({...formData, area: e.target.value})}
          style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem', background: '#fff' }}
        >
          <option value="">בחר אזור פעילות</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '15px' }}>
            {role === 'mentor' ? 'תחומי התמחות:' : 'תחומי עניין:'}
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {professions.map(p => (
              <div 
                key={p}
                onClick={() => toggleSpecialty(p)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '30px',
                  border: '2px solid',
                  borderColor: formData.specialties.includes(p) ? '#000' : '#eee',
                  background: formData.specialties.includes(p) ? '#000' : '#fff',
                  color: formData.specialties.includes(p) ? '#fff' : '#000',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {role === 'mentor' ? (
          <>
            <select 
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
              style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}
            >
              <option value="">כמה שנות ניסיון יש לך?</option>
              {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <textarea 
              placeholder="ספר קצת על עצמך ועל העבודה שלך..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem', minHeight: '120px', resize: 'none' }}
            />
          </>
        ) : (
          <select 
            value={formData.goal}
            onChange={e => setFormData({...formData, goal: e.target.value})}
            style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}
          >
            <option value="">מה המטרה העיקרית שלך?</option>
            {goals.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button 
          onClick={handleSignup}
          disabled={loading}
          style={{ padding: '22px', fontSize: '1.4rem', fontWeight: 800, borderRadius: '50px', border: 'none', background: '#e6b800', color: '#000', cursor: 'pointer', marginTop: '20px' }}
        >
          {loading ? 'יוצר פרופיל...' : 'סיום והרשמה'}
        </button>
        <button 
          onClick={() => setStep(2)}
          style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
          חזור שלב
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff', direction: 'rtl', fontFamily: '\"Segoe UI\", system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: '40px', height: '6px', borderRadius: '10px', background: s <= step ? '#000' : '#eee' }} />
            ))}
          </div>
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  )
}
