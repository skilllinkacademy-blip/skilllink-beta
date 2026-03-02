import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SVGProps } from "react";
import { supabase } from "../lib/supabaseClient";

type ProfileRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  role?: string | null;
  created_at?: string | null;
};

type Mentor = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  tradeId: string | null;
};

type Trade = {
  id: string;
  label: string;
  subtitle: string;
  imageUrl: string;
  keywords: string[]; // used to infer trade from profession text
};

const TRADES: Trade[] = [
  {
    id: "electricity",
    label: "חשמל",
    subtitle: "לוחות, תקלות, התקנות",
    imageUrl:
      "https://images.unsplash.com/photo-1581091870627-3f98a59f8f2c?auto=format&fit=crop&w=1200&q=80",
    keywords: ["חשמל", "חשמלא", "לוח חשמל", "תלת פאזי"],
  },
  {
    id: "plumbing",
    label: "אינסטלציה",
    subtitle: "דליפות, סתימות, קווים",
    imageUrl:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    keywords: ["אינסטל", "אינסטלט", "שרברב", "ביוב", "נזילה", "סתימה"],
  },
  {
    id: "hvac",
    label: "מיזוג",
    subtitle: "התקנה, ניקוי, תחזוקה",
    imageUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    keywords: ["מיזוג", "מזגן", "hvac", "קירור"],
  },
  {
    id: "carpentry",
    label: "נגרות",
    subtitle: "מטבחים, דלתות, עץ",
    imageUrl:
      "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80",
    keywords: ["נגר", "עץ", "מטבח", "ארון"],
  },
  {
    id: "painting",
    label: "צבע",
    subtitle: "צביעה, תיקונים, שפכטל",
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-8e7689d2f8d9?auto=format&fit=crop&w=1200&q=80",
    keywords: ["צבע", "צביעה", "שפכטל", "טיח"],
  },
  {
    id: "tiling",
    label: "ריצוף/קרמיקה",
    subtitle: "ריצוף, חיפוי, מקלחות",
    imageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20b?auto=format&fit=crop&w=1200&q=80",
    keywords: ["ריצוף", "קרמיקה", "חיפוי", "גרניט", "פורצלן", "שיפוצים"],
  },
  {
    id: "locksmith",
    label: "מנעולנות",
    subtitle: "דלתות, פריצות, צילינדרים",
    imageUrl:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80",
    keywords: ["מנעול", "מנעולן", "צילינדר", "פריצה"],
  },
  {
    id: "cleaning",
    label: "ניקיון",
    subtitle: "בתים, משרדים, אחרי שיפוץ",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    keywords: ["ניקיון", "מנקה", "פוליש"],
  },
  {
    id: "gardening",
    label: "גינון",
    subtitle: "גינות, השקיה, תחזוקה",
    imageUrl:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
    keywords: ["גינון", "גנן", "השקיה", "דשא", "גינה"],
  },
  {
    id: "appliances",
    label: "תיקון מכשירים",
    subtitle: "מקרר, מכונה, תנור",
    imageUrl:
      "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?auto=format&fit=crop&w=1200&q=80",
    keywords: ["טכנאי", "מכשירים", "מקרר", "מכונת כביסה", "תנור", "מדיח"],
  },
];

function safeName(x?: string | null) {
  const s = (x || "").trim();
  return s || "אורח";
}

function avatarFallback(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=111827&color=fff&bold=true&size=256`;
}

function inferTradeId(profession?: string | null): string | null {
  const p = (profession || "").toLowerCase().trim();
  if (!p) return null;

  for (const t of TRADES) {
    for (const k of t.keywords) {
      if (p.includes(k.toLowerCase())) return t.id;
    }
  }
  return null;
}

/* Icons (modern app-like) */
function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M18 8.9a6 6 0 1 0-12 0c0 6.6-3 6.6-3 6.6h18s-3 0-3-6.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 19.7c.35 1.25 1.15 2.3 2.1 2.3s1.75-1.05 2.1-2.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 10.6 12 4l8 6.6V20a2 2 0 0 1-2 2h-3v-7H9v7H6a2 2 0 0 1-2-2v-9.4Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MsgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.8L3 21l1.3-5.6A8.5 8.5 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function CalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3v3M17 3v3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M7.5 12h3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M19.4 13.1a7.9 7.9 0 0 0 0-2.2l2-1.5-2-3.4-2.4 1a8.1 8.1 0 0 0-1.9-1.1l-.4-2.6H9.3l-.4 2.6a8.1 8.1 0 0 0-1.9 1.1l-2.4-1-2 3.4 2 1.5a7.9 7.9 0 0 0 0 2.2l-2 1.5 2 3.4 2.4-1c.6.4 1.2.8 1.9 1.1l.4 2.6h5.4l.4-2.6c.7-.3 1.3-.7 1.9-1.1l2.4 1 2-3.4-2-1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<ProfileRow | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [q, setQ] = useState("");
  const [activeTradeId, setActiveTradeId] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const { data: me } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, profession, role, created_at")
          .eq("id", session.user.id)
          .single();
        if (me) setViewer(me as ProfileRow);
      }

      const { data: rows } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, profession, role, created_at")
        .eq("role", "mentor")
        .order("created_at", { ascending: false })
        .limit(48);

      const mapped: Mentor[] = (((rows as ProfileRow[] | null) || []) as ProfileRow[]).map((r) => {
        const name = safeName(r.full_name);
        const title = (r.profession || "איש/אשת מקצוע").trim();
        return {
          id: r.id,
          name,
          title,
          avatarUrl: (r.avatar_url || "").trim() || avatarFallback(name),
          tradeId: inferTradeId(r.profession),
        };
      });

      setMentors(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const ch = supabase
      .channel("feed-mentors")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: "role=eq.mentor" },
        () => load()
      )
      .subscribe();

    const t = setInterval(() => load(), 60000);

    return () => {
      clearInterval(t);
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    for (const t of TRADES) base[t.id] = 0;
    mentors.forEach((m) => {
      if (m.tradeId && base[m.tradeId] !== undefined) base[m.tradeId] += 1;
    });
    return base;
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return mentors.filter((m) => {
      const byText = !qq || (m.name + " " + m.title).toLowerCase().includes(qq);
      const byTrade = activeTradeId === "all" || m.tradeId === activeTradeId;
      return byText && byTrade;
    });
  }, [mentors, q, activeTradeId]);

  const noMentors = !loading && mentors.length === 0;

  return (
    <main dir="rtl" className="sl">
      <Head>
        <title>SkillLink | Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="top">
        <div className="topIn">
          <div className="brand">
            <a className="brandLink" href="/feed">SkillLink</a>
          </div>

          <div className="search" role="search">
            <span className="searchIcon" aria-hidden>
              <SearchIcon className="icSearch" />
            </span>
            <input
              className="searchInput"
              placeholder="חיפוש לפי מקצוע / שם / עיר"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="toolbar">
            <a className="toolBtn" href="/feed" aria-label="בית">
              <HomeIcon className="toolIc" />
            </a>
            <a className="toolBtn" href="/search" aria-label="חיפוש">
              <SearchIcon className="toolIc" />
            </a>
            <a className="toolBtn" href="#" aria-label="הודעות">
              <MsgIcon className="toolIc" />
            </a>
            <a className="toolBtn" href="/calendar" aria-label="לוח שנה">
              <CalIcon className="toolIc" />
            </a>

            <button className="toolBtn" type="button" aria-label="התראות">
              <BellIcon className="toolIc" />
            </button>

            <div className="menuWrap" ref={menuRef}>
              <button className="profileBtn" type="button" onClick={() => setMenuOpen((v) => !v)}>
                <img
                  className="ava"
                  alt="avatar"
                  src={(viewer?.avatar_url || "").trim() || avatarFallback(safeName(viewer?.full_name))}
                />
              </button>

              {menuOpen && (
                <div className="menu">
                  <div className="menuHead">
                    <div className="menuName">{safeName(viewer?.full_name)}</div>
                    <div className="menuSub">{(viewer?.profession || "").trim() || "משתמש"}</div>
                  </div>

                  <a className="menuItem" href="/profile">פרופיל</a>
                  <a className="menuItem" href="#">
                    <span>הגדרות</span>
                    <GearIcon className="menuIc" />
                  </a>
                  <button
                    className="menuItem danger"
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      location.href = "/login";
                    }}
                  >
                    התנתקות
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trades strip (images) */}
        <div className="tradeStrip">
          <div className="tradeStripIn">
            <button
              type="button"
              className={`tradeChip ${activeTradeId === "all" ? "on" : ""}`}
              onClick={() => setActiveTradeId("all")}
            >
              כל התחומים
            </button>

            {TRADES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tradeCard ${activeTradeId === t.id ? "on" : ""}`}
                onClick={() => setActiveTradeId(t.id)}
                title={t.label}
              >
                <img className="tradeImg" src={t.imageUrl} alt={t.label} />
                <div className="tradeFade" />
                <div className="tradeMeta">
                  <div className="tradeT">{t.label}</div>
                  <div className="tradeN">
                    {loading ? "…" : counts[t.id] > 0 ? `${counts[t.id]} זמינים` : "עדיין אין"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="shell">
        <section className="main">
          <div className="secHead">
            <div className="secTitle">מנטורים</div>
            {noMentors ? (
              <span className="tag">עדיין אין</span>
            ) : (
              !loading && <span className="tag">{filteredMentors.length}</span>
            )}
          </div>

          <section className="grid">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="card sk">
                  <div className="skImg" />
                  <div className="skBody">
                    <div className="skLine w70" />
                    <div className="skLine w55" />
                    <div className="skLine w45" />
                  </div>
                </div>
              ))
            ) : filteredMentors.length ? (
              filteredMentors.map((m) => (
                <article key={m.id} className="card">
                  <div className="img">
                    <img src={m.avatarUrl} alt={m.name} />
                  </div>
                  <div className="body">
                    <div className="name">{m.name}</div>
                    <div className="title">{m.title}</div>
                    <button className="btn" type="button">
                      פרופיל
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">אין תוצאות.</div>
            )}
          </section>
        </section>

        <aside className="side">
          <div className="sideCard">
            <div className="sideT">Activity</div>
            <div className="sideHint">בקרוב</div>
          </div>

          <div className="sideCard">
            <div className="sideT">Shortcuts</div>
            <div className="sideHint">בקרוב</div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .sl{
          min-height:100vh;
          background:#f4f6f8;
          color:#0b1220;
          font-family:"Heebo","Inter",system-ui,-apple-system,Segoe UI,sans-serif;
        }

        /* Prevent global CSS from blowing up SVG sizes */
        :global(.sl svg){
          width:auto !important;
          height:auto !important;
          max-width:none !important;
          max-height:none !important;
        }
        .icSearch{width:18px !important;height:18px !important;display:block;}
        .toolIc{width:20px !important;height:20px !important;display:block;}
        .menuIc{width:18px !important;height:18px !important;display:block;opacity:.8;}

        .top{
          position:sticky;top:0;z-index:50;
          background:rgba(255,255,255,.86);
          backdrop-filter: blur(14px);
          border-bottom:1px solid rgba(17,24,39,.10);
        }

        .topIn{
          max-width:1280px;margin:0 auto;
          padding:12px 16px;
          display:grid;gap:14px;
          grid-template-columns: 180px 1fr 360px;
          align-items:center;
        }

        .brandLink{
          font-weight:950;
          font-size:24px;
          letter-spacing:-.6px;
          color:#0b1220;
          text-decoration:none;
        }

        .search{
          position:relative;
          height:44px;
          border-radius:14px;
          background:#fff;
          border:1px solid rgba(17,24,39,.12);
          box-shadow: 0 14px 40px rgba(17,24,39,.07);
          display:flex;align-items:center;
          overflow:hidden;
        }
        .search:focus-within{
          border-color: rgba(24,119,242,.35);
          box-shadow: 0 0 0 4px rgba(24,119,242,.14), 0 14px 40px rgba(17,24,39,.07);
        }
        .searchIcon{
          position:absolute;
          right:14px;top:50%;
          transform:translateY(-50%);
          width:18px;height:18px;
          display:grid;place-items:center;
          color:rgba(17,24,39,.55);
          pointer-events:none;
        }
        .searchInput{
          width:100%;
          height:44px;
          padding:0 44px 0 14px;
          border:0;outline:0;
          background:transparent;
          font-weight:850;
          color:#0b1220;
        }

        .toolbar{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:6px;
        }
        .toolBtn{
          width:40px;height:40px;
          border-radius:12px;
          border:1px solid transparent;
          background:transparent;
          display:grid;place-items:center;
          color:#0b1220;
          text-decoration:none;
        }
        .toolBtn:hover{
          background: rgba(17,24,39,.06);
          border-color: rgba(17,24,39,.06);
        }

        .menuWrap{position:relative;margin-right:6px}
        .profileBtn{
          width:42px;height:42px;
          border-radius:14px;
          border:1px solid rgba(17,24,39,.10);
          background:#fff;
          box-shadow: 0 12px 30px rgba(17,24,39,.08);
          padding:0;
          overflow:hidden;
          display:grid;place-items:center;
        }
        .ava{width:100%;height:100%;object-fit:cover;display:block}

        .menu{
          position:absolute;
          left:0; top:52px;
          width:260px;
          background:#fff;
          border:1px solid rgba(17,24,39,.10);
          border-radius:16px;
          box-shadow: 0 30px 90px rgba(17,24,39,.18);
          overflow:hidden;
        }
        .menuHead{
          padding:12px;
          border-bottom:1px solid rgba(17,24,39,.08);
          background: linear-gradient(180deg, rgba(24,119,242,.08), transparent);
        }
        .menuName{font-weight:950}
        .menuSub{margin-top:2px;font-size:12px;font-weight:750;color:rgba(17,24,39,.65)}
        .menuItem{
          padding:12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          text-decoration:none;
          color:#0b1220;
          font-weight:850;
          background:#fff;
          border:0;
          width:100%;
          text-align:right;
        }
        .menuItem:hover{background: rgba(17,24,39,.04)}
        .menuItem.danger{color:#b42318}

        .tradeStrip{
          border-top:1px solid rgba(17,24,39,.06);
          padding:10px 0 12px;
        }
        .tradeStripIn{
          max-width:1280px;margin:0 auto;
          padding:0 16px;
          display:flex;
          gap:10px;
          overflow:auto;
          -webkit-overflow-scrolling: touch;
        }
        .tradeStripIn::-webkit-scrollbar{height:8px}
        .tradeStripIn::-webkit-scrollbar-thumb{background:rgba(17,24,39,.12);border-radius:999px}

        .tradeChip{
          flex:0 0 auto;
          height:44px;
          padding:0 14px;
          border-radius:14px;
          background:#fff;
          border:1px solid rgba(17,24,39,.10);
          font-weight:950;
          color:#0b1220;
        }
        .tradeChip.on{
          border-color: rgba(24,119,242,.35);
          box-shadow: 0 0 0 4px rgba(24,119,242,.12);
        }

        .tradeCard{
          position:relative;
          flex:0 0 auto;
          width:176px;
          height:44px;
          border-radius:14px;
          border:1px solid rgba(17,24,39,.10);
          overflow:hidden;
          background:#fff;
          padding:0;
        }
        .tradeCard:hover{transform: translateY(-1px)}
        .tradeCard.on{
          border-color: rgba(24,119,242,.35);
          box-shadow: 0 0 0 4px rgba(24,119,242,.12);
        }
        .tradeImg{
          position:absolute;inset:0;
          width:100%;height:100%;
          object-fit:cover;
          filter:saturate(1.05) contrast(1.02);
        }
        .tradeFade{
          position:absolute;inset:0;
          background: linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.20));
        }
        .tradeMeta{
          position:absolute;inset:0;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 12px;
          color:#fff;
        }
        .tradeT{font-weight:950}
        .tradeN{font-size:12px;font-weight:900;opacity:.95}

        .shell{
          max-width:1280px;margin:0 auto;
          padding:18px 16px 34px;
          display:grid;
          grid-template-columns: 1fr 360px;
          gap:18px;
          align-items:start;
        }

        .secHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin: 6px 0 12px;
        }
        .secTitle{font-weight:950;font-size:16px}
        .tag{
          font-size:12px;
          font-weight:950;
          color:#1877f2;
          background: rgba(24,119,242,.10);
          border:1px solid rgba(24,119,242,.18);
          padding:6px 10px;
          border-radius:999px;
          white-space:nowrap;
        }

        .grid{
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:14px;
        }

        .card{
          background:#fff;
          border:1px solid rgba(17,24,39,.10);
          border-radius:18px;
          overflow:hidden;
          box-shadow: 0 18px 46px rgba(17,24,39,.09);
        }

        .img{aspect-ratio: 4 / 3; background:#e5e7eb;}
        .img img{width:100%;height:100%;object-fit:cover;display:block}

        .body{padding:12px}
        .name{font-weight:950}
        .title{margin-top:3px;font-size:12px;font-weight:750;color:rgba(17,24,39,.65)}
        .btn{
          margin-top:10px;
          height:36px;
          border-radius:12px;
          padding:0 14px;
          background:#0b1220;
          color:#fff;
          border:0;
          font-weight:950;
        }

        .empty{
          grid-column: 1 / -1;
          background:#fff;
          border:1px dashed rgba(17,24,39,.18);
          border-radius:16px;
          padding:18px;
          font-weight:850;
          color:rgba(17,24,39,.70);
          text-align:center;
        }

        .side{display:flex;flex-direction:column;gap:14px}
        .sideCard{
          background:#fff;
          border:1px solid rgba(17,24,39,.10);
          border-radius:18px;
          padding:14px;
          box-shadow: 0 18px 46px rgba(17,24,39,.09);
        }
        .sideT{font-weight:950}
        .sideHint{margin-top:8px;color:rgba(17,24,39,.65);font-weight:750}

        /* skeleton */
        .skImg{height:150px;background:#e5e7eb}
        .skBody{padding:12px}
        .skLine{height:10px;border-radius:999px;background:#e5e7eb;margin-top:10px}
        .w70{width:70%}.w55{width:55%}.w45{width:45%}

        @media (max-width: 1100px){
          .shell{grid-template-columns: 1fr}
          .grid{grid-template-columns: repeat(2, 1fr)}
          .topIn{grid-template-columns: 1fr}
          .toolbar{justify-content:flex-start}
        }
        @media (max-width: 560px){
          .grid{grid-template-columns: 1fr}
          .tradeCard{width:150px}
        }
      `}</style>
    </main>
  );
}
