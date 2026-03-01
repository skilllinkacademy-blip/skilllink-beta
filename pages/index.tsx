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
      {/* Logo Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '5rem',
          fontWeight: 900,
          letterSpacing: '-3px',
          margin: 0,
          color: '#000',
          lineHeight: 1
        }}>
          SkillLink
        </h1>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          margin: '10px 0 0 0',
          color: '#000'
        }}>
          החוויה המושלמת לחיבור בין מקצוענים
        </p>
      </div>

      {/* Buttons Section */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button
          onClick={() => router.push('/signup?role=mentor')}
          style={{
            width: '100%',
            padding: '22px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.4rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          כניסה כמנטור
        </button>

        <button
          onClick={() => router.push('/signup?role=student')}
          style={{
            width: '100%',
            padding: '22px',
            background: '#fff',
            color: '#000',
            border: '3px solid #000',
            borderRadius: '50px',
            fontSize: '1.4rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          כניסה כתלמיד
        </button>
      </div>

      {/* Footer Section */}
      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#000', marginBottom: '25px', fontWeight: 600 }}>
          אין לך חשבון? <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => router.push('/signup')}>הירשם עכשיו</span>
        </p>
        
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', fontSize: '2rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.82-1.67 2.87-4.14 2.87-7.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div style={{ cursor: 'pointer', fontSize: '2rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.74.82 0 1.99-.83 3.58-.69 1.5.13 2.65.73 3.33 1.72-3.01 1.81-2.52 5.98.48 7.21-.61 1.53-1.41 3.03-2.5 3.99zM12.03 7.25c-.08-2.69 2.21-4.91 4.85-5.1.36 2.86-2.86 5.08-4.85 5.1z" fill="#000"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
