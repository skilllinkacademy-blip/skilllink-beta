import { useRouter } from 'next/router'

const TRADES = [
  { name: 'Electrician', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
  { name: 'Plumber', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'Mechanic', img: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80' },
  { name: 'Carpenter', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80' },
]

const TRUSTED = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
]

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: '"Segoe UI", system-ui, sans-serif' }}>

      {/* TOP NAV */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 40px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#000', letterSpacing: '-1px' }}>Skill</span>
          <span style={{ fontWeight: 400, fontSize: '1.5rem', color: '#000', letterSpacing: '-1px' }}>Link</span>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#2563eb' }}>...</span>
        </div>

        {/* Search */}
        <div style={{
          flex: 1,
          maxWidth: 480,
          margin: '0 40px',
          position: 'relative',
        }}>
          <input
            type="text"
            placeholder="Search profession, skill, or mentor..."
            style={{
              width: '100%',
              padding: '8px 16px 8px 40px',
              borderRadius: 24,
              border: '1px solid #ddd',
              fontSize: '0.9rem',
              background: '#f5f5f5',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem' }}>🔍</span>
        </div>

        {/* Nav right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={() => router.push('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: '#333', fontWeight: 500 }}
          >
            Sign in
          </button>
          <button
            onClick={() => router.push('/signup')}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Join free
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        minHeight: 480,
        padding: '0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left text */}
        <div style={{ flex: 1, zIndex: 2, maxWidth: 520 }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.15,
            margin: '0 0 16px',
            letterSpacing: '-1px',
          }}>
            Learn directly from<br />real professionals
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: '#555',
            marginBottom: 36,
            lineHeight: 1.6,
            maxWidth: 420,
          }}>
            Connect with skilled mentors in various trades and start your apprenticeship journey.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <button
              onClick={() => router.push('/signup?role=mentor')}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '13px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Join as Mentor
            </button>
            <button
              onClick={() => router.push('/signup?role=apprentice')}
              style={{
                background: '#fff',
                color: '#111',
                border: '2px solid #111',
                borderRadius: 8,
                padding: '13px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Join as Apprentice
            </button>
          </div>
        </div>

        {/* Right image */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          minHeight: 400,
        }}>
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80"
            alt="skilled professionals"
            style={{
              width: '100%',
              maxWidth: 520,
              height: 420,
              objectFit: 'cover',
              borderRadius: 16,
            }}
          />
        </div>
      </div>

      {/* POPULAR APPRENTICESHIPS */}
      <div style={{ padding: '56px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: 28 }}>
          Popular Apprenticeships
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {TRADES.map((trade) => (
            <div
              key={trade.name}
              onClick={() => router.push('/signup?role=apprentice')}
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                height: 200,
              }}
            >
              <img
                src={trade.img}
                alt={trade.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                padding: '24px 14px 14px',
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{trade.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUSTED BY */}
      <div style={{ padding: '48px 80px', background: '#fff', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: 24 }}>
          Trusted by thousands of skilled workers
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {TRUSTED.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="user"
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                objectFit: 'cover',
                border: '2px solid #eee',
              }}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#111',
        color: '#888',
        textAlign: 'center',
        padding: '24px',
        fontSize: '0.85rem',
      }}>
        © 2026 SkillLink. All rights reserved.
      </div>

    </div>
  )
}
