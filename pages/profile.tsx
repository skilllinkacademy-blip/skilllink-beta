import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

type ProfileRow = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  profession?: string | null;
  bio?: string | null;
};

type MentorTerms = {
  mentor_id: string;
  years_in_trade: number | null;
  day_rate: number | null;
  hourly_rate: number | null;
  working_hours: string;
  work_includes: string;
  work_description: string;
  teaching_included: boolean;
  teaching_commitment: boolean;
  patience_commitment: boolean;
};

type AvailabilityRow = {
  id: number;
  mentor_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  notes: string | null;
};

function safeName(x?: string | null) {
  const s = (x || "").trim();
  return s || "משתמש";
}

export default function Profile() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<ProfileRow>({
    id: "",
    full_name: "",
    phone: "",
    city: "",
    avatar_url: "",
    role: "mentee",
    profession: "",
    bio: "",
  });

  const [terms, setTerms] = useState<MentorTerms>({
    mentor_id: "",
    years_in_trade: null,
    day_rate: null,
    hourly_rate: null,
    working_hours: "",
    work_includes: "",
    work_description: "",
    teaching_included: true,
    teaching_commitment: false,
    patience_commitment: false,
  });

  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [slot, setSlot] = useState({
    date: "",
    start_time: "09:00",
    end_time: "14:00",
    notes: "",
  });

  const isMentor = useMemo(() => profile.role === "mentor", [profile.role]);

  const loadAll = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/signup?mode=login");
      return;
    }

    setUserId(data.user.id);

    const { data: prof } = await supabase
      .from("profiles")
      .select("id, full_name, phone, city, avatar_url, role, profession, bio")
      .eq("id", data.user.id)
      .single();

    if (prof) setProfile(prof as ProfileRow);

    const { data: t } = await supabase
      .from("mentor_terms")
      .select("*")
      .eq("mentor_id", data.user.id)
      .single();

    if (t) setTerms((prev) => ({ ...prev, ...(t as any), mentor_id: data.user.id }));
    else setTerms((prev) => ({ ...prev, mentor_id: data.user.id }));

    const { data: av } = await supabase
      .from("mentor_availability")
      .select("id, mentor_id, date, start_time, end_time, notes")
      .eq("mentor_id", data.user.id)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    setAvailability((av as AvailabilityRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: profile.full_name || "User",
        phone: profile.phone || "",
        city: profile.city || "",
        avatar_url: profile.avatar_url || "",
        role: profile.role || "mentee",
        profession: profile.profession || "",
        bio: profile.bio || "",
        updated_at: new Date().toISOString(),
      } as any);

    setSaving(false);
    if (!error) await loadAll();
  };

  const saveTerms = async () => {
    if (!userId) return;
    setSaving(true);

    const payload = {
      mentor_id: userId,
      years_in_trade: terms.years_in_trade,
      day_rate: terms.day_rate,
      hourly_rate: terms.hourly_rate,
      working_hours: terms.working_hours,
      work_includes: terms.work_includes,
      work_description: terms.work_description,
      teaching_included: terms.teaching_included,
      teaching_commitment: terms.teaching_commitment,
      patience_commitment: terms.patience_commitment,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("mentor_terms").upsert(payload as any);
    setSaving(false);
    if (!error) await loadAll();
  };

  const addSlot = async () => {
    if (!userId) return;
    if (!slot.date) return;

    await supabase.from("mentor_availability").insert({
      mentor_id: userId,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      notes: slot.notes || null,
    } as any);

    setSlot((s) => ({ ...s, notes: "" }));
    await loadAll();
  };

  const removeSlot = async (id: number) => {
    if (!userId) return;
    await supabase.from("mentor_availability").delete().eq("id", id);
    await loadAll();
  };

  if (loading) return <div style={{ padding: 20, direction: "rtl" }}>טוען...</div>;

  return (
    <main dir="rtl" style={{ minHeight: "100vh", background: "#f4f6f8", padding: 18 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>פרופיל</h1>
          <button
            onClick={() => router.push("/feed")}
            style={{ borderRadius: 12, border: "1px solid rgba(0,0,0,.12)", padding: "10px 14px", background: "#fff", fontWeight: 800 }}
          >
            חזרה
          </button>
        </div>

        <section style={{ marginTop: 12, background: "#fff", border: "1px solid rgba(0,0,0,.10)", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>פרטים בסיסיים</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>שם מלא</div>
              <input
                value={profile.full_name || ""}
                onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>עיר</div>
              <input
                value={profile.city || ""}
                onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>טלפון</div>
              <input
                value={profile.phone || ""}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>תמונה (URL)</div>
              <input
                value={profile.avatar_url || ""}
                onChange={(e) => setProfile((p) => ({ ...p, avatar_url: e.target.value }))}
                placeholder="https://..."
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>תפקיד</div>
              <select
                value={profile.role || "mentee"}
                onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)", background: "#fff" }}
              >
                <option value="mentee">תלמיד/חניך</option>
                <option value="mentor">בעל מקצוע / מנטור</option>
              </select>
            </label>

            <label>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>מקצוע</div>
              <input
                value={profile.profession || ""}
                onChange={(e) => setProfile((p) => ({ ...p, profession: e.target.value }))}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 10 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>אודות</div>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
            />
          </label>

          <button
            onClick={saveProfile}
            disabled={saving}
            style={{ marginTop: 12, width: "100%", height: 44, borderRadius: 12, border: 0, background: "#0b1220", color: "#fff", fontWeight: 950 }}
          >
            {saving ? "שומר..." : "שמור פרופיל"}
          </button>
        </section>

        {isMentor && (
          <>
            <section style={{ marginTop: 12, background: "#fff", border: "1px solid rgba(0,0,0,.10)", borderRadius: 16, padding: 14 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>תנאים לעבודה + התחייבות ללמד</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>שנות ניסיון (מספר)</div>
                  <input
                    type="number"
                    value={terms.years_in_trade ?? ""}
                    onChange={(e) => setTerms((t) => ({ ...t, years_in_trade: e.target.value ? Number(e.target.value) : null }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>שכר ליום (₪)</div>
                  <input
                    type="number"
                    value={terms.day_rate ?? ""}
                    onChange={(e) => setTerms((t) => ({ ...t, day_rate: e.target.value ? Number(e.target.value) : null }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>שכר לשעה (₪)</div>
                  <input
                    type="number"
                    value={terms.hourly_rate ?? ""}
                    onChange={(e) => setTerms((t) => ({ ...t, hourly_rate: e.target.value ? Number(e.target.value) : null }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>שעות עבודה (טקסט)</div>
                  <input
                    value={terms.working_hours}
                    onChange={(e) => setTerms((t) => ({ ...t, working_hours: e.target.value }))}
                    placeholder="לדוגמה: 08:00–16:00"
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>
              </div>

              <label style={{ display: "block", marginTop: 10 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>מה כוללת העבודה?</div>
                <textarea
                  value={terms.work_includes}
                  onChange={(e) => setTerms((t) => ({ ...t, work_includes: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                />
              </label>

              <label style={{ display: "block", marginTop: 10 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>תיאור לתלמיד (מה ילמד, איך נראה יום)</div>
                <textarea
                  value={terms.work_description}
                  onChange={(e) => setTerms((t) => ({ ...t, work_description: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                />
              </label>

              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 850 }}>
                  <input
                    type="checkbox"
                    checked={terms.teaching_included}
                    onChange={(e) => setTerms((t) => ({ ...t, teaching_included: e.target.checked }))}
                  />
                  הלימוד כלול ביום עבודה
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 850 }}>
                  <input
                    type="checkbox"
                    checked={terms.teaching_commitment}
                    onChange={(e) => setTerms((t) => ({ ...t, teaching_commitment: e.target.checked }))}
                  />
                  אני מאשר/ת שאני מגיע/ה במטרה ללמד ולהסביר לאורך היום
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 850 }}>
                  <input
                    type="checkbox"
                    checked={terms.patience_commitment}
                    onChange={(e) => setTerms((t) => ({ ...t, patience_commitment: e.target.checked }))}
                  />
                  אני מבין/ה שהתלמיד מתחיל/ה ומתחייב/ת לסבלנות ועזרה
                </label>
              </div>

              <button
                onClick={saveTerms}
                disabled={saving}
                style={{ marginTop: 12, width: "100%", height: 44, borderRadius: 12, border: 0, background: "#1877f2", color: "#fff", fontWeight: 950 }}
              >
                {saving ? "שומר..." : "שמור תנאים"}
              </button>
            </section>

            <section style={{ marginTop: 12, background: "#fff", border: "1px solid rgba(0,0,0,.10)", borderRadius: 16, padding: 14 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>זמינות (כדי שיופיע בלוח שנה)</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>תאריך</div>
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => setSlot((s) => ({ ...s, date: e.target.value }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>התחלה</div>
                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => setSlot((s) => ({ ...s, start_time: e.target.value }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>סיום</div>
                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => setSlot((s) => ({ ...s, end_time: e.target.value }))}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                  />
                </label>
              </div>

              <label style={{ display: "block", marginTop: 10 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>הערות (אופציונלי)</div>
                <input
                  value={slot.notes}
                  onChange={(e) => setSlot((s) => ({ ...s, notes: e.target.value }))}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.14)" }}
                />
              </label>

              <button
                onClick={addSlot}
                style={{ marginTop: 12, width: "100%", height: 44, borderRadius: 12, border: 0, background: "#0b1220", color: "#fff", fontWeight: 950 }}
              >
                הוסף זמינות
              </button>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {availability.length === 0 ? (
                  <div style={{ color: "rgba(0,0,0,.65)", fontWeight: 800 }}>אין זמינות עדיין</div>
                ) : (
                  availability.map((a) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, border: "1px solid rgba(0,0,0,.10)", borderRadius: 12, padding: 12 }}>
                      <div style={{ fontWeight: 900 }}>
                        {a.date} · {a.start_time.slice(0,5)}–{a.end_time.slice(0,5)}
                        {a.notes ? <span style={{ fontWeight: 800, color: "rgba(0,0,0,.6)" }}> · {a.notes}</span> : null}
                      </div>
                      <button onClick={() => removeSlot(a.id)} style={{ borderRadius: 10, border: "1px solid rgba(0,0,0,.12)", padding: "8px 10px", background: "#fff", fontWeight: 900 }}>
                        מחק
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
