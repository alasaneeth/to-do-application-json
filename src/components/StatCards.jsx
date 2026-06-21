export default function StatCards({ total, pending, inprogress, done }) {
  const cards = [
    { label: "Total",    value: total,      color: "#60a5fa", bg: "#0d1a2e", border: "#1a2e4a" },
    { label: "Pending",  value: pending,    color: "#f87171", bg: "#2d0f0f", border: "#4a1a1a" },
    { label: "Progress", value: inprogress, color: "#fbbf24", bg: "#2d1a0a", border: "#4a2e10" },
    { label: "Done",     value: done,       color: "#34d399", bg: "#0a2d1a", border: "#0f4a2e" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {cards.map((s, i) => (
        <div
          key={i}
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 14,
            padding: "14px 12px",
            textAlign: "center",
            animation: `cardIn 0.3s ease ${i * 0.06}s both`,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: s.color,
              lineHeight: 1,
              marginBottom: 5,
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}