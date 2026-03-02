import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import type { SVGProps } from "react";
import { supabase } from "../lib/supabaseClient";

type CategoryKey = "חשמל" | "אינסטלציה" | "מיזוג אוויר" | "נגרות";

type ProfileRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  role?: string | null;
  category?: string | null; // אם יהיה אצלך בעתיד
  created_at?: string | null;
};

type Mentor = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  category: CategoryKey | null;
};

const CATS: { key: CategoryKey; subtitle: string; tint: string; image?: string }[] = [
  { key: "חשמל", subtitle: "תיקונים, התקנות, תשתיות", tint: "#F59E0B" },
  { key: "אינסטלציה", subtitle: "דליפות, קווים, פתיחת סתימות", tint: "#06B6D4" },
  { key: "מיזוג אוויר", subtitle: "התקנה, ניקוי, תחזוקה", tint: "#3B82F6" },
  { key: "נגרות", subtitle: "מטבחים, דלתות, עבודות עץ", tint: "#10B981" },
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

function inferCategory(row: ProfileRow): CategoryKey | null {
  const c = (row.category || "").trim();
  if (c === "חשמל" || c === "אינסטלציה" || c === "מיזוג אוויר" || c === "נגרות") return c;

  const p = (row.profession || "").toLowerCase();
  if (p.includes("חשמל") || p.includes("חשמלא")) return "חשמל";
  if (p.includes("אינסטל") || p.includes("שרברב") || p.includes("אינסטלט")) return "אינסטלציה";
  if (p.includes("מיזוג") || p.includes("מזגן") || p.includes("hvac")) return "מיזוג אוויר";
  if (p.includes("נגר")) return "נגרות";
  return null;
}

/* Modern icons (hard-sized to prevent “giant search icon” bugs) */
function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function CatIcon({ k, className }: { k: CategoryKey; className?: string }) {
  if (k === "חשמל")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path
          d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (k === "אינסטלציה")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M6 10h12v3H6v-3Z" stroke="currentColor" strokeWidth="1.9" />
        <path
          d="M9 10V7.8A2.3 2.3 0 0 1 11.3 5.5h1.4A2.3 2.3 0 0 1 15 7.8V10"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path d="M12 13v6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path
          d="M10.7 19.3c.55 1.05 2.05 1.05 2.6 0 .45-.85-.2-1.75-1.3-3.2-1.1 1.45-1.75 2.35-1.3 3.2Z"
          fill="currentColor"
          opacity=".16"
        />
      </svg>
    );
  if (k === "מיזוג אוויר")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path
          d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v3A2.5 2.5 0 0 1 16.5 13h-9A2.5 2.5 0 0 1 5 10.5v-3Z"
          stroke="currentColor"
          strokeWidth="1.9"
        />
        <path
          d="M7 16c1.5 0 1.5 2 3 2s1.5-2 3-2 1.5 2 3 2 1.5-2 3-2"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="m14 4 6 6-9 9H5v-6l9-9Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M10 8l6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<ProfileRow | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryKey | "הכל">("הכל");

  const load = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const { data: me } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, profession, role, category, created_at")
          .eq("id", session.user.id)
          .single();

        if (me) setViewer(me as ProfileRow);
      }

      const { data: rows } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, profession, role, category, created_at")
        .eq("role", "mentor")
        .order("created_at", { ascending: false })
        .limit(36);

      const mapped: Mentor[] = (((rows as ProfileRow[] | null) || []) as ProfileRow[]).map((r) => {
        const name = safeName(r.full_name);
        return {
          id: r.id,
          name,
          title: (r.profession || "איש/אשת מקצוע").trim(),
          avatarUrl: (r.avatar_url || "").trim() || avatarFallback(name),
          category: inferCategory(r),
        };
      });

      setMentors(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    // realtime (אם לא פעיל בפרויקט, זה לא ישבור—פשוט לא יעדכן בזמן אמת)
    const ch = supabase
      .channel("feed-mentors")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: "role=eq.mentor" },
        () => load()
      )
      .subscribe();

    // fallback refresh קל (למקרה שאין realtime)
    const t = setInterval(() => load(), 45000);

    return () => {
      clearInterval(t);
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const base: Record<CategoryKey, number> = {
      "חשמל": 0,
      "אינסטלציה": 0,
      "מיזוג אוויר": 0,
      "נגרות": 0,
    };
    mentors.forEach((m) => {
      if (m.category) base[m.category] += 1;
    });
    return base;
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return mentors.filter((m) => {
      const byText = !qq || (m.name + " " + m.title).toLowerCase().includes(qq);
      const byCat = activeCat === "הכל" || m.category === activeCat;
      return byText && byCat;
    });
  }, [mentors, q, activeCat]);

  const noMentors = !loading && mentors.length === 0;

  return (
    <main dir="rtl" className="sl">
      <Head>
        <title>SkillLink | Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="top">
        <div className="topIn">
          <div className="brand">SkillLink</div>

          <div className="search" role="search">
            <span className="searchIcon" aria-hidden>
              <SearchIcon className="icSearch" />
            </span>
            <input
              className="searchInput"
              placeholder="חיפוש"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="actions">
            <button className="iconGhost" aria-label="התראות">
              <BellIcon className="icBell" />
            </button>
            <div className="userMini">
              <div className="uName">{safeName(viewer?.full_name)}</div>
              <img
                className="ava"
                alt="avatar"
                src={(viewer?.avatar_url || "").trim() || avatarFallback(safeName(viewer?.full_name))}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="shell">
        <section className="main">
          {/* Filters row (no “welcome”) */}
          <div className="filters">
            <button
              className={`chip ${activeCat === "הכל" ? "on" : ""}`}
              onClick={() => setActiveCat("הכל")}
              type="button"
            >
              הכל
            </button>
            {CATS.map((c) => (
              <button
                key={c.key}
                className={`chip ${activeCat === c.key ? "on" : ""}`}
                onClick={() => setActiveCat(c.key)}
                type="button"
              >
                {c.key}
              </button>
            ))}
          </div>

          {/* Categories cards */}
          <section className="cats">
            {CATS.map((c) => {
              const n = counts[c.key];
              return (
                <div key={c.key} className="cat" style={{ ["--tint" as any]: c.tint }}>
                  <div className="catIcon">
                    <CatIcon k={c.key} className="catSvg" />
                  </div>
                  <div className="catBody">
                    <div className="catT">{c.key}</div>
                    <div className="catS">{c.subtitle}</div>
                    <div className="catMeta">
                      {loading ? "טוען..." : n > 0 ? `${n} זמינים` : "עדיין אין"}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Mentors */}
          <div className="secHead">
            <div className="secT">מנטורים</div>
            {noMentors ? (
              <span className="tag">עדיין אין</span>
            ) : (
              !loading && <span className="tag">{filteredMentors.length}</span>
            )}
          </div>

          <section className="grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card sk">
                  <div className="skImg" />
                  <div className="skBody">
                    <div className="skLine w70" />
                    <div className="skLine w50" />
                    <div className="skLine w60" />
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
            <div className="sideT">התראות</div>
            <div className="sideHint">בקרוב</div>
          </div>

          <div className="sideCard">
            <div className="sideT">פעילים עכשיו</div>
            <div className="sideHint">בקרוב</div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .sl {
          min-height: 100vh;
          background: #f0f2f5;
          color: #0b1220;
          font-family: "Heebo", "Inter", system-ui, -apple-system, Segoe UI, sans-serif;
        }

        /* Hard-reset icons inside this page to prevent “giant search icon” */
        :global(.sl svg) {
          width: auto !important;
          height: auto !important;
          max-width: none !important;
          max-height: none !important;
        }

        .icSearch {
          width: 18px !important;
          height: 18px !important;
          display: block;
        }
        .icBell {
          width: 20px !important;
          height: 20px !important;
          display: block;
        }
        .catSvg {
          width: 28px !important;
          height: 28px !important;
          display: block;
        }

        .top {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(17, 24, 39, 0.1);
        }

        .topIn {
          max-width: 1220px;
          margin: 0 auto;
          padding: 12px 16px;
          display: grid;
          grid-template-columns: 200px 1fr 300px;
          align-items: center;
          gap: 14px;
        }

        .brand {
          font-weight: 950;
          font-size: 26px;
          letter-spacing: -0.6px;
        }

        .search {
          position: relative;
          height: 44px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.14);
          box-shadow: 0 10px 26px rgba(17, 24, 39, 0.06);
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .search:focus-within {
          border-color: rgba(24, 119, 242, 0.35);
          box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.18),
            0 10px 26px rgba(17, 24, 39, 0.06);
        }

        .searchIcon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          color: rgba(17, 24, 39, 0.55);
          pointer-events: none;
        }

        .searchInput {
          width: 100%;
          height: 44px;
          padding: 0 44px 0 14px;
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: 800;
          font-size: 14px;
          color: #0b1220;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .iconGhost {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: transparent;
          border: 0;
          display: grid;
          place-items: center;
          color: #0b1220;
        }
        .iconGhost:hover {
          background: rgba(17, 24, 39, 0.06);
        }

        .userMini {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .uName {
          font-weight: 900;
          white-space: nowrap;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ava {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(17, 24, 39, 0.12);
        }

        .shell {
          max-width: 1220px;
          margin: 0 auto;
          padding: 18px 16px 32px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 18px;
          align-items: start;
        }

        .filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .chip {
          height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(17, 24, 39, 0.12);
          background: rgba(255, 255, 255, 0.85);
          font-weight: 900;
          color: rgba(17, 24, 39, 0.78);
        }
        .chip.on {
          color: #0b1220;
          border-color: rgba(24, 119, 242, 0.35);
          box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.12);
        }

        .cats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .cat {
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 18px;
          box-shadow: 0 18px 46px rgba(17, 24, 39, 0.09);
          padding: 14px;
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 12px;
          align-items: center;
        }

        .catIcon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: color-mix(in srgb, var(--tint), white 88%);
          border: 1px solid color-mix(in srgb, var(--tint), white 72%);
          display: grid;
          place-items: center;
          color: #0b1220;
        }

        .catT {
          font-weight: 950;
          font-size: 15px;
        }

        .catS {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 750;
          color: rgba(17, 24, 39, 0.65);
        }

        .catMeta {
          margin-top: 10px;
          width: fit-content;
          font-size: 12px;
          font-weight: 950;
          color: rgba(17, 24, 39, 0.7);
          background: rgba(17, 24, 39, 0.06);
          border: 1px solid rgba(17, 24, 39, 0.08);
          padding: 6px 10px;
          border-radius: 999px;
        }

        .secHead {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .secT {
          font-weight: 950;
          font-size: 16px;
        }

        .tag {
          font-size: 12px;
          font-weight: 950;
          color: #1877f2;
          background: rgba(24, 119, 242, 0.1);
          border: 1px solid rgba(24, 119, 242, 0.18);
          padding: 6px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .grid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .card {
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 46px rgba(17, 24, 39, 0.09);
          transform: translateZ(0);
        }

        .img {
          aspect-ratio: 4 / 3;
          background: #e5e7eb;
        }
        .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .body {
          padding: 12px;
          text-align: right;
        }

        .name {
          font-weight: 950;
        }

        .title {
          margin-top: 3px;
          font-size: 12px;
          font-weight: 750;
          color: rgba(17, 24, 39, 0.65);
        }

        .btn {
          margin-top: 10px;
          height: 36px;
          border-radius: 999px;
          padding: 0 14px;
          background: #0b1220;
          color: #fff;
          border: 0;
          font-weight: 950;
        }

        .empty {
          grid-column: 1 / -1;
          background: #fff;
          border: 1px dashed rgba(17, 24, 39, 0.18);
          border-radius: 16px;
          padding: 18px;
          color: rgba(17, 24, 39, 0.7);
          font-weight: 850;
          text-align: center;
        }

        .side {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sideCard {
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 18px 46px rgba(17, 24, 39, 0.09);
        }

        .sideT {
          font-weight: 950;
        }

        .sideHint {
          margin-top: 8px;
          color: rgba(17, 24, 39, 0.65);
          font-weight: 750;
        }

        /* skeleton */
        .skImg {
          height: 150px;
          background: #e5e7eb;
        }
        .skBody {
          padding: 12px;
        }
        .skLine {
          height: 10px;
          border-radius: 999px;
          background: #e5e7eb;
          margin-top: 10px;
        }
        .w70 {
          width: 70%;
        }
        .w50 {
          width: 50%;
        }
        .w60 {
          width: 60%;
        }

        @media (max-width: 1100px) {
          .shell {
            grid-template-columns: 1fr;
          }
          .cats {
            grid-template-columns: repeat(2, 1fr);
          }
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .topIn {
            grid-template-columns: 1fr;
          }
          .actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .cats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
