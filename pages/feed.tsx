import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles:author_id(full_name)')
      .order('created_at', { ascending: false })
    setPosts(data || [])
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePost = async () => {
    if (!newPost.trim()) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('יש להתחבר כדי לפרסם פוסט')
      return
    }

    const { error } = await supabase.from('posts').insert({
      content: newPost,
      author_id: user.id,
      type: 'general'
    })

    if (error) {
      alert('שגיאה בפרסום הפוסט: ' + error.message)
    } else {
      setNewPost('')
      fetchPosts()
    }
  }

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', direction: 'rtl', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#0866FF', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>SkillLink</h1>
        
        {/* Create Post */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <textarea 
            placeholder="מה אתה רוצה לשתף?" 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ 
              width: '100%', 
              border: 'none', 
              background: '#F0F2F5', 
              padding: '12px', 
              borderRadius: '8px', 
              resize: 'none', 
              outline: 'none',
              fontSize: '16px',
              minHeight: '80px',
              marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handlePost}
              style={{ 
                background: '#0866FF', 
                color: 'white', 
                border: 'none', 
                padding: '8px 24px', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              פרסם
            </button>
          </div>
        </div>

        {posts.map(p => (
          <div key={p.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
              {p.profiles?.full_name || 'משתמש SkillLink'}
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.5' }}>
              {p.content}
            </div>
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-around', fontWeight: 'bold', color: '#65676B' }}>
              <span>👍 לייק</span>
              <span>💬 תגובה</span>
              <span>🔁 שתף</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
