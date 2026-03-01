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
    <div className="min-h-screen bg-[#F0F2F5] text-[#1C1E21] font-sans" dir="rtl">
      {/* Navbar - Fixed to top */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm w-full">
        <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-[#0866FF] text-[2.5rem] font-bold tracking-tight cursor-pointer">SkillLink</h1>
            <div className="relative">
              <input 
                type="text" 
                placeholder="חפש מנטורים, הכשרות..." 
                className="bg-[#F0F2F5] rounded-full py-2 px-10 w-60 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[15px]"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer transition">💬</div>
            <div className="w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer transition relative">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">1</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition">
              <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`} alt="Me" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_340px] gap-6 px-4 py-6">
        
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col gap-2 sticky top-[80px] h-fit">
          {[
            { icon: '🏠', label: 'דף הבית', active: true },
            { icon: '👤', label: 'הפרופיל שלי' },
            { icon: '💼', label: 'הכשרות' },
            { icon: '✉️', label: 'הודעות' },
            { icon: '🔖', label: 'שמורים' },
            { icon: '⚙️', label: 'הגדרות' },
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-right ${item.active ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-[15px]">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Center Feed */}
        <main className="flex flex-col gap-4 w-full">
          {/* Create Post Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 flex gap-2">
              <div className="w-10 h-10 rounded-full border overflow-hidden flex-shrink-0">
                <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`} alt="Me" />
              </div>
              <button 
                onClick={() => {}} 
                className="flex-1 bg-[#F0F2F5] hover:bg-gray-200 rounded-full text-right px-4 py-2 text-[#65676B] text-[17px] transition border-none outline-none"
              >
                שתף את הניסיון שלך או טיפים...
              </button>
            </div>
            <div className="flex border-t border-gray-100 p-1">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg transition text-[#65676B] font-semibold">
                <span className="text-green-500 text-xl">🖼️</span> תמונה
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg transition text-[#65676B] font-semibold">
                <span className="text-red-500 text-xl">📹</span> סרטון
              </button>
              <button 
                onClick={createPost}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg transition text-[#0866FF] font-semibold"
              >
                📝 פוסט
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full border overflow-hidden flex-shrink-0">
                         <img src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}&background=random`} alt="User" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold hover:underline cursor-pointer text-[15px]">{post.profiles?.full_name || 'משתמש SkillLink'}</span>
                          <span className="text-[#65676B] text-[13px]">• {post.profiles?.role || 'חבר קהילה'}</span>
                        </div>
                        <span className="text-[#65676B] text-[12px] hover:underline cursor-pointer flex items-center gap-1">לפני שעתיים • 🌍</span>
                      </div>
                    </div>
                    <button className="text-[#65676B] hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition font-bold text-lg">•••</button>
                  </div>
                  <div className="mt-3 text-[15px] leading-snug whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                {/* Example image for specific content */}
                {post.content.includes('ספר') && (
                  <div className="border-y border-gray-100">
                    <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000" alt="Post content" className="w-full object-cover max-h-[400px]" />
                  </div>
                )}

                <div className="px-4 py-2 flex justify-between items-center text-[#65676B] text-[14px]">
                  <div className="flex items-center gap-1 hover:underline cursor-pointer">
                    <span className="bg-[#0866FF] rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white">👍</span>
                    <span>12</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="hover:underline cursor-pointer">4 תגובות</span>
                    <span className="hover:underline cursor-pointer">שיתוף אחד</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mx-4 pt-1 flex items-center justify-around pb-1">
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-[#65676B] font-semibold text-[15px]">👍 לייק</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-[#65676B] font-semibold text-[15px]">💬 תגובה</button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition text-[#65676B] font-semibold text-[15px]">🔁 שתף</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar Widgets */}
        <aside className="hidden xl:flex flex-col gap-4 sticky top-[80px] h-fit">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#65676B] text-[17px]">מנטורים בשבילך</h2>
              <button className="text-[#0866FF] hover:bg-blue-50 px-2 py-1 rounded transition text-sm font-semibold">ראה הכל</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'מיכאל ר.', role: 'מומחה שיווק', exp: '12 שנות ניסיון', img: 'https://i.pravatar.cc/150?u=michael' },
                { name: 'הילה ס.', role: 'חשמלאית מוסמכת', exp: '15 שנות ניסיון', img: 'https://i.pravatar.cc/150?u=hila' }
              ].map((m, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[14px] hover:underline cursor-pointer">{m.name}</h4>
                    <p className="text-[#65676B] text-[12px] leading-tight">{m.role}</p>
                    <p className="text-[#65676B] text-[11px]">{m.exp}</p>
                  </div>
                  <button className="bg-[#E7F3FF] text-[#0866FF] font-bold text-[13px] px-3 py-1.5 rounded-full hover:bg-[#DBE7F2] transition flex-shrink-0">צפה</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-bold text-[#65676B] text-[17px] mb-4">הזדמנויות חמות</h2>
            <div className="space-y-3">
              {[
                { title: 'סטאז׳ בעיצוב מוצר', type: 'חצי משרה • Petah Tikva', icon: '🎨' },
                { title: 'תכנית הכשרה לחשמלאות', type: '3 חודשים • באתר', icon: '⚡' }
              ].map((opp, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-200 cursor-pointer transition">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl flex-shrink-0">{opp.icon}</div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-[14px] text-gray-900 truncate">{opp.title}</h4>
                    <p className="text-[#65676B] text-[11px] truncate">{opp.type}</p>
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
