import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

type AvRow = {
  id: number;
  mentor_id: string;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  notes: string | null;
};

type ProfileRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  city?: string | null;
};

type MentorTerms = {
  mentor_id: string;
  years_in_trade: number | null;
  day_rate: number | null;
  hourly_rate: number | null;
  working_hours: string | null; // ✅ תיקון: היה חסר בטיפוס
  work_includes: string | null;
  work_description: string | null;
  teaching_commitment: boolean | null;
  patience_commitment: boolean | null;
  teaching_included: boolean | null;
};

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(month: number, year: number) {
  return new Date(year, month, 1);
}
function endOfMonth(month: number, year: number) {
  return new Date(year, month + 1, 0);
}

export default function CalendarPage() {
  const router = useRouter();
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(true);
  const [countsByDate, setCountsByDate] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(today));

  const [dayLoading, setDayLoading] = useState(false);
  const [dayRows, setDayRows] = useState<
    { av: AvRow; profile?: ProfileRow; terms?: MentorTerms }[]
  >([]);

  const months = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר",
  ];
  const daysOfWeek = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

  const daysInMonth = useMemo(
    () => endOfMonth(currentMonth, currentYear).getDate(),
    [currentMonth, currentYear]
  );
  const firstDay = useMemo(
    () => startOfMonth(currentMonth, currentYear).getDay(),
    [currentMonth, currentYear]
  );

  const loadMonthCounts = async () => {
    setLoading(true);

    const start = isoDate(startOfMonth(currentMonth, currentYear));
    const end = isoDate(endOfMonth(currentMonth, currentYear));

    const { data: av, error } = await supabase
      .from("mentor_availability")
      .select("date, mentor_id")
      .gte("date", start)
      .lte("date", end);

    if (error) {
      setCountsByDate({});
      setLoading(false);
      return;
    }

    const map: Record<string, Set<string>> = {};
    (av as any[]).forEach((r) => {
      if (!map[r.date]) map[r.date] = new Set();
      map[r.date].add(r.mentor_id);
    });

    const counts: Record<string, number> = {};
    Object.keys(map).forEach((d) => (counts[d] = map[d].size));

    setCountsByDate(counts);
    setLoading(false);
  };

  const loadDay = async (date: string) => {
    setDayLoading(true);

    const { data: av, error } = await supabase
      .from("mentor_availability")
      .select("id, mentor_id, date, start_time, end_time, notes")
      .eq("date", date)
      .order("start_time", { ascending: true });

    if (error || !av) {
      setDayRows([]);
      setDayLoading(false);
      return;
    }

    const mentorIds = Array.from(new Set((av as AvRow[]).map((x) => x.mentor_id)));

    const [{ data: profs }, { data: terms }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, profession, city")
        .in("id", mentorIds),
      supabase
        .from("mentor_terms")
        // ✅ תיקון: להוסיף working_hours גם ב-select
        .select(
          "mentor_id, years_in_trade, day_rate, hourly_rate, working_hours, work_includes, work_description, teaching_commitment, patience_commitment, teaching_included"
        )
        .in("mentor_id", mentorIds),
    ]);

    const profMap = new Map<string, ProfileRow>();
    ((profs as any[]) || []).forEach((p) => profMap.set(p.id, p));

    const termsMap = new Map<string, MentorTerms>();
    ((terms as any[]) || []).forEach((t) => termsMap.set(t.mentor_id, t));

    const combined = (av as AvRow[]).map((row) => ({
      av: row,
      profile: profMap.get(row.mentor_id),
      terms: termsMap.get(row.mentor_id),
    }));

    setDayRows(combined);
    setDayLoading(false);
  };

  useEffect(() => {
    loadMonthCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  useEffect(() => {
    loadDay(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  return (
    <main dir="rtl" style={{ minHeight: "100vh", background: "#f4f6f8", padding: 18 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 14,
          alignItems: "start",
        }}
      >
        <section
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,.10)",
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ fontWeight: 950, fontSize: 16 }}>לוח זמינות</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={prevMonth}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,.12)",
                  padding: "10px 12px",
                  background: "#fff",
                  fontWeight: 900,
                }}
              >
                ‹
              </button>
              <button
                onClick={nextMonth}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,.12)",
                  padding: "10px 12px",
                  background: "#fff",
                  fontWeight: 900,
                }}
              >
                ›
              </button>
              <button
                onClick={() => router.push("/feed")}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,.12)",
                  padding: "10px 12px",
                  background: "#fff",
                  fontWeight: 900,
                }}
              >
                Feed
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, fontWeight: 900, color: "rgba(0,0,0,.7)" }}>
            {months[currentMonth]} {currentYear}
            {loading ? (
              <span style={{ marginRight: 8, fontWeight: 800, color: "rgba(0,0,0,.5)" }}>· טוען...</span>
            ) : null}
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {daysOfWeek.map((d) => (
              <div
                key={d}
                style={{ fontWeight: 900, color: "rgba(0,0,0,.55)", textAlign: "center" }}
              >
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = isoDate(new Date(currentYear, currentMonth, day));
              const count = countsByDate[date] || 0;
              const isSel = selectedDate === date;
              const isToday = date === isoDate(new Date());

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    textAlign: "right",
                    borderRadius: 14,
                    border: isSel ? "1px solid rgba(24,119,242,.45)" : "1px solid rgba(0,0,0,.10)",
                    background: isSel ? "rgba(24,119,242,.08)" : "#fff",
                    padding: 10,
                    minHeight: 70,
                    cursor: "pointer",
                    boxShadow: "0 12px 30px rgba(0,0,0,.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontWeight: 950 }}>{day}</div>
                    {isToday ? (
                      <div style={{ fontSize: 12, fontWeight: 950, color: "#1877f2" }}>היום</div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 900,
                      color: count ? "#0b1220" : "rgba(0,0,0,.45)",
                    }}
                  >
                    {count ? `${count} זמינים` : "אין זמינות"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,.10)",
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div style={{ fontWeight: 950, fontSize: 16 }}>זמינים בתאריך</div>
          <div style={{ marginTop: 6, fontWeight: 900, color: "rgba(0,0,0,.65)" }}>{selectedDate}</div>

          {dayLoading ? (
            <div style={{ marginTop: 12, fontWeight: 800 }}>טוען...</div>
          ) : dayRows.length === 0 ? (
            <div style={{ marginTop: 12, fontWeight: 850, color: "rgba(0,0,0,.65)" }}>
              אין בעלי מקצוע זמינים ביום הזה.
            </div>
          ) : (
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {dayRows.map(({ av, profile, terms }) => (
                <div
                  key={av.id}
                  style={{
                    border: "1px solid rgba(0,0,0,.10)",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <img
                        src={
                          (profile?.avatar_url || "").trim() ||
                          "https://ui-avatars.com/api/?name=Mentor&background=111827&color=fff&bold=true&size=128"
                        }
                        alt="avatar"
                        style={{ width: 36, height: 36, borderRadius: 999, objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 950 }}>{profile?.full_name || av.mentor_id}</div>
                        <div
