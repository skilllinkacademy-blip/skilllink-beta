import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('mentor')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    if (signupError) { setError(signupError.message); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, name, phone, role, city: 'פתח תקווה' })
    }
    router.push('/dashboard')
  }

  return (
    <div style={{ padding: '2rem', direction: 'rtl', maxWidth: '400px', margin: 'auto' }}>
      <h1>SkillLink - הרשמה</h1>
      <input placeholder="שם" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      <input placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      <input type="password" placeholder="סיסמא" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      <input placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}>
        <option value="mentor">מנטור</option>
        <option value="mentee">חניכה</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignup} style={{ padding: '0.5rem 2rem' }}>הרשמה</button>
      <p><a href="/login">יש קונטו? כנס</a></p>
    </div>
  )
}
