import { useRouter } from 'next/router'

const professions = [
  { name: 'Electrician', emoji: '⚡', bg: '#1a1a2e' },
  { name: 'Plumber', emoji: '🔧', bg: '#16213e' },
  { name: 'Mechanic', emoji: '🔩', bg: '#0f3460' },
  { name: 'Carpenter', emoji: '🪚', bg: '#533483' },
  { name: 'Welder', emoji: '🔥', bg: '#2b2d42' },
  { name: 'Barber', emoji: '✂️', bg: '#1b4332' },
  { name: 'Technician', emoji: '🛠️', bg: '#7b2d8b' },
  { name: 'Construction', emoji: '🏗️', bg: '#b5451b' },
]

const trusted = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/58.jpg',
  'https://randomuser.me/api/portraits/men/74.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/91.jpg',
]

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#fff', minHeight: '100vh' }}>
      {/* TOP NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-1px' }}>
          <span style={{ color: '#111' }}>Skill</span><span style={{ color: '#2563eb' }}>Link</span><span style={{ color: '#9ca3af', fontSize: '1rem' }}>...</span>
        </span>
        <div style={{ flex: 1, maxWidth: 480, margin: '0 32px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          <input
            placeholder="Search professionals..."
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 24, border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🔍</button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&#9733;</button>
          <div
            onClick={() => router.push('/login')}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#e5e7eb', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src="https://randomuser.me/api/portraits/men/32.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 420, background: 'linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200) center/cover no-repeat', opacity: 0.18 }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '64px 40px', maxWidth: 600 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#111827', lineHeight: 1.15, marginBottom: 16 }}>
            Learn directly from<br />real professionals
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: 36, maxWidth: 420 }}>
            Connect with skilled mentors in various trades and start your apprenticeship journey.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => router.push('/signup?role=mentor')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Join as Mentor
            </button>
            <button
              onClick={() => router.push('/signup?role=apprentice')}
              style={{ background: '#fff', color: '#111', border: '2px solid #d1d5db', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Join as Apprentice
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Professionals"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #f8faff 0%, transparent 30%)' }} />
        </div>
      </div>

      {/* POPULAR APPRENTICESHIPS */}
      <div style={{ padding: '48px 40px', background: '#fff' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 28 }}>Popular Apprenticeships</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {professions.map((p) => (
            <div
              key={p.name}
              onClick={() => router.push('/signup')}
              style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio: '1', background: p.bg, display: 'flex', alignItems: 'flex-end', padding: 16, transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', fontSize: '3.5rem' }}>{p.emoji}</div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', position: 'relative', zIndex: 1 }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRUSTED WORKERS */}
      <div style={{ padding: '40px', background: '#f9fafb', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 24 }}>Trusted by thousands of skilled workers</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {trusted.map((src, i) => (
            <img key={i} src={src} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          ))}
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/login')}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/signup')}
            style={{ background: '#fff', color: '#2563eb', border: '2px solid #2563eb', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}
