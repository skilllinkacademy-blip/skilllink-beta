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
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: '"Segoe UI", system-ui, sans-serif', direction: 'ltr' }}>

      {/* TOP NAV */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 48px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* Logo - left */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', color: '#111', letterSpacing: '-1.5px' }}>Skill</span>
          <span style={{ fontWeight: 300, fontSize: '1.6rem', color: '#111', letterSpacing: '-1.5px' }}>Link</span>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', color: '#2563eb', marginLeft: 1 }}>.</span>
        </div>

        {/* Search - center */}
        <div style={{ flex: 1, maxWidth: 440, margin: '0 48px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Search profession, skill, or mentor..."
            style={{
              width: '100%',
              padding: '9px 16px 9px 38px',
              borderRadius: 24,
              border: '1px solid #e0e0e0',
              fontSize: '0.9rem',
              background: '#f7f7f7',
              outline: 'none',
              boxSizing: 'border-box',
              color: '#333',
            }}
          />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: '#444', fontWeight: 500, padding: '8px 12px' }}>
            Sign in
          </button>
          <button onClick={() => router.push('/signup')}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}>
            Join free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#fff', display: 'flex', alignItems: 'center', minHeight: 500, padding: '40px 80px', gap: 60 }}>
        {/* Left */}
        <div style={{ flex: 1, maxWidth: 500 }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', borderRadius: 20, padding: '4px 14px', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 }}>
            The #1 platform for skilled trades
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: '#111', lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-2px' }}>
            Learn directly from<br />
            <span style={{ color: '#2563eb' }}>real professionals</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
            Connect with skilled mentors in plumbing, electrical, carpentry and more. Start your apprenticeship journey today.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={() => router.push('/signup?role=mentor')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 30px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              Join as Mentor
            </button>
            <button onClick={() => router.push('/signup?role=apprentice')}
              style={{ background: '#fff', color: '#111', border: '2px solid #222', borderRadius: 10, padding: '14px 30px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              Join as Apprentice
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: '0.85rem', color: '#999' }}>Free to join. No credit card required.</p>
        </div>

        {/* Right image */}
        <div style={{ flex: 1, position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=85"
            alt="skilled trade professionals"
            style={{ width: '100%', maxWidth: 560, height: 420, objectFit: 'cover', borderRadius: 20, display: 'block' }}
          />
          {/* floating badge */}
          <div style={{
            position: 'absolute', bottom: 24, left: 24,
            background: '#fff', borderRadius: 12, padding: '12px 18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Electrician</div>
              <div style={{ fontSize: '0.78rem', color: '#888' }}>12 mentors available</div>
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR APPRENTICESHIPS */}
      <div style={{ padding: '60px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', marginBottom: 6 }}>Popular Apprenticeships</h2>
        <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: 32 }}>Browse by trade and find the right mentor for you</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {TRADES.map((trade) => (
            <div key={trade.name} onClick={() => router.push('/signup?role=apprentice')}
              style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', height: 210, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
              <img src={trade.img} alt={trade.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>{trade.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Tap to explore</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUSTED BY */}
      <div style={{ padding: '56px 80px', background: '#fff', textAlign: 'center' }}>
        <p style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>
          Trusted by thousands of skilled workers
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {TRUSTED.map((src, i) => (
            <img key={i} src={src} alt="user"
              style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', border: '2px solid #f0f0f0' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
          {[['2,000+', 'Skilled Mentors'], ['15,000+', 'Apprentices'], ['50+', 'Trades']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#111' }}>{num}</div>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#111', color: '#666', textAlign: 'center', padding: '28px', fontSize: '0.85rem' }}>
        © 2026 SkillLink. All rights reserved.
      </div>

    </div>
  )
}
