import { useState, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";


const MOTIVATIONS = [
  { title: "வாழ்க்கை உன்னால் மாறும்! 🎉", sub: "You are making a difference!" },
  { title: "நீ வெல்வாய்! 🏆", sub: "Champion mindset activated!" },
  { title: "Superb! Keep Going! 🚀", sub: "உன்னால் முடியும்!" },
  { title: "You're on Fire! 🔥", sub: "நீ அருமை!" },
  { title: "உன்னால் முடியும்! 🌟", sub: "Nothing can stop you!" },
  { title: "Boss Level Achieved! 👑", sub: "நீ ஒரு வீரன்!" },
  { title: "மிகவும் அருமை! ✨", sub: "Amazing work, keep it up!" },
  { title: "Task Crushed! 💪", sub: "Keep the momentum going!" },
  { title: "Productivity King! 🦁", sub: "உன் உழைப்பு வீண்போகாது!" },
  { title: "Outstanding! 🌈", sub: "You inspire everyone!" },
  { title: "உழைப்பே உயர்வு! ⚡", sub: "Hard work always pays off!" },
  { title: "நீ சாம்பியன்! 🎯", sub: "Goal smashed successfully!" },
];

const TYPE_META = {
  daily:   { emoji: "📅", label: "Daily",   bg: "#0d1f3c", color: "#60a5fa", border: "#1e3a5f" },
  weekly:  { emoji: "📆", label: "Weekly",  bg: "#1a0d3c", color: "#a78bfa", border: "#2e1a5f" },
  monthly: { emoji: "🗓️", label: "Monthly", bg: "#0d2e1f", color: "#34d399", border: "#1a4d32" },
};

const STATUS_META = {
  pending:    { icon: "⏳", label: "Pending",     color: "#f87171", bg: "#2d0f0f", border: "#5c1a1a" },
  inprogress: { icon: "⚡", label: "In Progress", color: "#fbbf24", bg: "#2d1f0a", border: "#5c3a10" },
  done:       { icon: "✅", label: "Done",        color: "#34d399", bg: "#0a2d1f", border: "#0f5c3a" },
};

/* ── Confetti ── */
function Confetti({ active }) {
  const ref = useRef(null);
  const anim = useRef(null);
  const parts = useRef([]);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const COLORS = ["#f7971e","#ffd200","#34d399","#f87171","#a78bfa","#60a5fa","#ec4899","#22d3ee"];
    parts.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width, y: -20,
      w: Math.random() * 12 + 4, h: Math.random() * 6 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: Math.random() * 5 + 2, vx: (Math.random() - 0.5) * 4,
      angle: Math.random() * 360, spin: (Math.random() - 0.5) * 8, life: 1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.current.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.angle += p.spin;
        if (p.y > canvas.height * 0.55) p.life -= 0.014;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y); ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      parts.current = parts.current.filter(p => p.life > 0 && p.y < canvas.height + 30);
      if (parts.current.length > 0) anim.current = requestAnimationFrame(draw);
    };
    anim.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(anim.current);
  }, [active]);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, display: active ? "block" : "none" }} />;
}

/* ── Motivation Popup ── */
function MotivationPopup({ data }) {
  if (!data) return null;
  return (
    <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:9998, pointerEvents:"none" }}>
      <div style={{
        background: "linear-gradient(135deg, #111118, #1a1a28)",
        border: "1px solid #fbbf24", borderRadius: 20,
        padding: "28px 44px", textAlign:"center",
        boxShadow: "0 0 60px rgba(251,191,36,0.25), 0 24px 60px rgba(0,0,0,0.6)",
        animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        maxWidth: 340,
      }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🎊</div>
        <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize: 22, color:"#fbbf24", marginBottom: 6, lineHeight:1.3 }}>{data.title}</h2>
        <p style={{ color:"#64748b", fontSize: 13 }}>{data.sub}</p>
      </div>
    </div>
  );
}

/* ── Task Card ── */
function TaskCard({ task, onStatus, onEdit, onDelete }) {
  const type = TYPE_META[task.type];
  const status = STATUS_META[task.status];
  const statusOrder = ["pending", "inprogress", "done"];
  const isDone = task.status === "done";

  return (
    <div style={{
      background: "#111118",
      border: `1px solid ${isDone ? "#1e1e2e" : "#1e1e2e"}`,
      borderRadius: 16,
      overflow: "hidden",
      transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
      animation: "cardIn 0.28s ease both",
      opacity: isDone ? 0.55 : 1,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#2a2a3e"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1e1e2e"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${status.color}, transparent)` }} />

      <div style={{ padding: "14px 16px" }}>
        {/* Row 1: badges + actions */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ display:"flex", gap: 6, flexWrap:"wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
              background: type.bg, color: type.color, border: `1px solid ${type.border}`,
              letterSpacing: "0.03em",
            }}>{type.emoji} {type.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
              background: status.bg, color: status.color, border: `1px solid ${status.border}`,
              letterSpacing: "0.03em",
            }}>{status.icon} {status.label}</span>
          </div>
          <div style={{ display:"flex", gap: 4, flexShrink: 0 }}>
            {[
              { icon:"✏️", title:"Edit", onClick: () => onEdit(task), danger: false },
              { icon:"🗑️", title:"Delete", onClick: () => onDelete(task.id), danger: true },
            ].map((btn, i) => (
              <button key={i} title={btn.title} onClick={btn.onClick}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: "1px solid #2a2a3e",
                  background: "transparent", cursor:"pointer", fontSize: 13,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: "#6b7280", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = btn.danger ? "#2d0f0f" : "#1a1a2e"; e.currentTarget.style.borderColor = btn.danger ? "#5c1a1a" : "#3a3a5e"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#2a2a3e"; }}
              >{btn.icon}</button>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 14, fontWeight: 600, lineHeight: 1.45, marginBottom: task.desc ? 5 : 12,
          color: isDone ? "#374151" : "#e2e8f0",
          textDecoration: isDone ? "line-through" : "none",
          fontFamily: "'DM Serif Display', serif",
        }}>{task.title}</h3>

        {/* Desc */}
        {task.desc && (
          <p style={{ fontSize: 12, color:"#4b5563", lineHeight:1.6, marginBottom: 12 }}>{task.desc}</p>
        )}

        {/* Status buttons */}
        <div style={{ display:"flex", gap: 6, flexWrap:"wrap" }}>
          {statusOrder.map(s => {
            const sm = STATUS_META[s];
            const isActive = task.status === s;
            return (
              <button key={s} onClick={() => onStatus(task.id, s)}
                style={{
                  fontSize: 11, padding: "4px 11px", borderRadius: 100,
                  border: `1px solid ${isActive ? sm.border : "#2a2a3e"}`,
                  background: isActive ? sm.bg : "transparent",
                  color: isActive ? sm.color : "#4b5563",
                  cursor:"pointer", transition: "all 0.15s", fontWeight: isActive ? 600 : 400,
                  display:"flex", alignItems:"center", gap: 4,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "#3a3a4e"; e.currentTarget.style.color = "#94a3b8"; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "#2a2a3e"; e.currentTarget.style.color = "#4b5563"; }}}
              >{sm.icon} {sm.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({ form, setForm, onSave, onClose, isEdit }) {
  const inputStyle = {
    width:"100%", background:"#0d0d14", border:"1px solid #2a2a3e",
    borderRadius: 10, padding:"10px 13px", fontSize: 13,
    color:"#e2e8f0", outline:"none", fontFamily:"inherit",
    boxSizing:"border-box", transition:"border-color 0.2s",
  };
  const labelStyle = { display:"block", fontSize: 11, fontWeight: 600, color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom: 6 };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding: 20 }}>
      <div style={{
        background:"#111118", border:"1px solid #2a2a3e", borderRadius: 20,
        padding:"24px", width:"100%", maxWidth: 420,
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
        animation:"modalIn 0.25s cubic-bezier(0.34,1.4,0.64,1)",
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color:"#e2e8f0", fontFamily:"'DM Serif Display', serif" }}>
            {isEdit ? "✏️ Edit Task" : "✨ New Task"}
          </h2>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid #2a2a3e", borderRadius: 8, width:30, height:30, color:"#4b5563", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <label style={labelStyle}>Task Title</label>
        <input style={{ ...inputStyle, marginBottom: 14 }}
          placeholder="என்ன செய்ய வேண்டும்?"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && onSave()}
          onFocus={e => e.target.style.borderColor = "#60a5fa"}
          onBlur={e => e.target.style.borderColor = "#2a2a3e"}
          autoFocus
        />

        <label style={labelStyle}>Description <span style={{ color:"#374151", textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
        <textarea style={{ ...inputStyle, resize:"none", marginBottom: 14 }}
          placeholder="கூடுதல் விவரங்கள்..."
          value={form.desc}
          onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
          onFocus={e => e.target.style.borderColor = "#60a5fa"}
          onBlur={e => e.target.style.borderColor = "#2a2a3e"}
          rows={3}
        />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12, marginBottom: 22 }}>
          {[
            { label:"Task Type", key:"type", opts:[["daily","📅 Daily"],["weekly","📆 Weekly"],["monthly","🗓️ Monthly"]] },
            { label:"Status", key:"status", opts:[["pending","⏳ Pending"],["inprogress","⚡ In Progress"],["done","✅ Done"]] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <select style={{ ...inputStyle, cursor:"pointer" }}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "#60a5fa"}
                onBlur={e => e.target.style.borderColor = "#2a2a3e"}
              >
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex:1, background:"transparent", border:"1px solid #2a2a3e", borderRadius: 10, padding:"10px", fontSize: 13, color:"#6b7280", cursor:"pointer", fontFamily:"inherit" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >Cancel</button>
          <button onClick={onSave}
            style={{ flex:2, background:"#1d4ed8", border:"none", borderRadius: 10, padding:"10px", fontSize: 13, fontWeight: 600, color:"#fff", cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.background = "#1d4ed8"}
          >{isEdit ? "Update Task ✨" : "Add Task 🚀"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main App ── */
/* ── Reset helpers ── */
function getTodayKey()  { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function getWeekKey()   { const d = new Date(); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; const monday = new Date(d); monday.setDate(d.getDate() + diff); return `${monday.getFullYear()}-${monday.getMonth()}-${monday.getDate()}`; }
function getMonthKey()  { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; }

function shouldReset(type) {
  const stored = localStorage.getItem(`taskflow_reset_${type}`);
  const current = type === "daily" ? getTodayKey() : type === "weekly" ? getWeekKey() : getMonthKey();
  return stored !== current;
}
function markReset(type) {
  const current = type === "daily" ? getTodayKey() : type === "weekly" ? getWeekKey() : getMonthKey();
  localStorage.setItem(`taskflow_reset_${type}`, current);
}

function applyAutoResets(tasks) {
  const types = ["daily", "weekly", "monthly"];
  const toReset = types.filter(shouldReset);
  if (toReset.length === 0) return tasks;
  toReset.forEach(markReset);
  return tasks.map(t =>
    toReset.includes(t.type) && t.status === "done"
      ? { ...t, status: "pending" }
      : t
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("taskflow_v2") || "[]");
      return applyAutoResets(saved);
    } catch { return []; }
  });
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [motivation, setMotivation] = useState(null);
  const [form, setForm] = useState({ title:"", desc:"", type:"daily", status:"pending" });

  useEffect(() => { localStorage.setItem("taskflow_v2", JSON.stringify(tasks)); }, [tasks]);

  /* Check resets whenever tab becomes visible again */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setTasks(prev => applyAutoResets([...prev]));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const celebrate = () => {
    const m = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    setMotivation(m); setConfetti(true);
    setTimeout(() => { setConfetti(false); setMotivation(null); }, 4000);
  };

  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setTasks((prev) => {
    const oldIndex = prev.findIndex((t) => t.id === active.id);
    const newIndex = prev.findIndex((t) => t.id === over.id);
    return arrayMove(prev, oldIndex, newIndex);
  });
};

  const openAdd = () => { setForm({ title:"", desc:"", type:"daily", status:"pending" }); setEditId(null); setShowModal(true); };
  const openEdit = task => { setForm({ title:task.title, desc:task.desc||"", type:task.type, status:task.status }); setEditId(task.id); setShowModal(true); };
  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editId) {
      const old = tasks.find(t => t.id === editId);
      setTasks(p => p.map(t => t.id === editId ? { ...t, ...form } : t));
      if (old?.status !== "done" && form.status === "done") celebrate();
    } else {
      setTasks(p => [{ id: Date.now(), ...form, createdAt: new Date().toISOString() }, ...p]);
      if (form.status === "done") celebrate();
    }
    setShowModal(false);
  };
  const updateStatus = (id, status) => {
    const old = tasks.find(t => t.id === id);
    setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
    if (old?.status !== "done" && status === "done") celebrate();
  };
  const deleteTask = id => setTasks(p => p.filter(t => t.id !== id));

  const filtered = tasks.filter(t =>
    (filterType === "all" || t.type === filterType) &&
    (filterStatus === "all" || t.status === filterStatus)
  );

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const inprogress = tasks.filter(t => t.status === "inprogress").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const typeTabs = [
    { v:"all", l:"All" },
    { v:"daily", l:"📅 Daily" },
    { v:"weekly", l:"📆 Weekly" },
    { v:"monthly", l:"🗓️ Monthly" },
  ];
  const statusTabs = [
    { v:"all", l:"All Status" },
    { v:"pending", l:"⏳ Pending" },
    { v:"inprogress", l:"⚡ In Progress" },
    { v:"done", l:"✅ Done" },
  ];

  const pillBase = { fontSize: 12, padding:"6px 14px", borderRadius: 100, border:"1px solid #2a2a3e", background:"transparent", color:"#4b5563", cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s", fontFamily:"inherit", fontWeight: 500 };
  const pillActive = { ...pillBase, background:"#1a1a2e", border:"1px solid #3a3a5e", color:"#e2e8f0" };

  const statCards = [
    { label:"Total",    value: total,      color:"#60a5fa", bg:"#0d1a2e", border:"#1a2e4a" },
    { label:"Pending",  value: pending,    color:"#f87171", bg:"#2d0f0f", border:"#4a1a1a" },
    { label:"Progress", value: inprogress, color:"#fbbf24", bg:"#2d1a0a", border:"#4a2e10" },
    { label:"Done",     value: done,       color:"#34d399", bg:"#0a2d1a", border:"#0f4a2e" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a10; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
        select option { background: #111118; color: #e2e8f0; }
        @keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:none; } }
        @keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes shimmer { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      <Confetti active={confetti} />
      <MotivationPopup data={motivation} />

      <div style={{ minHeight:"100vh", background:"#0a0a10", padding:"0 0 80px" }}>
        <div style={{ maxWidth: 600, margin:"0 auto", padding:"24px 20px" }}>

          {/* ── HEADER ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily:"'DM Serif Display', serif", fontSize: 26, color:"#f1f5f9", fontWeight:400, letterSpacing:"-0.01em" }}>
                ⚡ TaskFlow
              </h1>
              <p style={{ fontSize: 12, color:"#374151", marginTop: 2 }}>உன் கனவை நினைவாக்கு • Make it happen</p>
            </div>
            <button onClick={openAdd}
              style={{ background:"#1d4ed8", color:"#fff", border:"none", borderRadius: 12, padding:"9px 18px", fontSize: 13, fontWeight: 600, cursor:"pointer", display:"flex", alignItems:"center", gap: 6, fontFamily:"inherit", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#2563eb"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#1d4ed8"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <span style={{ fontSize:18, lineHeight:1 }}>+</span> New Task
            </button>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{
                background: s.bg, border:`1px solid ${s.border}`,
                borderRadius: 14, padding:"14px 12px", textAlign:"center",
                animation:`cardIn 0.3s ease ${i*0.06}s both`,
              }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight:1, marginBottom: 5, fontFamily:"'DM Serif Display', serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color:"#374151", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── PROGRESS BAR ── */}
          {total > 0 && (
            <div style={{ background:"#111118", border:"1px solid #1e1e2e", borderRadius: 14, padding:"14px 16px", marginBottom: 16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color:"#4b5563" }}>Overall Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color:"#fbbf24" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background:"#1e1e2e", borderRadius: 6, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg, #1d4ed8, #60a5fa)", borderRadius: 6, transition:"width 0.7s cubic-bezier(.4,0,.2,1)" }} />
              </div>
            </div>
          )}

          {/* ── TYPE FILTER ── */}
          <div style={{ display:"flex", gap: 6, overflowX:"auto", paddingBottom: 4, marginBottom: 8, scrollbarWidth:"none" }}>
            {typeTabs.map(tab => (
              <button key={tab.v} onClick={() => setFilterType(tab.v)}
                style={filterType === tab.v ? pillActive : pillBase}
              >{tab.l}</button>
            ))}
          </div>

          {/* ── STATUS FILTER ── */}
          <div style={{ display:"flex", gap: 6, overflowX:"auto", paddingBottom: 4, marginBottom: 24, scrollbarWidth:"none" }}>
            {statusTabs.map(tab => (
              <button key={tab.v} onClick={() => setFilterStatus(tab.v)}
                style={filterStatus === tab.v ? pillActive : pillBase}
              >{tab.l}</button>
            ))}
          </div>

          {/* ── TASK LIST ── */}
          <div style={{ display:"flex", flexDirection:"column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation:"shimmer 2s infinite" }}>📋</div>
                <p style={{ fontSize: 16, fontWeight: 600, color:"#374151", marginBottom: 6, fontFamily:"'DM Serif Display', serif" }}>No tasks found</p>
                <p style={{ fontSize: 13, color:"#1f2937" }}>
                  {total === 0 ? "Add your first task to get started! 🚀" : "No tasks match the selected filters."}
                </p>
                {total === 0 && (
                  <button onClick={openAdd}
                    style={{ marginTop: 20, background:"#1d4ed8", color:"#fff", border:"none", borderRadius: 12, padding:"10px 22px", fontSize: 13, fontWeight: 600, cursor:"pointer", fontFamily:"inherit" }}
                    onMouseEnter={e => e.currentTarget.style.background="#2563eb"}
                    onMouseLeave={e => e.currentTarget.style.background="#1d4ed8"}
                  >+ Add First Task</button>
                )}
              </div>
            ) : (
              filtered.map(task => (
                <TaskCard key={task.id} task={task} onStatus={updateStatus} onEdit={openEdit} onDelete={deleteTask} />
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <Modal form={form} setForm={setForm} onSave={saveTask} onClose={() => setShowModal(false)} isEdit={!!editId} />
      )}
    </>
  );
}
