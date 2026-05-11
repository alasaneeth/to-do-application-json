import { useState, useEffect } from 'react'

const STORAGE_KEY = 'practice_days_v2'

const DEFAULT_DAYS = [
  {
    id: 1,
    topic: 'Day 1 Practice',
    url: 'https://chatgpt.com/c/6a01c680-c318-8322-81ab-0b4fb5250e47',
    done: false,
    createdAt: new Date().toISOString(),
  },
]

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-mono font-bold shadow-2xl transition-all duration-300 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {message}
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex-1">
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}

function DayCard({ day, index, onOpen, onToggleDone, onDelete }) {
  return (
    <div
      className={`relative group bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-600 animate-slide-up ${
        day.done ? 'border-emerald-700/60' : 'border-zinc-800'
      }`}
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
      onClick={() => onOpen(day)}
    >
      {day.done && (
        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 rounded-r-2xl" />
      )}

      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Day {index + 1}
      </div>
      <div className="text-4xl font-extrabold text-white leading-none mb-3">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="text-sm text-zinc-400 leading-snug line-clamp-2 mb-4">{day.topic}</div>

      {day.done && (
        <div className="text-[11px] font-mono font-bold text-emerald-500">✓ completed</div>
      )}

      <div
        className="absolute top-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onToggleDone(day.id)}
          className={`text-[11px] px-2 py-1 rounded-lg font-mono border transition-all ${
            day.done
              ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
              : 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/30'
          }`}
        >
          {day.done ? 'undo' : 'done'}
        </button>
        <button
          onClick={() => onDelete(day.id)}
          className="text-[11px] px-2 py-1 rounded-lg font-mono border border-red-900 text-red-400 hover:bg-red-900/30 transition-all"
        >
          del
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [days, setDays] = useState([])
  const [topic, setTopic] = useState('')
  const [url, setUrl] = useState('')
  const [toast, setToast] = useState({ message: '', visible: false })
  const [toastTimer, setToastTimer] = useState(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      setDays(Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_DAYS)
    } catch {
      setDays(DEFAULT_DAYS)
    }
  }, [])

  useEffect(() => {
    if (days.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
  }, [days])

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer)
    setToast({ message: msg, visible: true })
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 2200)
    setToastTimer(t)
  }

  function addDay() {
    const trimUrl = url.trim()
    const trimTopic = topic.trim() || 'Practice'
    if (!trimUrl) { showToast('Please paste a link!'); return }
    const newDay = {
      id: Date.now(),
      topic: trimTopic,
      url: trimUrl,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setDays((prev) => [...prev, newDay])
    setTopic('')
    setUrl('')
    showToast(`Day ${days.length + 1} added!`)
  }

  function toggleDone(id) {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    )
  }

  function deleteDay(id) {
    setDays((prev) => prev.filter((d) => d.id !== id))
    showToast('Day removed')
  }

  function openDay(day) {
    window.open(day.url, '_blank', 'noopener,noreferrer')
    showToast(`Opening...`)
  }

  const done = days.filter((d) => d.done).length
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].done) streak++
    else break
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Practice Dashboard</h1>
        <p className="text-zinc-500 font-mono text-sm mt-2">// click a day to open your session</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-8">
        <StatCard value={days.length} label="Days Added" />
        <StatCard value={done} label="Completed" />
        <StatCard value={streak} label="Streak" />
      </div>

      {/* Day Grid */}
      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.15em] mb-3">
        Your Days
      </div>
      {days.length === 0 ? (
        <div className="text-zinc-600 text-sm font-mono py-10 text-center border border-dashed border-zinc-800 rounded-2xl">
          No days yet. Add your first practice day below ↓
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {days.map((day, i) => (
            <DayCard
              key={day.id}
              day={day}
              index={i}
              onOpen={openDay}
              onToggleDone={toggleDone}
              onDelete={deleteDay}
            />
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-800 my-8" />

      {/* Add New Day */}
      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.15em] mb-3">
        Add New Day
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (e.g. Arrays, Trees)"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-syne flex-1"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDay()}
          placeholder="Paste ChatGPT / any link"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-syne flex-[2]"
        />
        <button
          onClick={addDay}
          className="bg-white text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all whitespace-nowrap font-syne"
        >
          + Add Day
        </button>
      </div>
      <p className="text-zinc-700 font-mono text-xs mt-3">
        tip: hover a day card → mark done / delete
      </p>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
