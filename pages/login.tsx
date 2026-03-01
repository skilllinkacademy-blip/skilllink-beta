import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const isEmail = contact.includes('@')
    const authEmail = isEmail ? contact : `${contact}@skilllink.phone`

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    })

    if (error) {
      setError('פרטי התחברות שגויים. נסה שוב.')
      setLoading(false)
    } else {
      router.push('/feed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      direction: 'rtl',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px', textAlign: 'center' }}>SkillLink</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '30px', textAlign: 'center' }}>התחברות למערכת</h2>

        {error && <div style={{ background: '#fff0f0', color: '#d32f2f', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffcdd2' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            required
            placeholder="מייל / טלפון"
            value={contact}
            onChange={e => setContact(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <input
            required
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          
          <button
            disabled={loading}
            type="submit"
            style={{
              padding: '18px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
          אין לך חשבון?{' '}
          <span
            onClick={() => router.push('/')}
            style={{ color: '#000', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            הירשם עכשיו
          </span>
        </p>
      </div>
    </div>
  )
}
