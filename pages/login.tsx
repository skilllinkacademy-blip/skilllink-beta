import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <div style={{ padding: '2rem', direction: 'rtl', maxWidth: '400px', margin: 'auto' }}>
      <h1>SkillLink - כניסה</h1>
      <input placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      <input type="password" placeholder="סיסמא" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin} style={{ padding: '0.5rem 2rem' }}>כניסה</button>
      <p><a href="/signup">אין קונטו? הרשם</a></p>
    </div>
  )
}
