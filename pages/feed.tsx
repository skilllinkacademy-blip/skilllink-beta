import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  const handlePost = async () => {
    if (!newPost.trim()) return
    if (!user) {
      router.push('/login')
      return
    }
    const { error } = await supabase.from('posts').insert({
      content: newPost,
      author_id: user.id,
      type: 'general'
    })
    if (!error) {
      setNewPost('')
      fetchPosts()
    } else {
      alert('שגיאה: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', direction: 'rtl', fontFamily: "'Heebo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #ddd', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0866FF' }}>SkillLink</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#65676B', fontSize: '14px' }}>{user.email}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>יציאה</button>
            </>
          ) : (
            <button onClick={() => router.push('/login')} style={{ background: '#0866FF', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>התחבר</button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Create Post */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <textarea
            placeholder="מה אתה רוצה לשתף?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ width: '100%', border: 'none', background: '#F0F2F5', padding: '12px', borderRadius: '8px', resize: 'none', outline: 'none', fontSize: '16px', minHeight: '80px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handlePost}
              disabled={!newPost.trim()}
              style={{ background: newPost.trim() ? '#0866FF' : '#BCC0C4', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'default', fontSize: '15px', transition: 'background 0.2s' }}
            >
              פרסם
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#65676B' }}>טוען...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#65676B', background: 'white', borderRadius: '10px', border: '1px solid #ddd' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
            <p>אין פוסטים עדיין. היה הראשון לשתף!</p>
          </div>
        ) : (
          posts.map(p => (
            <div key={p.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0866FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                  {(p.author_name || p.author_id || '?')[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#050505' }}>{p.author_name || 'משתמש SkillLink'}</div>
                  <div style={{ fontSize: '12px', color: '#65676B' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('he-IL') : ''}</div>
                </div>
              </div>
              <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#050505', marginBottom: '12px' }}>{p.content}</div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-around', color: '#65676B', fontWeight: 600, fontSize: '14px' }}>
                <span style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' }}>👍 לייק</span>
                <span style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' }}>💬 תגובה</span>
                <span style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' }}>🔁 שתף</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
