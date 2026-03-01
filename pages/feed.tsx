import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [isPosting, setIsPosting] = useState(false)

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
      .select(`
        *,
        *      `)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      // Fetch likes count and comments count for each post
      const postsWithCounts = await Promise.all(
        data.map(async (post) => {
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
          
          const { count: commentsCount } = await supabase
            .from('post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
          
          // Check if current user liked this post
          const { data: userLike } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user?.id)
            .single()
          
          return {
            ...post,
            likesCount: likesCount || 0,
            commentsCount: commentsCount || 0,
            isLiked: !!userLike
          }
        })
      )
      setPosts(postsWithCounts)
    }
    setLoading(false)
  }

  const createPost = async () => {
    if (!newPost.trim() || !user) return
    
    setIsPosting(true)
    const { error } = await supabase
      .from('posts')
      .insert([{
        author_id: user.id,
        content: newPost
      }])
    
    if (!error) {
      setNewPost('')
      await fetchPosts()
    }
    setIsPosting(false)
  }

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return
    
    if (isLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('post_likes')
        .insert([{
          post_id: postId,
          user_id: user.id
        }])
    }
    
    await fetchPosts()
  }

  const getProfessionIcon = (profession: string) => {
    const icons: any = {
      'plumber': '🔧',
      'electrician': '⚡',
      'carpenter': '🪚',
      'mechanic': '🔩',
      'barber': '✂️',
      'welder': '🔥',
      'construction': '🏗️',
      'technician': '🛠️'
    }
    const key = Object.keys(icons).find(k => profession?.toLowerCase().includes(k))
    return key ? icons[key] : '👷'
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Heebo', sans-serif" }}>
      {/* Top Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e4e6eb', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-1px' }}>
            <span style={{ color: '#1877f2' }}>Skill</span>
            <span style={{ color: '#42b72a' }}>Link</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => router.push('/feed')} style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', color: '#050505', padding: '8px' }}>🏠 בית</button>
          <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', color: '#65676b', padding: '8px' }}>👤 פרופיל</button>
        </div>
        
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} style={{ background: '#e4e6eb', color: '#050505', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>יציאה</button>
      </nav>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>
        {/* Create Post Box */}
        {user && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
              </div>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="מה עובר לך בראש?"
                style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '1rem', fontFamily: 'inherit', minHeight: '50px', background: '#f0f2f5', borderRadius: '20px', padding: '12px 16px' }}
              />
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e4e6eb', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={createPost}
                disabled={!newPost.trim() || isPosting}
                style={{ background: newPost.trim() ? '#1877f2' : '#e4e6eb', color: newPost.trim() ? 'white' : '#bcc0c4', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'not-allowed', fontSize: '0.95rem' }}
              >
                פרסם
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#65676b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <div>טוען פוסטים...</div>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ background: 'white', padding: '60px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#050505', marginBottom: '8px' }}>אין פוסטים עדיין</h2>
            <p style={{ color: '#65676b', fontSize: '1rem' }}>היה הראשון לשתף משהו!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                {/* Post Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginLeft: '12px' }}>
                    {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#050505', fontSize: '0.95rem' }}>
                      {post.profiles?.full_name || 'משתמש'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#65676b' }}>
                      {getProfessionIcon(post.profiles?.profession)} {post.profiles?.profession || 'מקצוען'} · {new Date(post.created_at).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ color: '#050505', fontSize: '1rem', lineHeight: '1.5', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </div>

                {post.image_url && (
                  <img src={post.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }} />
                )}

                {/* Post Actions */}
                <div style={{ borderTop: '1px solid #e4e6eb', paddingTop: '8px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => toggleLike(post.id, post.isLiked)}
                    style={{ flex: 1, background: 'none', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: post.isLiked ? '#1877f2' : '#65676b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {post.isLiked ? '👍' : '👍🏻'} לייק ({post.likesCount})
                  </button>
                  <button
                    style={{ flex: 1, background: 'none', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#65676b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    💬 תגובות ({post.commentsCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
