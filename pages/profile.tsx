import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const PROFESSIONS = ['אינסטלטור','חשמלאי','מכונאי','נגר','רתך','ספר','טכנאי','בנייה','צבעי','מסגר','שרברב']
const EXPERTISE_OPTIONS = ['תיקונים ביתיים','חשמל','אינסטלציה','בנייה יבשה','ריצוף','גבס','צנרת','מיזוג אוויר','סולארי','בטיחות']
const AVAILABILITY_OPTIONS = ['בוקר (8-12)','צהריים (12-16)','אחה"צ (16-20)','ערב (20-23)','סופ"ש']
const LEVEL_OPTIONS = ['מתחיל','בינוני','מתקדם']

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({
    full_name: '',
    phone: '',
    city: '',
    avatar_url: '',
    role: '',
    profession: '',
    bio: '',
    years_experience: '',
    hourly_rate: '',
    availability: [],
    expertise: [],
    learning_goals: '',
    current_level: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signup?mode=login'); return }
      setUser(session.user)
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          city: data.city || '',
          avatar_url: data.avatar_url || '',
          role: data.role || '',
          profession: data.profession || '',
          bio: data.bio || '',
          years_experience: data.years_experience || '',
          hourly_rate: data.hourly_rate || '',
          availability: data.availability ? data.availability.split(',') : [],
          expertise: data.expertise || [],
          learning_goals: data.learning_goals || '',
          current_level: data.current_level || ''
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const toggleArray = (field: string, value: string) => {
    const arr = formData[field] as string[]
    setFormData({ ...formData, [field]: arr.includes(value) ? arr.filter((x:string) => x !== value) : [...arr, value] })
  }

  const saveProfile = async () => {
    if (!formData.full_name || !formData.role) { alert('נא למלא שם ותפקיד'); return }
    setSaving(true)
    
    const payload: any = {
      id: user.id,
      full_name: formData.full_name,
      phone: formData.phone || null,
      city: formData.city || null,
      avatar_url: formData.avatar_url || null,
      role: formData.role,
      profession: formData.profession || null,
      bio: formData.bio || null,
      updated_at: new Date().toISOString()
    }

    if (formData.role === 'mentor') {
      payload.years_experience = parseInt(formData.years_experience) || null
      payload.hourly_rate = parseInt(formData.hourly_rate) || null
      payload.availability = formData.availability.join(',')
      payload.expertise = formData.expertise
    } else {
      payload.learning_goals = formData.learning_goals || null
      payload.current_level = formData.current_level || null
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })

    if (!error) { 
      alert('פרופיל עודכן בהצלחה!')
      router.push('/feed') 
    } else { 
      alert('שגיאה בשמירה: ' + error.message) 
    }
    setSaving(false)
  }

  const inp = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }
  const sec = { display: 'flex', flexDirection: 'column' as const, gap: '20px' }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>טוען...</div>

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '40px 16px', direction: 'rtl', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>הפרופיל שלי</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '28px' }}>מלא את הפרטים כדי שאחרים יוכלו למצוא אותך</p>

        <div style={sec}>

          {/* Avatar */}
          <div style={{ textAlign: 'center' }}>
            <img src={formData.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.full_name || 'User') + '&background=000&color=fff&size=100'}
              style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: '12px', border: '4px solid #f0f2f5', objectFit: 'cover' }} />
            <input type="text" placeholder="קישור לתמונת פרופיל (URL)" value={formData.avatar_url}
              onChange={e => setFormData({ ...formData, avatar_url: e.target.value })} style={inp} />
          </div>

          {/* Role */}
          <div>
            <label style={lbl}>אני רוצה להיות *</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{v:'mentor',l:'🎓 מנטור - אני מלמד'},{v:'student',l:'📚 תלמיד - אני לומד'}].map(opt => (
                <button key={opt.v} onClick={() => setFormData({ ...formData, role: opt.v })}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '2px solid', borderColor: formData.role === opt.v ? '#000' : '#ddd',
                    background: formData.role === opt.v ? '#000' : '#fff', color: formData.role === opt.v ? '#fff' : '#333',
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Basic fields */}
          <div><label style={lbl}>שם מלא *</label><input style={inp} type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="ישראל ישראלי" /></div>
          <div><label style={lbl}>טלפון</label><input style={inp} type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="050-0000000" /></div>
          <div><label style={lbl}>עיר מגורים</label><input style={inp} type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="תל אביב" /></div>

          {/* Profession */}
          <div>
            <label style={lbl}>{formData.role === 'student' ? 'תחום שמעניין אותי' : 'מקצוע'}</label>
            <select value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} style={inp}>
              <option value="">בחר מקצוע</option>
              {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label style={lbl}>{formData.role === 'mentor' ? 'ספר על עצמך ועל הניסיון שלך' : 'ספר על עצמך'}</label>
            <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
              style={{ ...inp, height: '100px', resize: 'vertical' }} placeholder={formData.role === 'mentor' ? 'יש לי 10 שנות ניסיון בתחום האינסטלציה...' : 'אני רוצה ללמוד...'} />
          </div>

          {/* MENTOR SPECIFIC */}
          {formData.role === 'mentor' && (
            <>
              <div>
                <label style={lbl}>שנות ניסיון</label>
                <input style={inp} type="number" min="0" max="50" value={formData.years_experience} onChange={e => setFormData({ ...formData, years_experience: e.target.value })} placeholder="10" />
              </div>
              <div>
                <label style={lbl}>תעריף לשעה (₪)</label>
                <input style={inp} type="number" min="0" value={formData.hourly_rate} onChange={e => setFormData({ ...formData, hourly_rate: e.target.value })} placeholder="150" />
              </div>
              <div>
                <label style={lbl}>תחומי מומחיות</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {EXPERTISE_OPTIONS.map(e => (
                    <button key={e} onClick={() => toggleArray('expertise', e)}
                      style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid', borderColor: formData.expertise.includes(e) ? '#000' : '#ddd',
                        background: formData.expertise.includes(e) ? '#000' : '#f5f5f5', color: formData.expertise.includes(e) ? '#fff' : '#333',
                        cursor: 'pointer', fontSize: '0.9rem' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>זמינות למפגשים</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {AVAILABILITY_OPTIONS.map(a => (
                    <button key={a} onClick={() => toggleArray('availability', a)}
                      style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid', borderColor: formData.availability.includes(a) ? '#000' : '#ddd',
                        background: formData.availability.includes(a) ? '#000' : '#f5f5f5', color: formData.availability.includes(a) ? '#fff' : '#333',
                        cursor: 'pointer', fontSize: '0.9rem' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STUDENT SPECIFIC */}
          {formData.role === 'student' && (
            <>
              <div>
                <label style={lbl}>מה אתה רוצה ללמוד? (מטרות)</label>
                <textarea value={formData.learning_goals} onChange={e => setFormData({ ...formData, learning_goals: e.target.value })}
                  style={{ ...inp, height: '80px', resize: 'vertical' }} placeholder="רוצה ללמוד אינסטלציה בסיסית לתיקונים בבית..." />
              </div>
              <div>
                <label style={lbl}>רמת הידע הנוכחית שלך</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {LEVEL_OPTIONS.map(l => (
                    <button key={l} onClick={() => setFormData({ ...formData, current_level: l })}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid', borderColor: formData.current_level === l ? '#000' : '#ddd',
                        background: formData.current_level === l ? '#000' : '#fff', color: formData.current_level === l ? '#fff' : '#333',
                        fontWeight: 600, cursor: 'pointer' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button onClick={saveProfile} disabled={saving}
            style={{ background: '#000', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
            {saving ? 'שומר...' : 'שמור ועבור לפיד'}
          </button>
        </div>
      </div>
    </div>
  )
}
