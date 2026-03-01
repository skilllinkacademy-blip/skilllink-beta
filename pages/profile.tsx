import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

const PROFESSIONS = ['אינטלקטואי','חשמלאי','מכונאי','נגר','רוכל','ספר','סלנאי','בניה','זבעי','טפסר','שרברב']
const EXPERTISE_OPTIONS = ['תיקונים ביתיים','חשמל','אינסטלציה','בניה יבשה','גבס','ריצוף','צנרת','פיתוח אחורי','מלחים','בטיחות']
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
    current_level: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: profile }) => {
        if (profile) setFormData({ ...formData, ...profile })
        setLoading(false)
      })
    })
  }, [])

  const toggleArray = (field: string, value: string) => {
    setFormData((prev: any) => {
      const arr: string[] = prev[field] || []
      return { ...prev, [field]: arr.includes(value) ? arr.filter((x: string) => x !== value) : [...arr, value] }
    })
  }

  const saveProfile = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...formData,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (!error) router.push('/feed')
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>טוען...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>הפרופיל שלי</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>מלא את הפרטים כדי שאחרים יוכלו למצוא אותך</p>

        {/* Avatar */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>תמונת פרופיל (URL)</label>
          <input
            value={formData.avatar_url}
            onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
            placeholder="https://..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}
          />
          {formData.avatar_url && <img src={formData.avatar_url} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 12, objectFit: 'cover' }} />}
        </div>

        {/* Role */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>אני</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['mentor', 'student'].map(r => (
              <button key={r} onClick={() => setFormData({ ...formData, role: r })}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid', borderColor: formData.role === r ? '#000' : '#ddd', background: formData.role === r ? '#000' : '#fff', color: formData.role === r ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>
                {r === 'mentor' ? 'מנטור - יש לי ניסיון ללמד' : 'תלמיד - רוצה ללמוד'}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        {[
          { key: 'full_name', label: 'שם מלא', placeholder: 'ישראל ישראלי' },
          { key: 'phone', label: 'טלפון', placeholder: '050-1234567' },
          { key: 'city', label: 'עיר', placeholder: 'תל אביב' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{label}</label>
            <input
              value={formData[key]}
              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
              placeholder={placeholder}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}
            />
          </div>
        ))}

        {/* Profession */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>מקצוע</label>
          <select value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }}>
            <option value="">בחר מקצוע</option>
            {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>קצת עלי</label>
          <textarea
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            placeholder="ספר על עצמך, הניסיון שלך, מה אתה אוהב..."
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        {/* Mentor Fields */}
        {formData.role === 'mentor' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>שנות ניסיון</label>
              <input type="number" value={formData.years_experience}
                onChange={e => setFormData({ ...formData, years_experience: e.target.value })}
                placeholder="5"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>מחיר לשעה (₪)</label>
              <input type="number" value={formData.hourly_rate}
                onChange={e => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder="100"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>תחומי מומחיות</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EXPERTISE_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => toggleArray('expertise', opt)}
                    style={{ padding: '8px 14px', borderRadius: '20px', border: '2px solid', borderColor: (formData.expertise || []).includes(opt) ? '#000' : '#ddd', background: (formData.expertise || []).includes(opt) ? '#000' : '#fff', color: (formData.expertise || []).includes(opt) ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>זמינות</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => toggleArray('availability', opt)}
                    style={{ padding: '8px 14px', borderRadius: '20px', border: '2px solid', borderColor: (formData.availability || []).includes(opt) ? '#000' : '#ddd', background: (formData.availability || []).includes(opt) ? '#000' : '#fff', color: (formData.availability || []).includes(opt) ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Student Fields */}
        {formData.role === 'student' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>מה אתה רוצה ללמוד?</label>
              <textarea value={formData.learning_goals}
                onChange={e => setFormData({ ...formData, learning_goals: e.target.value })}
                placeholder="ספר על המטרות שלך, מה אתה רוצה להשיג..."
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>רמה נוכחית</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {LEVEL_OPTIONS.map((lvl, i) => (
                  <button key={lvl} onClick={() => setFormData({ ...formData, current_level: i + 1 })}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid', borderColor: formData.current_level === i + 1 ? '#000' : '#ddd', background: formData.current_level === i + 1 ? '#000' : '#fff', color: formData.current_level === i + 1 ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>זמינות</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => toggleArray('availability', opt)}
                    style={{ padding: '8px 14px', borderRadius: '20px', border: '2px solid', borderColor: (formData.availability || []).includes(opt) ? '#000' : '#ddd', background: (formData.availability || []).includes(opt) ? '#000' : '#fff', color: (formData.availability || []).includes(opt) ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={saveProfile}
          disabled={saving}
          style={{ background: '#000', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', width: '100%', cursor: 'pointer' }}
        >
          {saving ? 'שומר...' : 'שמור פרופיל'}
        </button>
      </div>
    </div>
  )
}
