export const generateId = () =>
  `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getToday = () => new Date().toISOString().split('T')[0];

export const getThisWeek = () => {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

export const getThisMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + (dateString.includes('T') ? '' : 'T00:00:00'));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  const due = new Date(dueDate + 'T23:59:59');
  return due < new Date();
};

export const checkAndResetTasks = (tasks, resetTracker) => {
  const today = getToday();
  const thisWeek = getThisWeek();
  const thisMonth = getThisMonth();

  let updatedTasks = [...tasks];
  let updatedTracker = { ...resetTracker };
  let hasChanges = false;
  const resetMessages = [];

  if (resetTracker.daily !== today) {
    const count = updatedTasks.filter(t => t.type === 'daily' && t.completed).length;
    updatedTasks = updatedTasks.map(t =>
      t.type === 'daily' ? { ...t, completed: false } : t
    );
    updatedTracker.daily = today;
    hasChanges = true;
    if (count > 0) resetMessages.push(`${count} daily task${count > 1 ? 's' : ''} reset for today`);
  }

  if (resetTracker.weekly !== thisWeek) {
    const count = updatedTasks.filter(t => t.type === 'weekly' && t.completed).length;
    updatedTasks = updatedTasks.map(t =>
      t.type === 'weekly' ? { ...t, completed: false } : t
    );
    updatedTracker.weekly = thisWeek;
    hasChanges = true;
    if (count > 0) resetMessages.push(`${count} weekly task${count > 1 ? 's' : ''} reset for this week`);
  }

  if (resetTracker.monthly !== thisMonth) {
    const count = updatedTasks.filter(t => t.type === 'monthly' && t.completed).length;
    updatedTasks = updatedTasks.map(t =>
      t.type === 'monthly' ? { ...t, completed: false } : t
    );
    updatedTracker.monthly = thisMonth;
    hasChanges = true;
    if (count > 0) resetMessages.push(`${count} monthly task${count > 1 ? 's' : ''} reset for this month`);
  }

  return { updatedTasks, updatedTracker, hasChanges, resetMessages };
};

export const filterAndSortTasks = (tasks, activeTab, filter) => {
  let filtered = [...tasks];

  if (activeTab !== 'all') {
    filtered = filtered.filter(t => t.type === activeTab);
  }

  if (filter === 'completed') filtered = filtered.filter(t => t.completed);
  else if (filter === 'pending') filtered = filtered.filter(t => !t.completed);

  return filtered.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const getProgressStats = (tasks) => {
  const stats = {
    all: { total: 0, completed: 0, percentage: 0 },
    daily: { total: 0, completed: 0, percentage: 0 },
    weekly: { total: 0, completed: 0, percentage: 0 },
    monthly: { total: 0, completed: 0, percentage: 0 },
  };

  tasks.forEach(task => {
    stats.all.total++;
    if (task.completed) stats.all.completed++;
    stats[task.type].total++;
    if (task.completed) stats[task.type].completed++;
  });

  Object.keys(stats).forEach(key => {
    stats[key].percentage = stats[key].total === 0
      ? 0
      : Math.round((stats[key].completed / stats[key].total) * 100);
  });

  return stats;
};
