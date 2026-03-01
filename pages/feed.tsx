import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState('tip')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('he')

  const t = {
    he: { title: 'פיד', createPost: 'צור פוסט...', placeholder: 'מה אתה רוצה לשתף עם הקהילה?', shareButton: 'שתף' },
    en: { title: 'Feed', createPost: 'Create Post...', placeholder: 'What do you want to share?', shareButton: 'Share' }
  }[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      loadPosts()
    })
  }, [])

  async function loadPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  async function createPost() {
    if (!newPost.trim()) return
    setLoading(true)
    await supabase.from('posts').insert([{ user_id: user.id, content: newPost, type: postType }])
    setNewPost('')
    await loadPosts()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.title}</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t.placeholder}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          <div className="flex gap-4 mt-4">
            <select value={postType} onChange={(e) => setPostType(e.target.value)} className="px-4 py-2 border rounded-xl">
              <option value="tip">טיפ</option>
              <option value="question">שאלה</option>
              <option value="solution">פתרון</option>
              <option value="general">כללי</option>
            </select>
            <button onClick={createPost} disabled={loading} className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              {t.shareButton}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-blue-600">{post.type}</span>
                <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('he-IL')}</span>
              </div>
              <p className="text-gray-800">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
