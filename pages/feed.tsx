.sl{
  min-height:100vh;
  background:#f4f2ec;
  color:#0b0f1a;
}

/* top bar */
.top{
  position:sticky;top:0;z-index:50;
  background:rgba(255,255,255,.92);
  border-bottom:1px solid rgba(15,23,42,.10);
  backdrop-filter: blur(10px);
}
.topIn{
  max-width:1200px;margin:0 auto;
  padding:14px 16px;
  display:grid;gap:14px;
  grid-template-columns: 220px 1fr 260px;
  align-items:center;
}
.brand{
  font-weight:900;font-size:26px;letter-spacing:-.6px;
}
.user{display:flex;justify-content:flex-end;align-items:center;gap:10px}
.ava{width:38px;height:38px;border-radius:999px;object-fit:cover;border:2px solid rgba(15,23,42,.08)}
.uname{font-weight:800}
.bell{
  width:40px;height:40px;border-radius:999px;
  background:#f3f4f6;border:1px solid rgba(15,23,42,.10);
}

/* search – בדיוק כמו בהדמיה: מסגרת שחורה עבה, אייקון ימני */
.search{
  position:relative;
  background:#fff;
  border:3px solid #0b0f1a;
  border-radius:12px;
  padding:12px 42px 12px 14px;
  box-shadow: 0 12px 28px rgba(0,0,0,.06);
}
.searchIn{
  width:100%;
  border:0;outline:0;background:transparent;
  font-weight:700;font-size:14px;
}
.searchIc{
  position:absolute;
  right:12px;
  top:50%;transform:translateY(-50%);
  opacity:.75;font-weight:900;
}

/* layout */
.wrap{
  max-width:1200px;margin:0 auto;
  padding:18px 16px 28px;
  display:grid;gap:18px;
  grid-template-columns: 1fr 360px;
  align-items:start;
}

/* hero banner כמו בהדמיה */
.hero{
  border-radius:16px;
  background:#fff;
  border:1px solid rgba(15,23,42,.10);
  box-shadow: 0 16px 36px rgba(0,0,0,.08);
  overflow:hidden;
}
.heroIn{
  padding:36px 22px;
  background:
    linear-gradient(135deg, rgba(0,0,0,.05), transparent 40%),
    radial-gradient(circle at 70% 30%, rgba(0,0,0,.06) 0 1px, transparent 1px 100%),
    radial-gradient(circle at 30% 70%, rgba(0,0,0,.06) 0 1px, transparent 1px 100%);
  background-size:auto, 26px 26px, 22px 22px;
}
.heroLine{display:none}
.heroT{
  margin:0;
  font-size:44px;
  font-weight:950;
  text-align:center;
  letter-spacing:-.7px;
}
.heroS{
  margin:10px auto 0;
  max-width:720px;
  text-align:center;
  color:rgba(15,23,42,.70);
  font-weight:650;
}

/* categories */
.cats{
  margin-top:14px;
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap:14px;
}
.cat{
  background:#fff;
  border:1px solid rgba(15,23,42,.10);
  border-radius:16px;
  padding:14px;
  box-shadow: 0 14px 30px rgba(0,0,0,.08);
}
.catTop{display:flex;align-items:center;justify-content:space-between}
.icBox{
  width:58px;height:58px;border-radius:16px;
  background:#f3f4f6;
  border:1px solid rgba(15,23,42,.10);
  display:grid;place-items:center;
}
.ic{width:30px;height:30px;color:#111827}
.meta{font-size:12px;font-weight:800;color:rgba(15,23,42,.55)}
.catT{margin-top:10px;font-weight:950;font-size:16px}
.catS{margin-top:4px;font-size:12px;font-weight:650;color:rgba(15,23,42,.65)}

/* section title */
.head{
  margin-top:18px;
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
}
.h2{margin:0;font-size:20px;font-weight:950}
.hint{font-size:12px;color:rgba(15,23,42,.55);font-weight:750}

/* mentor grid/cards – עגול, תמונה גדולה, כפתור שחור קטן כמו בהדמיה */
.grid{
  margin-top:10px;
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap:16px;
}
.card{
  background:#fff;
  border:1px solid rgba(15,23,42,.10);
  border-radius:18px;
  overflow:hidden;
  box-shadow: 0 18px 40px rgba(0,0,0,.10);
  transform: translateZ(0);
}
.card:hover{
  box-shadow: 0 26px 70px rgba(0,0,0,.14);
}
.card.ph{opacity:1} /* חשוב: לבטל “אפור” */
.img{aspect-ratio: 4/3;background:#e5e7eb}
.img img{width:100%;height:100%;object-fit:cover;display:block}
.body{padding:12px 12px 14px;text-align:center}
.n{font-weight:950}
.p{margin-top:2px;font-size:12px;font-weight:700;color:rgba(15,23,42,.65)}
.stars{margin-top:8px;color:#f5c542;letter-spacing:1px}
.pill{
  margin-top:10px;
  border-radius:999px;
  padding:9px 14px;
  background:#0b0f1a;
  color:#fff;
  font-weight:900;
  width:max-content;
  display:inline-block;
}
.pill:disabled{opacity:1} /* גם בדמו לא ייראה “מושבת” */

/* sidebar cards */
.side{display:flex;flex-direction:column;gap:14px}
.sideCard{
  background:#fff;
  border:1px solid rgba(15,23,42,.10);
  border-radius:16px;
  padding:14px;
  box-shadow: 0 16px 36px rgba(0,0,0,.09);
}
.sideT{font-weight:950;margin-bottom:10px}
.skList{display:flex;flex-direction:column;gap:12px}
.skRow{display:flex;gap:10px;align-items:flex-start}
.skAva{width:36px;height:36px;border-radius:999px;background:#e5e7eb;border:1px solid rgba(15,23,42,.08)}
.skTxt{flex:1;padding-top:2px;display:flex;flex-direction:column;gap:8px}
.skL{height:10px;border-radius:999px;background:#e9eaee}
.w80{width:80%}.w55{width:55%}.w40{width:110px}
.gold{
  width:44px;height:26px;border-radius:10px;
  background:#f3e2a8;border:1px solid rgba(15,23,42,.08)
}

/* responsive */
@media(max-width:1100px){
  .wrap{grid-template-columns:1fr}
  .cats{grid-template-columns:repeat(2,1fr)}
  .grid{grid-template-columns:repeat(2,1fr)}
  .topIn{grid-template-columns: 1fr}
  .user{justify-content:flex-start}
}
@media(max-width:520px){
  .heroT{font-size:30px}
}
