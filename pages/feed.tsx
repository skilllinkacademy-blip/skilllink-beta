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
        profiles:author_id(*)
      `)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const createPost = async () => {
    if ((!newPost.trim() && !imageFile) || !user) return
    
    setIsPosting(true)
    let imageUrl = null

    if (imageFile) {
      setUploading(true)
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      }
      setUploading(false)
    }

    const { error } = await supabase
      .from('posts')
      .insert([{
        author_id: user.id,
        content: newPost,
        image_url: imageUrl
      }])
    
    if (!error) {
      setNewPost('')
      setImageFile(null)
      setImagePreview(null)
      await fetchPosts()
    }
    setIsPosting(false)
  }

  const addComment = async (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim() || !user) return

    const { error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        author_id: user.id,
        content: text
      }])

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
    <div style={{ background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {/* HEADER */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1877f2', letterSpacing: '-1px' }}>SkillLink</span>
          <div style={{ background: '#f0f2f5', borderRadius: '20px', padding: '8px 12px', display: 'flex', alignItems: 'center', width: '240px' }}>
            <span style={{ color: '#65676b', marginRight: '8px' }}>🔍</span>
            <input placeholder="Search mentors..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
          </div>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            <span style={{ position: 'absolute', top: -5, right: -5, background: '#e41e3f', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
          </div>
          <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', border: '1px solid #ddd' }} onClick={() => router.push('/profile')} />
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '32px', padding: '20px 16px' }}>
        {/* LEFT SIDEBAR */}
        <aside style={{ width: '280px', position: 'sticky', top: '76px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', background: '#e7f3ff', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>🏠</span> <span style={{ fontWeight: 600 }}>Home</span>
            </div>
            <div onClick={() => router.push('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span> <span style={{ fontWeight: 500 }}>My Profile</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>💼</span> <span style={{ fontWeight: 500 }}>Apprenticeships</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>💬</span> <span style={{ fontWeight: 500 }}>Messages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>🔖</span> <span style={{ fontWeight: 500 }}>Saved</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>⚙️</span> <span style={{ fontWeight: 500 }}>Settings</span>
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main style={{ flex: 1, maxWidth: '580px' }}>
          {/* CREATE POST */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <img src={profile?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your experience or tips..."
                style={{ flex: 1, border: 'none', background: '#f0f2f5', borderRadius: '20px', padding: '10px 16px', outline: 'none', resize: 'none', fontSize: '1rem' }}
              />
            </div>
            {imagePreview && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img src={imagePreview} style={{ width: '100%', borderRadius: '8px' }} />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#65676b', fontWeight: 600, padding: '8px', borderRadius: '8px' }}>
                📷 Photo
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
              <button
                onClick={createPost}
                disabled={(!newPost.trim() && !imageFile) || isPosting}
                style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', opacity: (newPost.trim() || imageFile) ? 1 : 0.6 }}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* POSTS */}
          {posts.map(post => (
            <div key={post.id} style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img src={post.profiles?.avatar_url || 'https://i.pravatar.cc/150?u=' + post.id} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{post.profiles?.full_name || 'David Cohen'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#65676b' }}>{post.profiles?.profession || 'Mentor'} · {new Date(post.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ marginBottom: '12px', fontSize: '0.95rem', lineHeight: 1.4 }}>{post.content}</div>
              {post.image_url && <img src={post.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', border: '1px solid #eee' }} />}
              
              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', display: 'flex', padding: '4px 0', marginBottom: '12px' }}>
                <button onClick={() => toggleLike(post.id, post.isLiked)} style={{ flex: 1, background: 'none', border: 'none', padding: '8px', color: post.isLiked ? '#1877f2' : '#65676b', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>👍 Like ({post.likesCount})</button>
                <button onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })} style={{ flex: 1, background: 'none', border: 'none', padding: '8px', color: '#65676b', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>💬 Comment ({post.comments?.length || 0})</button>
                <button style={{ flex: 1, background: 'none', border: 'none', padding: '8px', color: '#65676b', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>↗️ Share</button>
              </div>

              {expandedComments[post.id] && (
                <div style={{ marginTop: '12px' }}>
                  {post.comments?.map((c: any) => (
                    <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <img src={c.profiles?.avatar_url || 'https://i.pravatar.cc/150?u=' + c.author_id} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div style={{ background: '#f0f2f5', borderRadius: '18px', padding: '8px 12px', flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.profiles?.full_name || 'User'}</div>
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
                      placeholder="Write a comment..."
                      style={{ flex: 1, background: '#f0f2f5', border: 'none', borderRadius: '18px', padding: '8px 12px', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#111' }}>Mentors for You</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Michael R.', role: 'Marketing Expert', exp: '12 Years Exp.', src: 'https://randomuser.me/api/portraits/men/32.jpg' },
                { name: 'Hila S.', role: 'Master Electrician', exp: '15 Years Exp.', src: 'https://randomuser.me/api/portraits/women/65.jpg' }
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <img src={m.src} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.name} · <span style={{ color: '#65676b', fontWeight: 400 }}>{m.role}</span></div>
                    <div style={{ fontSize: '0.8rem', color: '#65676b', marginBottom: '8px' }}>{m.exp}</div>
                    <button style={{ background: '#e7f3ff', color: '#1877f2', border: 'none', padding: '4px 12px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#111' }}>Open Opportunities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1877f2' }}>Web Design Internship</div>
                <div style={{ fontSize: '0.8rem', color: '#65676b' }}>Part-time · Remote</div>
              </div>
              <div style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1877f2' }}>Plumbing Training Program</div>
                <div style={{ fontSize: '0.8rem', color: '#65676b' }}>3 Months · On-site</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
