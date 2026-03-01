import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState<'general' | 'tip' | 'question'>('general')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) setProfile(data)
      }
      fetchPosts()
    }
    init()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles:author_id(*)')
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
      type: postType
    })

    if (!error) {
      setNewPost('')
      setPostType('general')
      fetchPosts()
    } else {
      alert('שגיאה: ' + error.message)
    }
  }

  const Logo = () => (
    <div onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>
        <span style={{ color: '#000000' }}>Skill</span>
        <span style={{ color: '#FF8C00' }}>Link</span>
      </span>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', direction: 'rtl', fontFamily: "'Heebo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #E9ECEF', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <Logo />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div 
                onClick={() => router.push('/profile')}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eee', cursor: 'pointer', overflow: 'hidden', border: '1px solid #ddd' }}
              >
                {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{(profile?.full_name || user.email)[0].toUpperCase()}</div>}
              </div>
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} style={{ background: 'none', border: '1px solid #dee2e6', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>יציאה</button>
            </div>
          ) : (
            <button onClick={() => router.push('/login')} style={{ background: '#000', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>התחבר</button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Create Post */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #E9ECEF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
             {['general', 'tip', 'question'].map((t) => (
               <button 
                 key={t}
                 onClick={() => setPostType(t as any)}
                 style={{ 
                   flex: 1, 
                   padding: '10px', 
                   borderRadius: '12px', 
                   border: '1px solid', 
                   borderColor: postType === t ? (t === 'tip' ? '#FF8C00' : (t === 'question' ? '#007AFF' : '#000')) : '#E9ECEF',
                   background: postType === t ? (t === 'tip' ? '#FFF5E6' : (t === 'question' ? '#E6F2FF' : '#F8F9FA')) : 'white',
                   color: postType === t ? (t === 'tip' ? '#CC7000' : (t === 'question' ? '#005BBF' : '#000')) : '#6C757D',
                   fontWeight: 700,
                   fontSize: '0.9rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                 {t === 'general' ? '📝 פוסט' : t === 'tip' ? '💡 טיפ' : '❓ שאלה'}
               </button>
             ))}
          </div>
          <textarea
            placeholder={postType === 'tip' ? "שתף טיפ מקצועי..." : postType === 'question' ? "מה השאלה שלך?" : "מה תרצה לשתף?"}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ width: '100%', border: 'none', background: '#F8F9FA', padding: '16px', borderRadius: '12px', resize: 'none', outline: 'none', fontSize: '1.05rem', minHeight: '100px', marginBottom: '16px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handlePost}
              disabled={!newPost.trim()}
              style={{ background: newPost.trim() ? '#000' : '#ADB5BD', color: 'white', border: 'none', padding: '10px 32px', borderRadius: '12px', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'default', fontSize: '1rem', transition: 'all 0.2s' }}
            >
              פרסם
            </button>
          </div>
        </div>

        {/* Feed Posts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#ADB5BD' }}>מעלה פוסטים...</div>
        ) : (
          posts.map(p => (
            <div key={p.id} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E9ECEF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #E9ECEF' }}>
                    {p.profiles?.avatar_url ? <img src={p.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontWeight: 700, color: '#495057' }}>{(p.profiles?.full_name || '?')[0]}</div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#212529' }}>{p.profiles?.full_name || 'משתמש מערכת'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#ADB5BD', fontWeight: 500 }}>{new Date(p.created_at).toLocaleDateString('he-IL')}</div>
                  </div>
                </div>
                {p.type !== 'general' && (
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 800,
                    background: p.type === 'tip' ? '#FFF5E6' : '#E6F2FF',
                    color: p.type === 'tip' ? '#FF8C00' : '#007AFF',
                    border: `1px solid ${p.type === 'tip' ? '#FFE0B3' : '#B3D7FF'}`
                  }}>
                    {p.type === 'tip' ? '💡 טיפ מקצועי' : '❓ שאלת פרויקט'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#212529', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{p.content}</div>
              <div style={{ borderTop: '1px solid #F1F3F5', paddingTop: '16px', display: 'flex', justifyContent: 'space-around', color: '#6C757D', fontWeight: 700, fontSize: '0.95rem' }}>
                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>👍 לייק</span>
                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>💬 תגובה</span>
                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>🔁 שתף</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
