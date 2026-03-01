import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    profession: '',
    bio: '',
    location: '',
    avatar_url: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
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
          profession: data.profession || '',
          bio: data.bio || '',
          location: data.location || '',
          avatar_url: data.avatar_url || ''
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData,
        updated_at: new Date()
      })
    
    if (!error) {
      alert('Profile updated!')
      router.push('/feed')
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Setup Your Profile</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src={formData.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: '12px', border: '4px solid #f0f2f5' }} 
            />
            <div>
              <input 
                type="text" 
                placeholder="Avatar URL" 
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Profession</label>
            <select 
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            >
              <option value="">Select profession</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Welder">Welder</option>
              <option value="Barber">Barber</option>
              <option value="Technician">Technician</option>
              <option value="Construction">Construction</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', height: '100px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Location</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <button 
            onClick={saveProfile}
            disabled={saving}
            style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginTop: '12px' }}
          >
            {saving ? 'Saving...' : 'Save and Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
