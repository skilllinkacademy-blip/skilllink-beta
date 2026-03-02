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
  category?: string | null; // אם קיים אצלך בעתיד
  created_at?: string | null;
};

type Mentor = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  category: CategoryKey | null;
};

const CAT_LIST: { key: CategoryKey; subtitle: string }[] = [
  { key: "חשמל", subtitle: "תיקונים, התקנות, תשתיות" },
  { key: "אינסטלציה", subtitle: "דליפות, קווים, פתיחת סתימות" },
  { key: "מיזוג אוויר", subtitle: "התקנה, ניקוי, תחזוקה" },
  { key: "נגרות", subtitle: "מטבחים, דלתות, עבודות עץ" },
];

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M13.7 19.8c-.3 1-1 2.2-1.7 2.2s-1.4-1.2-1.7-2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
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

function CatIcon({ k, className }: { k: CategoryKey; className?: string }) {
  const common = { className };
  if (k === "חשמל")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...common}>
        <path
          d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (k === "אינסטלציה")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...common}>
        <path d="M6 10h12v3H6v-3Z" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M9 10V7.8A2.3 2.3 0 0 1 11.3 5.5h1.4A2.3 2.3 0 0 1 15 7.8V10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 13v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10.7 19.3c.55 1.05 2.05 1.05 2.6 0 .45-.85-.2-1.75-1.3-3.2-1.1 1.45-1.75 2.35-1.3 3.2Z"
          fill="currentColor"
          opacity=".16"
        />
      </svg>
    );

  if (k === "מיזוג אוויר")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...common}>
        <path
          d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v3A2.5 2.5 0 0 1 16.5 13h-9A2.5 2.5 0 0 1 5 10.5v-3Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M7 16c1.5 0 1.5 2 3 2s1.5-2 3-2 1.5 2 3 2 1.5-2 3-2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...common}>
      <path
        d="m14 4 6 6-9 9H5v-6l9-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 8l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function safeName(x?: string | null) {
  const s = (x || "").trim();
  return s || "אורח";
}

function avatarFallback(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=1877F2&color=fff&bold=true&size=256`;
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

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<ProfileRow | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const run = async () => {
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
          .limit(24);

        const mapped: Mentor[] = ((rows as ProfileRow[] | null) || []).map((r) => {
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

    run();
  }, []);

  const filteredMentors = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return mentors;
    return mentors.filter((m) => (m.name + " " + m.title).toLowerCase().includes(qq));
  }, [mentors, q]);

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
            <SearchIcon className="sIc" />
            <input
              className="sIn"
              placeholder="חפש מנטור, מקצוע או מיקום..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="user">
            <button className="iconBtn" aria-label="התראות">
              <BellIcon className="bell" />
            </button>
            <div className="uName">{safeName(viewer?.full_name)}</div>
            <img
              className="ava"
              alt="avatar"
              src={(viewer?.avatar_url || "").trim() || avatarFallback(safeName(viewer?.full_name))}
            />
          </div>
        </div>
      </header>

      <div className="shell">
        <section className="main">
          <section className="hero">
            <div className="heroBg" />
            <div className="heroIn">
              <h1 className="heroT">
                ברוכים הבאים{viewer?.full_name ? `, ${safeName(viewer.full_name)}` : ""}!
              </h1>
              <p className="heroS">
                עיצוב מודרני בסגנון Meta + נתונים שמסתנכרנים מהמערכת בזמן אמת.
              </p>
            </div>
          </section>

          <section className="cats">
            {CAT_LIST.map((c) => {
              const n = counts[c.key];
              return (
                <div key={c.key} className="cat">
                  <div className="catTop">
                    <div className="catIcon">
                      <CatIcon k={c.key} className="catSvg" />
                    </div>
                    <div className="catMeta">
                      {loading ? "טוען..." : n > 0 ? `${n} מנטורים זמינים` : "עדיין אין"}
                    </div>
                  </div>
                  <div className="catT">{c.key}</div>
                  <div className="catS">{c.subtitle}</div>
                </div>
              );
            })}
          </section>

          <div className="secHead">
            <h2 className="secT">מנטורים מומלצים</h2>
            {noMentors && <span className="emptyTag">עדיין אין</span>}
          </div>

          <section className="grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="mCard sk">
                  <div className="skImg" />
                  <div className="skBody">
                    <div className="skLine w70" />
                    <div className="skLine w50" />
                    <div className="skBtn" />
                  </div>
                </div>
              ))
            ) : filteredMentors.length ? (
              filteredMentors.map((m) => (
                <article key={m.id} className="mCard">
                  <div className="mImg">
                    <img src={m.avatarUrl} alt={m.name} />
                  </div>
                  <div className="mBody">
                    <div className="mName">{m.name}</div>
                    <div className="mTitle">{m.title}</div>
                    <button className="pill">צפה בפרופיל</button>
                  </div>
                </article>
              ))
            ) : (
              <div className="emptyBox">אין תוצאות לחיפוש.</div>
            )}
          </section>
        </section>

        <aside className="side">
          <div className="sideCard">
            <div className="sideTitle">התראות</div>
            <div className="sideHint">בקרוב</div>
          </div>

          <div className="sideCard">
            <div className="sideTitle">העוזרים</div>
            <div className="sideHint">בקרוב</div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        /* Fix: לנטרל CSS גלובלי שיכול “לפוצץ” SVG */
        :global(.sl svg) {
          width: auto;
          height: auto;
          max-width: none;
          max-height: none;
        }

        .sIc {
          width: 18px !important;
          height: 18px !important;
          flex: 0 0 18px;
          color: #6b7280;
          display: block;
        }
        .bell {
          width: 20px !important;
          height: 20px !important;
          color: #111827;
          display: block;
        }
        .catSvg {
          width: 28px !important;
          height: 28px !important;
          color: #111827;
          display: block;
        }

        .sl {
          min-height: 100vh;
          background: #f0f2f5;
          color: #111827;
          font-family: "Heebo", "Inter", system-ui, -apple-system, Segoe UI, sans-serif;
        }

        .top {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(17, 24, 39, 0.1);
        }

        .topIn {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 16px;
          display: grid;
          gap: 14px;
          grid-template-columns: 200px 1fr 260px;
          align-items: center;
        }

        .brand {
          font-weight: 900;
          font-size: 26px;
          letter-spacing: -0.6px;
          color: #111827;
        }

        .search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.14);
          border-radius: 999px;
          padding: 10px 12px;
          box-shadow: 0 10px 26px rgba(17, 24, 39, 0.06);
        }

        .search:focus-within {
          box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.18),
            0 10px 26px rgba(17, 24, 39, 0.06);
          border-color: rgba(24, 119, 242, 0.35);
        }

        .sIn {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: 700;
          font-size: 14px;
          color: #111827;
        }

        .user {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .uName {
          font-weight: 800;
          color: #111827;
        }

        .ava {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(17, 24, 39, 0.12);
        }

        .iconBtn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.12);
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
          display: grid;
          place-items: center;
        }

        .shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 16px 28px;
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 360px;
          align-items: start;
        }

        .hero {
          position: relative;
          border-radius: 18px;
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          box-shadow: 0 18px 50px rgba(17, 24, 39, 0.08);
          overflow: hidden;
        }

        .heroBg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 20% 30%,
              rgba(24, 119, 242, 0.18) 0,
              transparent 40%
            ),
            radial-gradient(
              circle at 70% 40%,
              rgba(17, 24, 39, 0.06) 0,
              transparent 45%
            ),
            linear-gradient(180deg, #fff, #fff);
          opacity: 0.9;
        }

        .heroIn {
          position: relative;
          padding: 26px 18px;
          text-align: center;
        }

        .heroT {
          margin: 0;
          font-size: 38px;
          font-weight: 950;
          letter-spacing: -0.7px;
        }

        .heroS {
          margin: 10px auto 0;
          max-width: 740px;
          color: rgba(17, 24, 39, 0.7);
          font-weight: 650;
        }

        .cats {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .cat {
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(17, 24, 39, 0.08);
          padding: 14px;
        }

        .catTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .catIcon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: rgba(24, 119, 242, 0.08);
          border: 1px solid rgba(24, 119, 242, 0.16);
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .catMeta {
          font-size: 12px;
          font-weight: 850;
          color: rgba(17, 24, 39, 0.6);
          white-space: nowrap;
        }

        .catT {
          margin-top: 10px;
          font-weight: 950;
        }

        .catS {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 650;
          color: rgba(17, 24, 39, 0.65);
        }

        .secHead {
          margin-top: 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .secT {
          margin: 0;
          font-size: 18px;
          font-weight: 950;
        }

        .emptyTag {
          font-size: 12px;
          font-weight: 900;
          color: #1877f2;
          background: rgba(24, 119, 242, 0.1);
          border: 1px solid rgba(24, 119, 242, 0.18);
          padding: 6px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .grid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .mCard {
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 46px rgba(17, 24, 39, 0.1);
        }

        .mImg {
          aspect-ratio: 4 / 3;
          background: #e5e7eb;
        }

        .mImg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mBody {
          padding: 12px;
          text-align: center;
        }

        .mName {
          font-weight: 950;
        }

        .mTitle {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(17, 24, 39, 0.66);
        }

        .pill {
          margin-top: 10px;
          border-radius: 999px;
          padding: 9px 14px;
          background: #1877f2;
          color: #fff;
          border: 0;
          font-weight: 950;
          box-shadow: 0 10px 24px rgba(24, 119, 242, 0.26);
        }

        .emptyBox {
          grid-column: 1 / -1;
          background: #fff;
          border: 1px dashed rgba(17, 24, 39, 0.18);
          border-radius: 16px;
          padding: 18px;
          color: rgba(17, 24, 39, 0.7);
          font-weight: 750;
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
          box-shadow: 0 18px 46px rgba(17, 24, 39, 0.1);
        }

        .sideTitle {
          font-weight: 950;
        }

        .sideHint {
          margin-top: 8px;
          color: rgba(17, 24, 39, 0.65);
          font-weight: 700;
        }

        /* loading skeleton */
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
        .skLine.w70 {
          width: 70%;
        }
        .skLine.w50 {
          width: 50%;
        }
        .skBtn {
          height: 34px;
          border-radius: 999px;
          background: #dbeafe;
          margin-top: 12px;
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
          .user {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .heroT {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
