import Head from "next/head";

type Category = {
  key: string;
  subtitle: string;
  countText: string;
  Icon: (p: any) => JSX.Element;
};

type Mentor = {
  id: string;
  name: string;
  title: string;
  img: string;
  rating: number;
};

const categories: Category[] = [
  {
    key: "חשמל",
    subtitle: "15 מנטורים זמינים",
    countText: "15 מנטורים זמינים",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path
          d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "אינסטלציה",
    subtitle: "15 מנטורים זמינים",
    countText: "15 מנטורים זמינים",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M6 10h12v3H6v-3Z" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M9 10V7.8A2.3 2.3 0 0 1 11.3 5.5h1.4A2.3 2.3 0 0 1 15 7.8V10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M12 13v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M10.7 19.3c.55 1.05 2.05 1.05 2.6 0 .45-.85-.2-1.75-1.3-3.2-1.1 1.45-1.75 2.35-1.3 3.2Z"
          fill="currentColor"
          opacity=".18"
        />
      </svg>
    ),
  },
  {
    key: "מיזוג אוויר",
    subtitle: "15 מנטורים זמינים",
    countText: "15 מנטורים זמינים",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
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
    ),
  },
  {
    key: "נגרות",
    subtitle: "15 מנטורים זמינים",
    countText: "15 מנטורים זמינים",
    Icon: (p: any) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path
          d="m14 4 6 6-9 9H5v-6l9-9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M10 8l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const mentors: Mentor[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `m-${i + 1}`,
  name: "רועי כהן",
  title: "חשמלאי מוסמך",
  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  rating: 5,
}));

export default function Feed() {
  return (
    <main dir="rtl" className="sl">
      <Head>
        <title>SkillLink | Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="top">
        <div className="topIn">
          <div className="brand">SkillLink</div>

          <div className="search">
            <input className="searchIn" placeholder="חפש מנטור, מקצוע או מיומנות..." />
            <span className="searchIc" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            </span>
          </div>

          <div className="user">
            <img
              className="ava"
              alt="avatar"
              src="https://images.unsplash.com/photo-1520975958225-b4b1f0a4b0c6?auto=format&fit=crop&w=200&q=80"
            />
            <div className="uname">
              David <span className="crown">👑</span>
            </div>
            <button className="iconBtn" aria-label="notifications">
              🔔
            </button>
          </div>
        </div>
      </header>

      <div className="shell">
        <section className="main">
          <section className="hero">
            <div className="heroBg" />
            <h1 className="heroT">ברוכים הבאים, דוד!</h1>
          </section>

          <section className="cats">
            {categories.map((c) => (
              <div className="cat" key={c.key}>
                <div className="catIcon">
                  <c.Icon className="catSvg" />
                </div>
                <div className="catT">{c.key}</div>
                <div className="catS">{c.countText}</div>
              </div>
            ))}
          </section>

          <div className="secHead">
            <h2 className="secT">מנטורים מומלצים</h2>
          </div>

          <section className="grid">
            {mentors.map((m) => (
              <article className="mCard" key={m.id}>
                <div className="mImg">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="mBody">
                  <div className="mName">{m.name}</div>
                  <div className="mTitle">{m.title}</div>
                  <div className="mStars">★★★★★</div>
                  <button className="pill">צפה בפרופיל</button>
                </div>
              </article>
            ))}
          </section>
        </section>

        <aside className="side">
          <div className="sideTopBtn">
            <span>דוד</span>
            <span className="folder" aria-hidden>
              📁
            </span>
          </div>

          <div className="sideCard">
            <div className="sideTitle">לבושים:</div>

            <div className="notiList">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="noti" key={i}>
                  <img
                    className="miniAva"
                    alt="a"
                    src="https://images.unsplash.com/photo-1520975958225-b4b1f0a4b0c6?auto=format&fit=crop&w=120&q=80"
                  />
                  <div className="notiTxt">
                    <div className="notiLine strong">David התחיל לעקוב אחרי חשמל</div>
                    <div className="notiLine thin">לפני 15 דקות</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sideCard">
            <div className="sideTitle">העוזרים</div>

            <div className="helpers">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="helper" key={i}>
                  <div className="hLeft">
                    <img
                      className="miniAva"
                      alt="a"
                      src="https://images.unsplash.com/photo-1520975958225-b4b1f0a4b0c6?auto=format&fit=crop&w=120&q=80"
                    />
                    <div className="hName">David</div>
                  </div>
                  <div className="gold">
                    <span className="goldNum">{i % 2 === 0 ? "1" : ""}</span>
                    <span className="goldIc" aria-hidden>
                      {i % 2 === 0 ? "👤" : "👥"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <div className="footIn">
          <div className="footCol">
            <div className="footT">תמיכה</div>
            <a href="#" className="footA">
              יצירת קשר
            </a>
            <a href="#" className="footA">
              שאלות נפוצות
            </a>
            <a href="#" className="footA">
              דיווח
            </a>
          </div>

          <div className="footCol">
            <div className="footT">ראות סטטוס</div>
            <a href="#" className="footA">
              זמינות מלאה
            </a>
            <a href="#" className="footA">
              אינסטלציה
            </a>
            <a href="#" className="footA">
              מסירות
            </a>
          </div>

          <div className="footCol">
            <div className="footT">רשתות</div>
            <div className="social">
              <span className="soc">f</span>
              <span className="soc">x</span>
              <span className="soc">in</span>
              <span className="soc">ig</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .sl {
          min-height: 100vh;
          background: #f4f2ec;
          color: #0b0f1a;
          font-family: "Heebo", "Inter", system-ui, -apple-system, Segoe UI, sans-serif;
        }

        .top {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.12);
        }

        .topIn {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 16px;
          display: grid;
          grid-template-columns: 220px 1fr 260px;
          align-items: center;
          gap: 14px;
        }

        .brand {
          font-weight: 900;
          font-size: 28px;
          letter-spacing: -0.7px;
        }

        .search {
          position: relative;
          background: #fff;
          border: 3px solid #0b0f1a;
          border-radius: 12px;
          padding: 12px 44px 12px 14px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
        }

        .searchIn {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: 700;
          font-size: 14px;
          color: #0b0f1a;
        }

        .searchIc {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #0b0f1a;
          opacity: 0.9;
          display: grid;
          place-items: center;
        }

        .user {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
        }

        .ava {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid rgba(15, 23, 42, 0.1);
        }

        .uname {
          font-weight: 800;
          font-size: 15px;
          white-space: nowrap;
        }

        .crown {
          margin-right: 4px;
        }

        .iconBtn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: #f3f4f6;
          border: 1px solid rgba(15, 23, 42, 0.12);
          display: grid;
          place-items: center;
          font-size: 18px;
        }

        .shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 16px 28px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 18px;
          align-items: start;
        }

        .hero {
          position: relative;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          padding: 34px 18px;
        }

        .heroBg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), transparent 45%),
            radial-gradient(circle at 68% 30%, rgba(0, 0, 0, 0.06) 0 1px, transparent 1px 100%),
            radial-gradient(circle at 30% 70%, rgba(0, 0, 0, 0.06) 0 1px, transparent 1px 100%);
          background-size: auto, 26px 26px, 22px 22px;
          opacity: 0.9;
        }

        .heroT {
          position: relative;
          margin: 0;
          text-align: center;
          font-size: 44px;
          font-weight: 950;
          letter-spacing: -0.8px;
        }

        .cats {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .cat {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
          padding: 14px;
          text-align: center;
        }

        .catIcon {
          width: 64px;
          height: 52px;
          border-radius: 14px;
          background: #f3f4f6;
          border: 1px solid rgba(15, 23, 42, 0.12);
          margin: 0 auto;
          display: grid;
          place-items: center;
        }

        .catSvg {
          width: 28px;
          height: 28px;
          color: #0b0f1a;
        }

        .catT {
          margin-top: 10px;
          font-weight: 950;
          font-size: 16px;
        }

        .catS {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.7);
        }

        .secHead {
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .secT {
          margin: 0;
          font-size: 20px;
          font-weight: 950;
        }

        .grid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .mCard {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1);
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
          padding: 12px 12px 14px;
          text-align: center;
        }

        .mName {
          font-weight: 950;
          font-size: 15px;
        }

        .mTitle {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.68);
        }

        .mStars {
          margin-top: 8px;
          color: #f5c542;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .pill {
          margin-top: 10px;
          border-radius: 999px;
          padding: 9px 16px;
          background: #0b0f1a;
          color: #fff;
          font-weight: 900;
          border: 0;
        }

        .sideTopBtn {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 14px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
        }

        .folder {
          opacity: 0.9;
        }

        .side {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sideCard {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
          padding: 14px;
        }

        .sideTitle {
          font-weight: 950;
          margin-bottom: 10px;
        }

        .notiList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .noti {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .miniAva {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(15, 23, 42, 0.1);
        }

        .notiTxt {
          flex: 1;
        }

        .notiLine.strong {
          font-weight: 800;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.92);
        }

        .notiLine.thin {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.55);
        }

        .helpers {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .helper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .hLeft {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hName {
          font-weight: 800;
        }

        .gold {
          min-width: 58px;
          height: 28px;
          border-radius: 10px;
          background: #f3e2a8;
          border: 1px solid rgba(15, 23, 42, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
        }

        .goldNum {
          opacity: 0.85;
        }

        .footer {
          background: #fff;
          border-top: 1px solid rgba(15, 23, 42, 0.12);
        }

        .footIn {
          max-width: 1200px;
          margin: 0 auto;
          padding: 22px 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          color: rgba(15, 23, 42, 0.72);
        }

        .footT {
          font-weight: 950;
          color: #0b0f1a;
          margin-bottom: 10px;
        }

        .footA {
          display: block;
          margin: 6px 0;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.72);
          text-decoration: none;
        }

        .footA:hover {
          text-decoration: underline;
        }

        .social {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .soc {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(15, 23, 42, 0.1);
          display: grid;
          place-items: center;
          font-weight: 950;
          color: rgba(15, 23, 42, 0.78);
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
            font-size: 30px;
          }
        }
      `}</style>
    </main>
  );
}
