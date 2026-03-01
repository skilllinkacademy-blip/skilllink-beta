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
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentText, setCommentText] = useState<Record<string, string>>({})
  const [mentors, setMentors] = useState<any[]>([])
  
  // Opportunity state
  const [isOppModalOpen, setIsOppModalOpen] = useState(false)
  const [oppData, setOppData] = useState({
    title: '',
    location: '',
    salary: '',
    description: ''
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data: profData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profData) setProfile(profData)
      }
      fetchPosts()
      fetchMentors()
    }
    init()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles:author_id(*)')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const postsWithDetails = await Promise.all(
        data.map(async (post) => {
          const { count: likesCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
          const { data: comments } = await supabase.from('post_comments').select('*, profiles:author_id(*)').eq('post_id', post.id).order('created_at', { ascending: true })
          const { data: userLike } = await supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', user?.id).single()
          
          return {
            ...post,
            likesCount: likesCount || 0,
            comments: comments || [],
            isLiked: !!userLike
          }
        })
      )
      setPosts(postsWithDetails)
    }
    setLoading(false)
  }

  const fetchMentors = async () => {
    const { data } = await supabase.from('profiles').select('*').limit(5)
    if (data) setMentors(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const createPost = async (type: 'post' | 'opportunity' = 'post') => {
    if (!user) return
    
    // Validation
    if (type === 'post' && !newPost.trim() && !imageFile) return
    if (type === 'opportunity' && (!oppData.title.trim() || !oppData.description.trim())) return

    setIsPosting(true)
    let imageUrl = null

    if (imageFile) {
      setUploading(true)
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }
      setUploading(false)
    }

    const postPayload: any = {
      author_id: user.id,
      post_type: type,
      content: type === 'post' ? newPost : oppData.description,
      image_url: imageUrl
    }

    if (type === 'opportunity') {
      postPayload.job_title = oppData.title
      postPayload.job_location = oppData.location
      postPayload.job_salary = oppData.salary
      postPayload.job_description = oppData.description
    }

    const { error } = await supabase
      .from('posts')
      .insert([postPayload])

    if (!error) {
      setNewPost('')
      setImageFile(null)
      setImagePreview(null)
      setIsOppModalOpen(false)
      setOppData({ title: '', location: '', salary: '', description: '' })
      await fetchPosts()
    } else {
      console.error('Error creating post:', error)
      alert('שגיאה בפרסום הפוסט. נסה שוב.')
    }
    setIsPosting(false)
  }

  const addComment = async (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim() || !user) return

    const { error } = await supabase
      .from('post_comments')
      .insert([{ post_id: postId, author_id: user.id, content: text }])

    if (!error) {
      setCommentText({ ...commentText, [postId]: '' })
      await fetchPosts()
    }
  }

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_likes').insert([{ post_id: postId, user_id: user.id }])
    }
    await fetchPosts()
  }

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', height: '60px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div onClick={() => router.push('/feed')} style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1877f2', letterSpacing: '-1px', cursor: 'pointer' }}>SkillLink</div>
          <div style={{ background: '#f0f2f5', borderRadius: '20px', padding: '8px 16px', display: 'flex', alignItems: 'center', width: '300px' }}>
            <input placeholder="חפש מומחים, עבודות..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '1.5rem', cursor: 'pointer' }}>💬</div>
          <div style={{ fontSize: '1.5rem', cursor: 'pointer' }}>🔔</div>
          <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', border: '1px solid #ddd' }} onClick={() => router.push('/profile')} />
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '20px auto', display: 'flex', gap: '24px', padding: '0 20px' }}>
        {/* Left Sidebar */}
        <aside style={{ width: '280px', position: 'sticky', top: '80px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div onClick={() => router.push('/feed')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
              <span style={{ fontSize: '1.2rem' }}>🏠</span> פיד ראשי
            </div>
            <div onClick={() => router.push('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span> הפרופיל שלי
            </div>
            <div onClick={() => router.push('/mentors')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>👷</span> מומחים ומנטורים
            </div>
            <div onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#dc3545' }}>
              <span style={{ fontSize: '1.2rem' }}>🚪</span> התנתקות
            </div>
          </div>
        </aside>

        {/* Feed Center */}
        <main style={{ flex: 1, maxWidth: '600px' }}>
          {/* Create Post */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="מה עובר לך בראש? שתף עבודה או טיפ מקצועי..." 
                style={{ flex: 1, border: 'none', background: '#f0f2f5', borderRadius: '20px', padding: '12px 16px', outline: 'none', resize: 'none', fontSize: '1rem', minHeight: '44px' }} 
              />
            </div>
            
            {imagePreview && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img src={imagePreview} style={{ width: '100%', borderRadius: '8px' }} />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>✕</button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#65676b', fontWeight: 600, padding: '8px', borderRadius: '8px' }}>
                  📷 <span style={{ fontSize: '0.9rem' }}>תמונה</span>
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
                <button onClick={() => setIsOppModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#65676b', fontWeight: 600, padding: '8px', borderRadius: '8px', background: 'none', border: 'none' }}>
                  💼 <span style={{ fontSize: '0.9rem' }}>הזדמנות עבודה</span>
                </button>
              </div>
              <button 
                onClick={() => createPost('post')}
                disabled={(!newPost.trim() && !imageFile) || isPosting}
                style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', opacity: (newPost.trim() || imageFile) ? 1 : 0.6 }}
              >
                {isPosting ? 'מפרסם...' : 'פרסם'}
              </button>
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>טוען פיד...</div>
          ) : posts.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#65676b', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
              <h3>הפיד עדיין ריק</h3>
              <p>היה הראשון לפרסם משהו בקהילה!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src={post.profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{post.profiles?.full_name || 'משתמש SkillLink'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#65676b' }}>
                      {post.profiles?.profession || 'מקצוען'} · {new Date(post.created_at).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                </div>

                {post.post_type === 'opportunity' ? (
                  <div style={{ background: '#f0f7ff', border: '1px solid #1877f2', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1877f2' }}>💼 {post.job_title}</h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#65676b', marginBottom: '12px' }}>
                      <span>📍 {post.job_location}</span>
                      <span>💰 {post.job_salary}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{post.job_description}</div>
                    <button style={{ width: '100%', marginTop: '15px', background: '#1877f2', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>הגש מועמדות</button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '12px', fontSize: '1rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.content}</div>
                    {post.image_url && <img src={post.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', border: '1px solid #eee' }} />}
                  </>
                )}

                <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', display: 'flex', padding: '4px 0', marginBottom: '8px' }}>
                  <button onClick={() => toggleLike(post.id, post.isLiked)} style={{ flex: 1, background: 'none', border: 'none', padding: '8px', color: post.isLiked ? '#1877f2' : '#65676b', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>👍 לייק ({post.likesCount})</button>
                  <button onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })} style={{ flex: 1, background: 'none', border: 'none', padding: '8px', color: '#65676b', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>💬 תגובות ({post.comments?.length || 0})</button>
                </div>

                {expandedComments[post.id] && (
                  <div style={{ marginTop: '12px' }}>
                    {post.comments?.map((c: any) => (
                      <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <img src={c.profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <div style={{ background: '#f0f2f5', borderRadius: '18px', padding: '8px 12px', flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.profiles?.full_name || 'משתמש'}</div>
                          <div style={{ fontSize: '0.9rem' }}>{c.content}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <input 
                        value={commentText[post.id] || ''} 
                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })} 
                        onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                        placeholder="כתוב תגובה..." 
                        style={{ flex: 1, background: '#f0f2f5', border: 'none', borderRadius: '18px', padding: '8px 12px', outline: 'none', fontSize: '0.9rem' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </main>

        {/* Right Sidebar */}
        <aside style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>מומחים חדשים</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mentors.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: '#65676b' }}>אין מומחים זמינים כרגע</div>
              ) : (
                mentors.filter(m => m.id !== user?.id).map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <img src={m.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#65676b' }}>{m.profession}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Opportunity Modal */}
      {isOppModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20 }}>פרסום הזדמנות עבודה 💼</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                placeholder="שם המשרה (לדוגמה: דרוש חשמלאי לעבודה ברמת גן)" 
                value={oppData.title}
                onChange={e => setOppData({ ...oppData, title: e.target.value })}
                style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd' }} 
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <input 
                  placeholder="מיקום" 
                  value={oppData.location}
                  onChange={e => setOppData({ ...oppData, location: e.target.value })}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd' }} 
                />
                <input 
                  placeholder="שכר / תקציב" 
                  value={oppData.salary}
                  onChange={e => setOppData({ ...oppData, salary: e.target.value })}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd' }} 
                />
              </div>
              <textarea 
                placeholder="תיאור העבודה והדרישות..." 
                value={oppData.description}
                onChange={e => setOppData({ ...oppData, description: e.target.value })}
                style={{ height: 120, padding: 12, borderRadius: 8, border: '1px solid #ddd', resize: 'none' }} 
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button onClick={() => setIsOppModalOpen(false)} style={{ background: '#f0f2f5', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>ביטול</button>
                <button onClick={() => createPost('opportunity')} style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>פרסם עכשיו</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
