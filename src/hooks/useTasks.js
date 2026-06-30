import { useState, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { MOTIVATIONS } from "../constants/meta";
import { applyAutoResets } from "../utils/resetHelpers";

const UNDO_WINDOW_MS = 5000;

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("taskflow_v2") || "[]");
      return applyAutoResets(saved);
    } catch { return []; }
  });

  const [filterType,   setFilterType]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editId,       setEditId]       = useState(null);
  const [confetti,     setConfetti]     = useState(false);
  const [motivation,   setMotivation]   = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", type: "daily", status: "pending", dueDate: "" });

  /* ── Undo delete ── */
  const [pendingDelete, setPendingDelete] = useState(null); // { task, index }
  const undoTimer = useRef(null);

  /* ── Persist to localStorage ── */
  useEffect(() => {
    localStorage.setItem("taskflow_v2", JSON.stringify(tasks));
  }, [tasks]);

  /* ── Auto reset on tab visible ── */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setTasks((prev) => applyAutoResets([...prev]));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  /* ── Cleanup timer on unmount ── */
  useEffect(() => {
    return () => { if (undoTimer.current) clearTimeout(undoTimer.current); };
  }, []);

  /* ── Celebrate ── */
  const celebrate = () => {
    const m = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    setMotivation(m);
    setConfetti(true);
    setTimeout(() => { setConfetti(false); setMotivation(null); }, 4000);
  };

  /* ── Drag & Drop ── */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  /* ── Modal ── */
  const openAdd = () => {
    setForm({ title: "", desc: "", type: "daily", status: "pending", dueDate: "" });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setForm({ title: task.title, desc: task.desc || "", type: task.type, status: task.status, dueDate: task.dueDate || "" });
    setEditId(task.id);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  /* ── CRUD ── */
  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editId) {
      const old = tasks.find((t) => t.id === editId);
      setTasks((p) => p.map((t) => t.id === editId ? { ...t, ...form } : t));
      if (old?.status !== "done" && form.status === "done") celebrate();
    } else {
      setTasks((p) => [{ id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() }, ...p]);
      if (form.status === "done") celebrate();
    }
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    const old = tasks.find((t) => t.id === id);
    setTasks((p) => p.map((t) => t.id === id ? { ...t, status } : t));
    if (old?.status !== "done" && status === "done") celebrate();
  };

  /* ── Soft delete with undo ── */
  const deleteTask = (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];

    setTasks((p) => p.filter((t) => t.id !== id));
    setPendingDelete({ task, index });

    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => {
      setPendingDelete(null);
    }, UNDO_WINDOW_MS);
  };

  const undoDelete = () => {
    if (!pendingDelete) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);

    setTasks((p) => {
      const next = [...p];
      next.splice(pendingDelete.index, 0, pendingDelete.task);
      return next;
    });
    setPendingDelete(null);
  };

  /* ── Derived stats ── */
  const filtered = tasks.filter((t) => {
    const matchType   = filterType   === "all" || t.type   === filterType;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const q           = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      (t.desc || "").toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch;
  });

  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === "done").length;
  const inprogress = tasks.filter((t) => t.status === "inprogress").length;
  const pending    = tasks.filter((t) => t.status === "pending").length;

  return {
    /* state */
    filtered, total, done, inprogress, pending,
    confetti, motivation,
    showModal, form, setForm, editId,
    filterType,   setFilterType,
    filterStatus, setFilterStatus,
    searchQuery,  setSearchQuery,
    pendingDelete,
    /* actions */
    openAdd, openEdit, closeModal,
    saveTask, updateStatus, deleteTask, undoDelete,
    handleDragEnd,
  };
}