export default function UndoToast({ data, onUndo }) {
  if (!data) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        animation: "slideUpToast 0.3s cubic-bezier(0.34,1.4,0.64,1)",
      }}
    >
      <div
        style={{
          background: "#111118",
          border: "1px solid #2a2a3e",
          borderRadius: 14,
          padding: "12px 14px 12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          maxWidth: 360,
        }}
      >
        <span style={{ fontSize: 13, color: "#94a3b8", flex: 1 }}>
          🗑️ "<strong style={{ color: "#e2e8f0" }}>{data.title}</strong>" deleted
        </span>

        <button
          onClick={onUndo}
          style={{
            background: "#1d4ed8",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1d4ed8")}
        >
          ↩ Undo
        </button>
      </div>
    </div>
  );
}