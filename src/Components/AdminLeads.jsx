import { useEffect, useMemo, useState } from "react";

const scoreBadgeStyle = (score) => {
  const s = String(score || "").toLowerCase();
  if (s === "hot") return { background: "#ff4d4f", color: "#fff" };
  if (s === "warm") return { background: "#faad14", color: "#111" };
  if (s === "cold") return { background: "#52c41a", color: "#fff" };
  return { background: "#d9d9d9", color: "#111" };
};

function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/leads");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch leads");
        setLeads(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [leads]);

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>Admin - Submitted Leads</h2>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#ff4d4f" }}>Error: {error}</div>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 12 }}>
          {sorted.map((lead) => (
            <div
              key={lead._id}
              style={{
                border: "1px solid #e7eaee",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>
                  {lead.firstName} {lead.lastName}
                </div>
                <div style={{ opacity: 0.85 }}>{lead.businessName}</div>
                <div style={{ marginLeft: "auto" }}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                      ...scoreBadgeStyle(lead.aiScore),
                    }}
                  >
                    {lead.aiScore || "—"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 8, opacity: 0.9 }}>Email: {lead.email}</div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>AI reason</div>
                <div style={{ opacity: 0.85 }}>{lead.aiScoreReason || "—"}</div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Generated first response</div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#f6f7f9",
                    borderRadius: 10,
                    padding: 12,
                    border: "1px solid #e7eaee",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    fontSize: 13,
                    lineHeight: 1.35,
                  }}
                >
                  {lead.aiEmailDraft || "—"}
                </pre>
              </div>
            </div>
          ))}

          {sorted.length === 0 && <div>No leads yet.</div>}
        </div>
      )}
    </div>
  );
}

export default AdminLeads;

