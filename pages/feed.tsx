import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    supabase.from('posts').select('*, profiles:author_id(*)').then(({data}) => setPosts(data || []))
  }, [])

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh', direction: 'rtl', padding: '20px' }}>
      <h1 style={{ color: '#0866FF', textAlign: 'center' }}>SkillLink Feed</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd' }}>
            <div style={{ fontWeight: 'bold' }}>{p.profiles?.full_name || 'משתמש'}</div>
            <div style={{ marginTop: '10px' }}>{p.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
