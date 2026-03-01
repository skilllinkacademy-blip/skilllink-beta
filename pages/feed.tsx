import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Feed() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-[#F0F2F5] text-[#1C1E21]" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[#0866FF] text-[2.5rem] font-bold tracking-tight">SkillLink</h1>
            <div className="relative mr-4">
              <input 
                type="text" 
                placeholder="חפש מנטורים, הכשרות..." 
                className="bg-[#F0F2F5] rounded-full py-2 px-10 w-[240px] focus:outline-none focus:ring-1 focus:ring-blue-500 text-[15px]"
              />
              <span className="absolute right-3 top-2 text-gray-500">🔍</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition">💬</button>
              <button className="w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition relative">
                🔔
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">1</span>
              </button>
              <button className="w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition">👤</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto flex justify-between px-4 py-4 gap-6">
        {/* Left Sidebar */}
        <aside className="w-[300px] hidden lg:block sticky top-[72px] h-fit">
          <div className="space-y-1">
            {[
              { icon: '🏠', label: 'דף הבית', active: true },
              { icon: '👤', label: 'הפרופיל שלי' },
              { icon: '💼', label: 'הכשרות' },
              { icon: '✉️', label: 'הודעות' },
              { icon: '🔖', label: 'שמורים' },
              { icon: '⚙️', label: 'הגדרות' },
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${item.active ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-[15px]">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Center Content */}
        <main className="max-w-[680px] w-full space-y-4">
          {/* Create Post Card */}
          <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-4">
            <div className="flex gap-2 mb-3 border-b pb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border">
                <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`} alt="Avatar" />
              </div>
              <button 
                onClick={() => {}} 
                className="flex-1 bg-[#F0F2F5] hover:bg-gray-200 rounded-full text-right px-4 py-2 text-gray-500 text-[17px] transition"
              >
                שתף את הניסיון שלך או טיפים...
              </button>
            </div>
            <div className="flex items-center justify-around pt-1">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#65676B] font-semibold text-[15px]">
                <span className="text-green-500 text-xl">🖼️</span> תמונה
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#65676B] font-semibold text-[15px]">
                <span className="text-red-500 text-xl">📹</span> סרטון
              </button>
              <button 
                onClick={createPost}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#0866FF] font-semibold text-[15px]"
              >
                <span>📝</span> פוסט
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[8px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 pb-1">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border">
                         <img src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}&background=random`} alt="Author" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold hover:underline cursor-pointer text-[15px]">{post.profiles?.full_name || 'משתמש SkillLink'}</span>
                          <span className="text-[#65676B] text-[13px]">• {post.profiles?.role || 'חבר קהילה'}</span>
                        </div>
                        <span className="text-[#65676B] text-[13px] hover:underline cursor-pointer">לפני שעתיים • 🌍</span>
                      </div>
                    </div>
                    <button className="text-[#65676B] hover:bg-gray-100 w-9 h-9 flex items-center justify-center rounded-full transition text-xl font-bold">•••</button>
                  </div>
                  <div className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>
                
                {/* Mock image for carpenters example if content contains carpentry */}
                {post.content.includes('ספר') && (
                  <div className="mt-3 border-y border-gray-100">
                    <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000" alt="Carpentry" className="w-full" />
                  </div>
                )}

                <div className="px-4 py-2 text-[#65676B] text-[15px] flex justify-between items-center">
                  <div className="flex items-center gap-1 cursor-pointer hover:underline">
                    <span className="bg-[#0866FF] rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white">👍</span>
                    <span>12 לייקים</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="hover:underline cursor-pointer">4 תגובות</span>
                    <span className="hover:underline cursor-pointer">1 שיתוף</span>
                  </div>
                </div>

                <div className="border-t mx-4 pt-1 flex items-center justify-around mb-1">
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#65676B] font-semibold text-[15px]">👍 לייק</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#65676B] font-semibold text-[15px]">💬 תגובה</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-[4px] transition text-[#65676B] font-semibold text-[15px]">🔁 שתף</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar Widgets */}
        <aside className="w-[340px] hidden xl:block space-y-4 sticky top-[72px] h-fit">
          <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#65676B] text-[17px]">מנטורים בשבילך</h2>
              <button className="text-[#0866FF] hover:bg-blue-50 px-2 py-1 rounded transition text-sm">ראה הכל</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'מיכאל ר.', role: 'מומחה שיווק', exp: '12 שנות ניסיון', img: 'https://i.pravatar.cc/150?u=michael' },
                { name: 'הילה ס.', role: 'חשמלאית מוסמכת', exp: '15 שנות ניסיון', img: 'https://i.pravatar.cc/150?u=hila' }
              ].map((m, i) => (
                <div key={i} className="flex gap-3 items-center group">
                  <div className="w-[52px] h-[52px] rounded-full overflow-hidden border">
                    <img src={m.img} alt={m.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[15px] group-hover:underline cursor-pointer">{m.name}</h4>
                    <p className="text-[#65676B] text-[13px]">{m.role}</p>
                    <p className="text-[#65676B] text-[12px]">{m.exp}</p>
                  </div>
                  <button className="bg-blue-50 text-[#0866FF] font-bold text-[13px] px-3 py-1.5 rounded-full hover:bg-blue-100 transition">צפה</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-4">
            <h2 className="font-bold text-[#65676B] text-[17px] mb-4">הזדמנויות חמות</h2>
            <div className="space-y-3">
              {[
                { title: 'סטאז׳ בעיצוב מוצר', type: 'חצי משרה • Petah Tikva', icon: '🎨' },
                { title: 'תכנית הכשרה לחשמלאות', type: '3 חודשים • באתר', icon: '⚡' }
              ].map((opp, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer transition">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl">{opp.icon}</div>
                  <div>
                    <h4 className="font-bold text-[14px] text-gray-900">{opp.title}</h4>
                    <p className="text-[#65676B] text-[12px]">{opp.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
