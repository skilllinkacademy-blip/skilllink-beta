import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  profession: string | null;
  city: string | null;
  bio: string | null;
  role: string | null;
  hourly_rate?: number | null;
};

export default function Search() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "mentor" | "student">("all");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.push("/signup?mode=login");
    };
    checkAuth();
  }, [router]);

  const search = async () => {
    const qText = query.trim();
    if (!qText) {
      setResults([]);
      return;
    }

    setLoading(true);

    let q = supabase.from("profiles").select("*");

    if (filter === "mentor") q = q.eq("role", "mentor");
    if (filter === "student") q = q.eq("role", "student");

    q = q.or(
      `full_name.ilike.%${qText}%,profession.ilike.%${qText}%,bio.ilike.%${qText}%,city.ilike.%${qText}%`
    );

    const { data, error } = await q.limit(30);
    if (!error) setResults((data as ProfileRow[]) || []);
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        direction: "rtl",
        fontFamily: "system-ui,sans-serif",
        paddingBottom: 110,
      }}
    >
      <nav
        style={{
          padding: 20,
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: 16 }}>
          חיפוש
        </h1>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            value={query}
            placeholder="חפש לפי שם, מקצוע, עיר..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={search}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            חפש
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { v: "all", l: "הכל" },
            { v: "mentor", l: "מנטורים" },
            { v: "student", l: "תלמידים" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v as any)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: filter === (f.v as any) ? "#000" : "#ddd",
                background: filter === (f.v as any) ? "#000" : "#fff",
                color: filter === (f.v as any) ? "#fff" : "#666",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "0.9rem",
              }}
            >
              {f.l}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ padding: 20 }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: "#666", fontWeight: 800 }}>
            מחפש...
          </div>
        )}

        {!loading && results.length === 0 && query.trim() && (
          <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
            <p>לא נמצאו תוצאות.</p>
          </div>
        )}

        {!loading && results.length === 0 && !query.trim() && (
          <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎓</div>
            <p>הקלד חיפוש ולחץ Enter.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/profile?id=${p.id}`)}
              style={{
                background: "#f9f9f9",
                borderRadius: 12,
                padding: 20,
                cursor: "pointer",
                border: "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <img
                  src={
                    p.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      p.full_name || "U"
                    )}&background=000&color=fff&size=60`
                  }
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  alt="avatar"
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontWeight: 900, fontSize: "1.1rem", margin: 0 }}>
                      {p.full_name || "ללא שם"}
                    </h3>

                    <span
                      style={{
                        background: p.role === "mentor" ? "#000" : "#e0e0e0",
                        color: p.role === "mentor" ? "#fff" : "#333",
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: "0.8rem",
                        fontWeight: 800,
                      }}
                    >
                      {p.role === "mentor" ? "מנטור" : "תלמיד"}
                    </span>
                  </div>

                  {p.profession && (
                    <p style={{ color: "#555", margin: "4px 0", fontSize: "0.95rem" }}>
                      🔧 {p.profession}
                    </p>
                  )}
                  {p.city && (
                    <p style={{ color: "#888", margin: "4px 0", fontSize: "0.9rem" }}>
                      📍 {p.city}
                    </p>
                  )}
                  {p.bio && (
                    <p style={{ color: "#666", margin: "8px 0 0", fontSize: "0.9rem", lineHeight: 1.5 }}>
                      {p.bio.slice(0, 120)}
                      {p.bio.length > 120 ? "..." : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
