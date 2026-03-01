import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      direction: 'rtl',
      padding: '40px 24px'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: '#000'
        }}>
          <span style={{ fontWeight: 900 }}>Skill</span>
          <span style={{ fontWeight: 300 }}>Link</span>
        </span>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: '1.1rem',
        color: '#555',
        marginBottom: '48px',
        fontWeight: 400,
        textAlign: 'center'
      }}>
        החווייה המושלמת לחיבור בין מקצוענים
      </p>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={() => router.push('/signup?role=mentor')}
          style={{
            width: '100%',
            padding: '18px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          כניסה כמנטור
        </button>

        <button
          onClick={() => router.push('/signup?role=student')}
          style={{
            width: '100%',
            padding: '18px',
            background: '#fff',
            color: '#000',
            border: '2.5px solid #000',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5' }}
          onMouseOut={e => { e.currentTarget.style.background = '#fff' }}
        >
          כניסה כתלמיד
        </button>
      </div>

      {/* Login link */}
      <p style={{ marginTop: '40px', fontSize: '0.95rem', color: '#666' }}>
        יש לך כבר חשבון?{' '}
        <span
          onClick={() => router.push('/login')}
          style={{ color: '#000', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
        >
          התחבר עכשיו
        </span>
      </p>

      {/* Social login icons */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: '1.5px solid #ddd', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem'
        }}>
          G
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: '1.5px solid #ddd', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem'
        }}>
          
        </div>
      </div>
    </div>
  )
}
