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

const CATEGORIES: { key: CategoryKey; icon: string; subtitle: string }[] = [
  { key: "חשמל", icon: "⚡", subtitle: "תיקונים, התקנות, תשתיות" },
  { key: "אינסטלציה", icon: "🚰", subtitle: "דליפות, קווים, פתיחת סתימות" },
  { key: "מיזוג אוויר", icon: "❄️", subtitle: "התקנה, ניקוי, תחזוקה" },
  { key: "נגרות", icon: "🪚", subtitle: "מטבחים, דלתות, עבודות עץ" },
];

function firstName(fullName?: string | null) {
  if (!fullName) return "אורח";
  return fullName.trim().split(" ")[0] || "אורח";
}

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&size=256`;
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

      const {
        data: { session },
      } = await supabase.auth.getSession();

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

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    mentors.forEach((m) => {
      const p = (m.profession || "").toLowerCase();
      if (p.includes("חשמל")) counts["חשמל"] = (counts["חשמל"] || 0) + 1;
      if (p.includes("אינסטל")) counts["אינסטלציה"] = (counts["אינסטלציה"] || 0) + 1;
      if (p.includes("מיזוג") || p.includes("מזגן")) counts["מיזוג אוויר"] = (counts["מיזוג אוויר"] || 0) + 1;
      if (p.includes("נגר")) counts["נגרות"] = (counts["נגרות"] || 0) + 1;
    });
    return counts;
  }, [mentors]);

  return (
    <div dir="rtl" className="sl-page">
      {/* Top bar */}
      <header className="sl-topbar">
        <div className="sl-topbarInner">
          <div className="sl-brand" onClick={() => router.push("/")} role="button" aria-label="SkillLink home">
            SkillLink
          </div>

          <div className="sl-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sl-searchInput"
              placeholder="חפש מנטור, מקצוע או מיומנות..."
            />
            <span className="sl-searchIcon" aria-hidden>
              🔍
            </span>
          </div>

          <div className="sl-user">
            <img
              className="sl-avatar"
              src={profile?.avatar_url || avatarFor(profile?.full_name || "User")}
              alt="avatar"
            />
            <div className="sl-userName">{firstName(profile?.full_name)} 👑</div>
            <button className="sl-iconBtn" aria-label="notifications">
              🔔
            </button>
          </div>
        </div>
      </header>

      <div className="sl-shell">
        {/* Main */}
        <main className="sl-main">
          <section className="sl-hero">
            <div className="sl-heroInner">
              <h1 className="sl-heroTitle">ברוכים הבאים, {firstName(profile?.full_name)}!</h1>
              <p className="sl-heroSub">
                כאן תמצא מנטורים ואנשי מקצוע לפי תחום—וכשהפלטפורמה תתמלא, הכל יתעדכן אוטומטית.
              </p>
            </div>
          </section>

          <section className="sl-cats">
            {CATEGORIES.map((c) => {
              const count = countsByCategory[c.key] || 0;
              return (
                <div key={c.key} className="sl-catCard">
                  <div className="sl-catTop">
                    <div className="sl-catIcon" aria-hidden>
                      {c.icon}
                    </div>
                    <div className="sl-catMeta">{isEmpty ? "בקרוב" : `${count} זמינים`}</div>
                  </div>
                  <div className="sl-catTitle">{c.key}</div>
                  <div className="sl-catSub">{c.subtitle}</div>
                </div>
              );
            })}
          </section>

          <section className="sl-sectionHead">
            <h2 className="sl-sectionTitle">מנטורים מומלצים</h2>
            {isEmpty && <span className="sl-hint">אין עדיין מנטורים—מציג תצוגה מקדימה</span>}
          </section>

          <section className="sl-mentorGrid">
            {mentorsToShow.map((m) => {
              const placeholder = m.id.startsWith("ph-");
              const name = m.full_name || "מנטור";
              const prof = m.profession || "איש/אשת מקצוע";
              return (
                <article key={m.id} className={`sl-mentorCard ${placeholder ? "isPlaceholder" : ""}`}>
                  <div className="sl-mentorImgWrap">
                    <img
                      className="sl-mentorImg"
                      src={m.avatar_url || avatarFor(name)}
                      alt={name}
                      loading="lazy"
                    />
                  </div>

                  <div className="sl-mentorBody">
                    <div className="sl-mentorName">{name}</div>
                    <div className="sl-mentorProf">{prof}</div>

                    <div className="sl-stars" aria-label="rating">
                      ★★★★★
                    </div>

                    <button
                      className="sl-pillBtn"
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
          </section>
        </main>

        {/* Sidebar */}
        <aside className="sl-side">
          <div className="sl-sideCard">
            <div className="sl-sideTitle">לבושים:</div>

            <div className="sl-notiList">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sl-notiItem">
                  <div className="sl-miniAvatar" />
                  <div className="sl-notiText">
                    <div className="sl-skelLine w80" />
                    <div className="sl-skelLine w60" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sl-sideCard">
            <div className="sl-sideTitle">העוזרים</div>

            <div className="sl-helpers">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="sl-helperRow">
                  <div className="sl-helperLeft">
                    <div className="sl-miniAvatar" />
                    <div className="sl-skelLine w40" />
                  </div>
                  <div className="sl-badgeBtn" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer className="sl-footer">
        <div className="sl-footerInner">
          <div className="sl-footerCol">
            <div className="sl-footerTitle">תמיכה</div>
            <a href="#" className="sl-footerLink">צור קשר</a>
            <a href="#" className="sl-footerLink">שאלות נפוצות</a>
            <a href="#" className="sl-footerLink">דיווח</a>
          </div>

          <div className="sl-footerCol">
            <div className="sl-footerTitle">ראות סטטוס</div>
            <a href="#" className="sl-footerLink">זמין מלא</a>
            <a href="#" className="sl-footerLink">אינסטלציה</a>
            <a href="#" className="sl-footerLink">מסירות</a>
          </div>

          <div className="sl-footerCol">
            <div className="sl-footerTitle">קישורים למרצים</div>
            <div className="sl-socialRow" aria-label="social">
              <span className="sl-social">f</span>
              <span className="sl-social">x</span>
              <span className="sl-social">in</span>
              <span className="sl-social">ig</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .sl-page {
          min-height: 100vh;
          background: #f6f4ef;
          color: #111827;
        }

        .sl-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .sl-topbarInner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 220px 1fr 260px;
          gap: 16px;
          align-items: center;
          padding: 14px 16px;
        }

        .sl-brand {
          font-weight: 900;
          font-size: 22px;
          letter-spacing: -0.5px;
          cursor: pointer;
          user-select: none;
        }

        .sl-search {
          position: relative;
          display: flex;
          align-items: center;
          background: #fff;
          border: 3px solid #0b0f1a;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .sl-searchInput {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          font-size: 15px;
          font-weight: 700;
          text-align: right;
        }

        .sl-searchIcon {
          margin-right: 10px;
          font-size: 18px;
        }

        .sl-user {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .sl-avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid rgba(15, 23, 42, 0.08);
        }

        .sl-userName {
          font-weight: 800;
          font-size: 15px;
          white-space: nowrap;
        }

        .sl-iconBtn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.05);
          border: 1px solid rgba(15, 23, 42, 0.06);
          display: grid;
          place-items: center;
          font-size: 18px;
        }

        .sl-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 16px 28px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 18px;
          align-items: start;
        }

        .sl-hero {
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
        }

        .sl-heroInner {
          padding: 34px 22px;
          background:
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0 1px, transparent 1px 100%),
            radial-gradient(circle at 70% 50%, rgba(0,0,0,0.03) 0 1px, transparent 1px 100%),
            linear-gradient(to left, #fbfbfb, #ffffff);
          background-size: 22px 22px, 26px 26px, auto;
        }

        .sl-heroTitle {
          margin: 0;
          font-size: 40px;
          font-weight: 900;
          text-align: center;
        }

        .sl-heroSub {
          margin: 10px auto 0;
          max-width: 680px;
          text-align: center;
          color: rgba(15, 23, 42, 0.7);
          font-weight: 600;
        }

        .sl-cats {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .sl-catCard {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.06);
        }

        .sl-catTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sl-catIcon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.05);
          border: 1px solid rgba(15, 23, 42, 0.06);
          display: grid;
          place-items: center;
          font-size: 26px;
        }

        .sl-catMeta {
          font-size: 12px;
          font-weight: 800;
          color: rgba(15, 23, 42, 0.55);
        }

        .sl-catTitle {
          margin-top: 10px;
          font-weight: 900;
          font-size: 16px;
        }

        .sl-catSub {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.65);
        }

        .sl-sectionHead {
          margin-top: 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .sl-sectionTitle {
          margin: 0;
          font-size: 18px;
          font-weight: 900;
        }

        .sl-hint {
          font-size: 12px;
          color: rgba(15, 23, 42, 0.55);
          font-weight: 700;
        }

        .sl-mentorGrid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .sl-mentorCard {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.07);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .sl-mentorCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
        }

        .sl-mentorCard.isPlaceholder {
          opacity: 0.85;
        }

        .sl-mentorImgWrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #e5e7eb;
        }

        .sl-mentorImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sl-mentorBody {
          padding: 12px 12px 14px;
          text-align: center;
        }

        .sl-mentorName {
          font-weight: 900;
          font-size: 15px;
        }

        .sl-mentorProf {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.65);
        }

        .sl-stars {
          margin-top: 8px;
          color: #f5c542;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .sl-pillBtn {
          margin-top: 10px;
          width: 100%;
          border-radius: 999px;
          padding: 10px 12px;
          background: #0b0f1a;
          color: #fff;
          font-weight: 900;
        }

        .sl-pillBtn:disabled {
          background: #334155;
          cursor: not-allowed;
        }

        .sl-side {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sl-sideCard {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.07);
        }

        .sl-sideTitle {
          font-weight: 900;
          margin-bottom: 10px;
        }

        .sl-notiList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sl-notiItem {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .sl-miniAvatar {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: #e5e7eb;
          border: 1px solid rgba(15, 23, 42, 0.06);
          flex: 0 0 auto;
        }

        .sl-notiText {
          flex: 1;
          padding-top: 2px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sl-skelLine {
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #eef2f7, #e5e7eb, #eef2f7);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
        }

        .sl-skelLine.w80 { width: 80%; }
        .sl-skelLine.w60 { width: 60%; }
        .sl-skelLine.w40 { width: 110px; }

        .sl-helpers {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sl-helperRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .sl-helperLeft {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sl-badgeBtn {
          width: 44px;
          height: 26px;
          border-radius: 10px;
          background: #f3e2a8;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }

        .sl-footer {
          margin-top: 18px;
          background: #fff;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .sl-footerInner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 22px 16px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 18px;
          color: rgba(15, 23, 42, 0.7);
        }

        .sl-footerTitle {
          font-weight: 900;
          color: #0b0f1a;
          margin-bottom: 10px;
        }

        .sl-footerLink {
          display: block;
          margin: 6px 0;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.7);
          text-decoration: none;
        }

        .sl-footerLink:hover {
          text-decoration: underline;
        }

        .sl-socialRow {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .sl-social {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(15, 23, 42, 0.06);
          display: grid;
          place-items: center;
          font-weight: 900;
          color: rgba(15, 23, 42, 0.75);
        }

        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 1100px) {
          .sl-shell { grid-template-columns: 1fr; }
          .sl-topbarInner { grid-template-columns: 180px 1fr 220px; }
          .sl-cats { grid-template-columns: repeat(2, 1fr); }
          .sl-mentorGrid { grid-template-columns: repeat(2, 1fr); }
          .sl-footerInner { grid-template-columns: 1fr; }
        }

        @media (max-width: 520px) {
          .sl-topbarInner { grid-template-columns: 1fr; }
          .sl-user { justify-content: flex-start; }
          .sl-heroTitle { font-size: 30px; }
        }
      `}</style>
    </div>
  );
}
