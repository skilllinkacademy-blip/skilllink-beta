import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    profession: '',
    location: ''
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          profession: data.profession || '',
          location: data.location || ''
        })
      }
      setLoading(false)
    }
    init()
  }, [])

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${user.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('שגיאה בהעלאה: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (!error) {
      setProfile({ ...profile, avatar_url: publicUrl })
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)

    if (error) {
      alert('שגיאה: ' + error.message)
    } else {
      setProfile({ ...profile, ...formData })
      alert('הפרופיל נשמר בהצלחה!')
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>טוען...</div>

  const initials = formData.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email[0].toUpperCase()

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', direction: 'rtl', fontFamily: "'Heebo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #E9ECEF', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>
            <span style={{ color: '#000000' }}>Skill</span>
            <span style={{ color: '#FF8C00' }}>Link</span>
          </span>
        </div>
        <button onClick={() => router.push('/feed')} style={{ background: '#000', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>חזרה לפיד</button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Avatar Section */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px', border: '1px solid #E9ECEF', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #FF8C00', background: '#FF8C00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '2.5rem' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          <label htmlFor="avatar-upload" style={{ display: 'inline-block', background: '#FF8C00', color: 'white', padding: '10px 28px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', border: 'none' }}>
            {uploading ? 'מעלה...' : '📷 שנה תמונה'}
          </label>
          <p style={{ marginTop: '12px', color: '#ADB5BD', fontSize: '0.85rem' }}>תמונת פרופיל עוזרת לאנשים לזהות אותך בקהילה</p>
        </div>

        {/* Profile Info */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E9ECEF', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#212529', marginBottom: '24px' }}>פרטי פרופיל</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#495057', fontSize: '0.95rem' }}>שם מלא</label>
            <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DEE2E6', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} placeholder="אריה כהן" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#495057', fontSize: '0.95rem' }}>תחום מקצוע</label>
            <input value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DEE2E6', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} placeholder="מפתח Full Stack" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#495057', fontSize: '0.95rem' }}>מיקום</label>
            <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DEE2E6', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} placeholder="תל אביב" />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#495057', fontSize: '0.95rem' }}>אודות</label>
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DEE2E6', fontSize: '1rem', outline: 'none', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }} placeholder="ספר על עצמך, הניסיון שלך ומה אתה יכול לעזור בו" />
          </div>

          <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: '#000', color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 800, fontSize: '1.05rem', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </div>
    </div>
  )
}
