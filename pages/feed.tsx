import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState<'tip'|'question'|'solution'|'general'>('general')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'he'|'en'>('he')

  const t = {
    he: { title: 'Feed', createPost: 'שתף משהו...', placeholder: 'מה אתה רוצה לשתף? טיפ, שאלה, פתרון?', post: 'פרסם', tip: '💡 טיפ', question: '❓ שאלה', solution: '✅ פתרון', general: '💬 כללי', noFeed: 'אין פוסטים עדיין', beFirst: 'היה הראשון לפרסם!', likes: 'לייקים', comments: 'תגובות' },
    en: { title: 'Feed', createPost: 'Share something...', placeholder: 'What do you want to share? Tip, Question, Solution?', post: 'Post', tip: '💡 Tip', question: '❓ Question', solution: '✅ Solution', general: '💬 General', noFeed: 'No posts yet', beFirst: 'Be the first to post!', likes: 'likes', comments: 'comments' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      loadPosts()
    })
  }, [])

  const loadPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles!posts_author_id_fkey(full_name)').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const handlePost = async () => {
    if (!newPost.trim()) return
    setLoading(true)
    await supabase.from('posts').insert({ author_id: user.id, content: newPost, type: postType })
    setNewPost('')
    setLoading(false)
    loadPosts()
  }

  const handleLike = async (postId: string) => {
    const { data: existingLike } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single()
    if (existingLike) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      await supabase.rpc('decrement_likes', { post_id: postId })
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
      await supabase.rpc('increment_likes', { post_id: postId })
    }
    loadPosts()
  }

  const typeIcons: any = { tip: '💡', question: '❓', solution: '✅', general: '💬' }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: lang === 'he' ? "'Heebo', sans-serif" : "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillLink</span>
          </div>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>{lang === 'he' ? 'דשבורד' : 'Dashboard'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}>🌐 {lang === 'he' ? 'EN' : 'HE'}</button>
        </div>
      </nav>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 2 }}>
        {/* Create Post Card */}
        <div className="glass animate-fadeIn" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {[{k:'tip', l:t.tip}, {k:'question', l:t.question}, {k:'solution', l:t.solution}, {k:'general', l:t.general}].map(({k, l}) => (
              <button key={k} onClick={() => setPostType(k as any)} style={{ padding: '6px 12px', borderRadius: '20px', background: postType === k ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${postType === k ? 'var(--primary)' : 'var(--border)'}`, color: postType === k ? 'white' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>{l}</button>
            ))}
          </div>
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={t.placeholder} rows={3} className="form-input" style={{ marginBottom: '12px', resize: 'vertical' }} />
          <button onClick={handlePost} disabled={loading || !newPost.trim()} className="btn-primary" style={{ width: '100%', opacity: loading || !newPost.trim() ? 0.5 : 1 }}>
            {loading ? <span className="spinner" /> : t.post}
          </button>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="glass" style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💭</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>{t.noFeed}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.beFirst}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => (
              <div key={post.id} className="glass card-hover" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}>{post.profiles?.full_name?.[0]?.toUpperCase() || '?'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{post.profiles?.full_name || 'Anonymous'}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(108,99,255,0.2)', color: 'var(--primary-light)' }}>{typeIcons[post.type]} {post.type}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                    <span style={{ fontSize: '1.2rem' }}>❤️</span> {post.likes_count} {t.likes}
                  </button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>💬</span> {post.comments_count} {t.comments}
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
