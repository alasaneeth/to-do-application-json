const TYPE_TABS = [
  { v: "all",     l: "All" },
  { v: "daily",   l: "📅 Daily" },
  { v: "weekly",  l: "📆 Weekly" },
  { v: "monthly", l: "🗓️ Monthly" },
];

const STATUS_TABS = [
  { v: "all",        l: "All Status" },
  { v: "pending",    l: "⏳ Pending" },
  { v: "inprogress", l: "⚡ In Progress" },
  { v: "done",       l: "✅ Done" },
];

const pillBase = {
  fontSize: 12, padding: "6px 14px", borderRadius: 100,
  border: "1px solid #2a2a3e", background: "transparent",
  color: "#4b5563", cursor: "pointer", whiteSpace: "nowrap",
  transition: "all 0.15s", fontFamily: "inherit", fontWeight: 500,
};

const pillActive = {
  ...pillBase,
  background: "#1a1a2e",
  border: "1px solid #3a3a5e",
  color: "#e2e8f0",
};

const rowStyle = {
  display: "flex", gap: 6, overflowX: "auto",
  paddingBottom: 4, scrollbarWidth: "none",
};

export default function FilterTabs({
  filterType, setFilterType,
  filterStatus, setFilterStatus,
}) {
  return (
    <>
      {/* Type Filter */}
      <div style={{ ...rowStyle, marginBottom: 8 }}>
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.v}
            onClick={() => setFilterType(tab.v)}
            style={filterType === tab.v ? pillActive : pillBase}
          >
            {tab.l}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div style={{ ...rowStyle, marginBottom: 24 }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.v}
            onClick={() => setFilterStatus(tab.v)}
            style={filterStatus === tab.v ? pillActive : pillBase}
          >
            {tab.l}
          </button>
        ))}
      </div>
    </>
  );
}