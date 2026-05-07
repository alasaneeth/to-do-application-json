# TaskFlow — Task Management App

A modern, full-featured task manager built with **React 18 + Vite**.  
Supports Daily, Weekly, and Monthly tasks with automatic reset logic, dark mode, toast notifications, and full `localStorage` persistence.

---

## Features

| Feature | Details |
|---|---|
| **Add / Edit / Delete** | Full CRUD for tasks via a modal form |
| **Complete tasks** | Checkbox per task, with strikethrough animation |
| **Task types** | Daily · Weekly · Monthly, each colour-coded |
| **Auto-reset** | Daily tasks reset every day, Weekly every week, Monthly every month |
| **Progress tracking** | Stats bar + progress fill per tab |
| **Filters** | All · Pending · Done, plus type tabs |
| **Dark mode** | Toggle with `localStorage` persistence |
| **Toast notifications** | Non-blocking feedback for all actions |
| **Overdue indicators** | Visual warning when a due date has passed |
| **Responsive** | Works on mobile and desktop |

---

## Project Structure

```
taskflow/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx              ← React entry point
    ├── App.jsx               ← Root component, global state
    ├── App.css               ← Full design system (tokens, components)
    ├── components/
    │   ├── TaskForm.jsx      ← Add / edit modal form
    │   ├── TaskList.jsx      ← Renders the list of TaskItems
    │   ├── TaskItem.jsx      ← Single task card
    │   ├── FilterTabs.jsx    ← Tab nav + All/Pending/Done filter
    │   └── ProgressBar.jsx   ← Stats + progress fill
    ├── hooks/
    │   └── useLocalStorage.js  ← Generic localStorage hook
    └── utils/
        └── taskUtils.js        ← ID gen, reset logic, filters, stats
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18  
- **npm** ≥ 9  (or pnpm / yarn)

### Install & run

```bash
# 1 — enter the project folder
cd taskflow

# 2 — install dependencies
npm install

# 3 — start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

---

## Task Data Shape

```js
{
  id:        "task_1700000000000_abc123",   // unique string
  title:     "Morning workout",            // string, max 120 chars
  type:      "daily",                      // "daily" | "weekly" | "monthly"
  completed: false,                        // boolean
  createdAt: "2025-01-15T08:30:00.000Z",   // ISO date string
  dueDate:   "2025-01-20",                 // "YYYY-MM-DD" | null
}
```

---

## Auto-Reset Logic

On every app load, `checkAndResetTasks()` in `taskUtils.js` compares stored reset keys against the current date/week/month:

| Type | Key stored | Resets when |
|---|---|---|
| Daily   | `YYYY-MM-DD`  | Today's date differs |
| Weekly  | `YYYY-WNN`    | ISO week number differs |
| Monthly | `YYYY-MM`     | Month differs |

When a reset fires, all `completed` flags for that type are set to `false`.  
A toast notification announces how many tasks were reset.

---

## localStorage Keys

| Key | Contents |
|---|---|
| `tf_tasks`  | Array of task objects |
| `tf_reset`  | `{ daily, weekly, monthly }` last-reset keys |
| `tf_dark`   | Boolean — dark mode preference |

---

## Hooks Used

- `useState` — local UI state (tabs, filter, form visibility, toasts)
- `useEffect` — side effects (auto-reset on mount, dark-mode attribute)
- `useCallback` — stable `addToast` reference
- `useRef` — auto-focus form input

---

## Tech Stack

- **React 18** (functional components + hooks only)
- **Vite 5** (build tooling)
- **CSS custom properties** (zero external CSS frameworks)
- **Google Fonts** — Syne (display) + Manrope (body)
- **localStorage** (persistence, no backend)
