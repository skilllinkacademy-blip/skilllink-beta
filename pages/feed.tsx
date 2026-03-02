import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

type CategoryKey = "חשמל" | "אינסטלציה" | "מיזוג אוויר" | "נגרות";

type Profile = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  role?: string | null;
  created_at?: string | null;
};

const CATEGORIES: { key: CategoryKey; subtitle: string; Icon: (p: any) => JSX.Element }[] = [
  {
    key: "חשמל",
    subtitle: "תיקונים, התקנות, תשתיות",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "אינסטלציה",
    subtitle: "דליפות, קווים, פתיחת סתימות",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M5 10h14v3H5v-3Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M12 13v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M10.8 19.5c.5.9 1.9.9 2.4 0 .4-.7-.2-1.5-1.2-2.8-1 1.3-1.6 2.1-1.2 2.8Z" fill="currentColor" opacity=".25"/>
      </svg>
    ),
  },
  {
    key: "מיזוג אוויר",
    subtitle: "התקנה, ניקוי, תחזוקה",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M7 16c1.5 0 1.5 2 3 2s1.5-2 3-2 1.5 2 3 2 1.5-2 3-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "נגרות",
    subtitle: "מטבחים, דלתות, עבודות עץ",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="m14 4 6 6-9 9H5v-6l9-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M10 8l6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function firstName(fullName?: string | null) {
  if (!fullName) return "אורח";
  return fullName.trim().split(" ")[0] || "אורח";
}

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0B0F1A&color=fff&bold=true&size=256`;
}

function makeMentorPlaceholders(n = 8): Profile[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `ph-${i + 1}`,
    full_name: "מנטור בקרוב",
    profession: "איש/אשת מקצוע מאומת/ת",
    avatar_url: null,
    role: "mentor",
  }));
}

export default function Feed() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mentors, setMentors] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profData) setProfile(profData as Profile);
      }

      const { data: mentorsData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "mentor")
        .order("created_at", { ascending: false })
        .limit(20);

      setMentors((mentorsData as Profile[]) || []);
      setLoading(false);
    };

    init();
  }, []);

  const isEmpty = !loading && mentors.length === 0;

  const mentorsToShow = useMemo(() => {
    const base = mentors.length ? mentors : makeMentorPlaceholders(8);
    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter((m) => {
      const name = (m.full_name || "").toLowerCase();
      const prof = (m.profession || "").toLowerCase();
      return name.includes(q) || prof.includes(q);
    });
  }, [mentors, query]);

  return (
    <main dir="rtl" className="sl">
      <header className="top">
        <div className="topIn">
          <div className="brand" onClick={() => router.push("/")} role="button" aria-label="home">
            SkillLink
          </div>

          <div className="search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש מנטור, מקצוע או מיקום..."
              className="searchIn"
            />
            <span className="searchIc" aria-hidden>⌕</span>
          </div>

          <div className="user">
            <img
              className="ava"
              src={profile?.avatar_url || avatarFor(profile?.full_name || "User")}
              alt="avatar"
            />
            <div className="uname">{firstName(profile?.full_name)}</div>
            <button className="bell" aria-label="notifications">🔔</button>
          </div>
        </div>
      </header>

      <div className="wrap">
        <section className="main">
          <div className="hero">
            <div className="heroIn">
              <div className="heroLine" />
              <h1 className="heroT">ברוכים הבאים, {firstName(profile?.full_name)}!</h1>
              <p className="heroS">מצא אנשי מקצוע ומנטורים לפי תחום. כשהמערכת תתמלא, העמוד יתעדכן אוטומטית.</p>
            </div>
          </div>

          <div className="cats">
            {CATEGORIES.map(({ key, subtitle, Icon }) => (
              <div key={key} className="cat">
                <div className="catTop">
                  <div className="icBox"><Icon className="ic" /></div>
                  <div className="meta">{isEmpty ? "בקרוב" : "זמינים"}</div>
                </div>
                <div className="catT">{key}</div>
                <div className="catS">{subtitle}</div>
              </div>
            ))}
          </div>

          <div className="head">
            <h2 className="h2">מנטורים מומלצים</h2>
            {isEmpty && <span className="hint">עדיין אין מנטורים—מציג תצוגה מקדימה</span>}
          </div>

          <div className="grid">
            {mentorsToShow.map((m) => {
              const placeholder = m.id.startsWith("ph-");
              const name = m.full_name || "מנטור";
              const prof = m.profession || "איש/אשת מקצוע";
              return (
                <article key={m.id} className={`card ${placeholder ? "ph" : ""}`}>
                  <div className="img">
                    <img src={m.avatar_url || avatarFor(name)} alt={name} />
                  </div>

                  <div className="body">
                    <div className="n">{name}</div>
                    <div className="p">{prof}</div>
                    <div className="stars" aria-label="rating">★★★★★</div>

                    <button
                      className="pill"
                      disabled={placeholder}
                      onClick={() => {
                        if (placeholder) return;
                        router.push(`/profile?id=${encodeURIComponent(m.id)}`);
                      }}
                    >
                      {placeholder ? "בקרוב" : "צפה בפרופיל"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="side">
          <div className="sideCard">
            <div className="sideT">התראות</div>
            <div className="skList">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skRow">
                  <div className="skAva" />
                  <div className="skTxt">
                    <div className="skL w80" />
                    <div className="skL w55" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sideCard">
            <div className="sideT">העוזרים</div>
            <div className="helpers">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="hRow">
                  <div className="hLeft">
                    <div className="skAva" />
                    <div className="skL w40" />
                  </div>
                  <div className="gold" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .sl{min-height:100vh;background:#f6f4ef;color:#0b1220}
        .top{position:sticky;top:0;z-index:50;border-bottom:1px solid rgba(15,23,42,.08);
          background:rgba(255,255,255,.82);backdrop-filter:blur(12px)}
        .topIn{max-width:1200px;margin:0 auto;padding:14px 16px;display:grid;gap:14px;
          grid-template-columns:200px 1fr 240px;align-items:center}
        .brand{font-weight:900;font-size:22px;letter-spacing:-.5px;cursor:pointer}
        .search{position:relative;background:#fff;border:1px solid rgba(15,23,42,.16);border-radius:14px;
          box-shadow:0 12px 30px rgba(15,23,42,.06);padding:12px 44px 12px 14px}
        .searchIn{width:100%;border:0;outline:none;background:transparent;font-weight:700;font-size:14px}
        .searchIn:focus{box-shadow:0 0 0 4px rgba(243,226,168,.7)}
        .searchIc{position:absolute;left:14px;top:50%;transform:translateY(-50%);opacity:.55;font-weight:900}
        .user{display:flex;justify-content:flex-end;align-items:center;gap:10px}
        .ava{width:40px;height:40px;border-radius:999px;object-fit:cover;border:2px solid rgba(15,23,42,.08)}
        .uname{font-weight:800}
        .bell{width:40px;height:40px;border-radius:999px;background:rgba(15,23,42,.06);border:1px solid rgba(15,23,42,.08)}
        .wrap{max-width:1200px;margin:0 auto;padding:18px 16px 28px;display:grid;gap:18px;grid-template-columns:1fr 360px}
        .hero{border-radius:18px;border:1px solid rgba(15,23,42,.08);background:#fff;box-shadow:0 22px 50px rgba(15,23,42,.08);overflow:hidden}
        .heroIn{padding:34px 18px;position:relative}
        .heroLine{position:absolute;inset:-20px;background:
          radial-gradient(circle at 20% 25%, rgba(15,23,42,.06) 0 1px, transparent 1px 100%),
          radial-gradient(circle at 72% 55%, rgba(15,23,42,.06) 0 1px, transparent 1px 100%),
          linear-gradient(to left, rgba(15,23,42,.03), transparent);
          background-size:22px 22px, 28px 28px, auto;opacity:.7}
        .heroT{position:relative;margin:0;text-align:center;font-size:42px;font-weight:950;letter-spacing:-.6px}
        .heroS{position:relative;margin:10px auto 0;max-width:740px;text-align:center;color:rgba(15,23,42,.66);font-weight:650}
        .cats{margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .cat{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:14px;
          box-shadow:0 14px 34px rgba(15,23,42,.07)}
        .catTop{display:flex;justify-content:space-between;align-items:center}
        .icBox{width:56px;height:56px;border-radius:16px;background:rgba(15,23,42,.06);border:1px solid rgba(15,23,42,.08);
          display:grid;place-items:center}
        .ic{width:26px;height:26px;color:#0b1220}
        .meta{font-size:12px;font-weight:800;color:rgba(15,23,42,.55)}
        .catT{margin-top:10px;font-weight:950}
        .catS{margin-top:4px;font-size:12px;font-weight:650;color:rgba(15,23,42,.62)}
        .head{margin-top:18px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
        .h2{margin:0;font-size:18px;font-weight:950}
        .hint{font-size:12px;color:rgba(15,23,42,.55);font-weight:750}
        .grid{margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .card{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:18px;overflow:hidden;
          box-shadow:0 18px 44px rgba(15,23,42,.09);transition:transform .16s ease, box-shadow .16s ease}
        .card:hover{transform:translateY(-3px);box-shadow:0 26px 70px rgba(15,23,42,.14)}
        .card.ph{opacity:.86}
        .img{aspect-ratio:1/1;background:#e5e7eb}
        .img img{width:100%;height:100%;object-fit:cover;display:block}
        .body{padding:12px 12px 14px;text-align:center}
        .n{font-weight:950}
        .p{margin-top:2px;font-size:12px;font-weight:700;color:rgba(15,23,42,.62)}
        .stars{margin-top:8px;color:#f5c542;letter-spacing:1px}
        .pill{margin-top:10px;width:100%;border-radius:999px;padding:10px 12px;
          background:linear-gradient(180deg,#0b0f1a,#0b1220);color:#fff;font-weight:950}
        .pill:disabled{background:#334155;cursor:not-allowed}
        .side{display:flex;flex-direction:column;gap:14px}
        .sideCard{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:14px;box-shadow:0 18px 44px rgba(15,23,42,.09)}
        .sideT{font-weight:950;margin-bottom:10px}
        .skList{display:flex;flex-direction:column;gap:12px}
        .skRow{display:flex;gap:10px;align-items:flex-start}
        .skAva{width:36px;height:36px;border-radius:999px;background:#e5e7eb;border:1px solid rgba(15,23,42,.06)}
        .skTxt{flex:1;padding-top:2px;display:flex;flex-direction:column;gap:8px}
        .skL{height:10px;border-radius:999px;background:linear-gradient(90deg,#eef2f7,#e5e7eb,#eef2f7);background-size:200% 100%;animation:sh 1.2s infinite linear}
        .w80{width:80%}.w55{width:55%}.w40{width:110px}
        .helpers{display:flex;flex-direction:column;gap:12px}
        .hRow{display:flex;justify-content:space-between;align-items:center;gap:10px}
        .hLeft{display:flex;align-items:center;gap:10px}
        .gold{width:44px;height:26px;border-radius:10px;background:#f3e2a8;border:1px solid rgba(15,23,42,.06)}
        @keyframes sh{0%{background-position:0 0}100%{background-position:200% 0}}
        @media(max-width:1100px){.wrap{grid-template-columns:1fr}.cats{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:520px){.topIn{grid-template-columns:1fr}.user{justify-content:flex-start}.heroT{font-size:30px}}
      `}</style>
    </main>
  );
}
