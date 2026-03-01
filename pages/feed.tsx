import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('he')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      loadPosts()
    })
  }, [])

  async function loadPosts() {
    const { data } = await supabase.from('posts').select(`
      *,
      profiles:author_id ( full_name, avatar_url, role )
    `).order('created_at', { ascending: false })
    setPosts(data || [])
  }

  async function createPost() {
    if (!newPost.trim()) return
    setLoading(true)
    await supabase.from('posts').insert([{ author_id: user.id, content: newPost, type: 'general' }])
    setNewPost('')
    await loadPosts()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900" dir="rtl">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">SkillLink</h1>
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="חפש מנטורים, הכשרות..." 
                className="bg-gray-100 rounded-full py-2 px-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-xl text-gray-600">
              <button className="relative">🔔<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span></button>
              <button>💬</button>
              <button>🔔</button>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-white shadow-sm overflow-hidden">
               <img src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + user?.email} alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto flex gap-6 p-6">
        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            <nav className="p-2 space-y-1">
              {[
                { icon: '🏠', label: 'בית', active: true },
                { icon: '👤', label: 'הפרופיל שלי' },
                { icon: '🛠️', label: 'הכשרות' },
                { icon: '✉️', label: 'הודעות' },
                { icon: '🔖', label: 'שמורים' },
                { icon: '⚙️', label: 'הגדרות' },
              ].map((item, i) => (
                <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-xl shadow-sm p-4 border">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + user?.email} alt="Me" />
              </div>
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="שתף את הניסיון שלך או טיפים..."
                className="w-full bg-gray-50 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[100px]"
              />
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-600 font-medium text-sm">
                  <span>🖼️</span> צילום
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-600 font-medium text-sm">
                  <span>📹</span> וידאו
                </button>
              </div>
              <button 
                onClick={createPost}
                disabled={loading || !newPost.trim()}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                פרסם
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                         <img src={post.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=' + (post.profiles?.full_name || 'User')} alt="Author" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{post.profiles?.full_name || 'משתמש SkillLink'}</h3>
                          <span className="text-xs text-gray-400">• {post.profiles?.role || 'חבר קהילה'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} • לפני שעתיים</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 text-xl font-bold">•••</button>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
                </div>
                <div className="border-t px-4 py-2 flex items-center justify-around">
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-gray-600 font-medium">👍 לייק</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-gray-600 font-medium">💬 תגובה</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-gray-600 font-medium">🔁 שתף</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 space-y-6 hidden xl:block">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-bold text-lg mb-4">מנטורים בשבילך</h2>
            <div className="space-y-4">
              {[
                { name: 'מיכאל ר.', role: 'מומחה שיווק', exp: '12 שנות ניסיון' },
                { name: 'הילה ס.', role: 'חשמלאית מוסמכת', exp: '15 שנות ניסיון' }
              ].map((m, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{m.name}</h4>
                    <p className="text-xs text-gray-500">{m.role} • {m.exp}</p>
                  </div>
                  <button className="text-blue-600 text-xs font-bold hover:underline">צפה בפרופיל</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-bold text-lg mb-4">הזדמנויות פתוחות</h2>
            <div className="space-y-3">
              {[
                { title: 'סטאז׳ בעיצוב גרפי', type: 'חצי משרה • מרחוק' },
                { title: 'תכנית הכשרה לאינסטלציה', type: '3 חודשים • באתר' }
              ].map((opp, i) => (
                <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-sm">{opp.title}</h4>
                  <p className="text-xs text-blue-700 mt-1">{opp.type}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
