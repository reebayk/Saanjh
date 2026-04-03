import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

// Sort helper: undone tasks first, done tasks at bottom
const sortTasks = (taskList) => {
  if (!taskList) return [];
  return [
    ...taskList.filter(t => !t.done),
    ...taskList.filter(t => t.done),
  ];
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({});
  const [somedayTasks, setSomedayTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Load from Firestore when user logs in ──────────────────────
  useEffect(() => {
    if (!user) {
      setTasks({});
      setSomedayTasks([]);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'tasks', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setTasks(data.tasks || {});
          setSomedayTasks(data.someday || []);
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ── Persist to Firestore (optimistic: state updates immediately) ─
  const persist = useCallback(async (newTasks, newSomeday) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'tasks', user.uid), {
        tasks: newTasks,
        someday: newSomeday,
      });
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  }, [user]);

  // ── Add task to a day or someday ───────────────────────────────
  const addTask = useCallback((dayKey, text) => {
    if (!text.trim()) return;
    const newTask = { text: text.trim(), done: false, id: Date.now().toString() };
    if (dayKey === 'someday') {
      const updated = [...somedayTasks, newTask];
      setSomedayTasks(updated);
      persist(tasks, updated);
    } else {
      const updated = { ...tasks, [dayKey]: [...(tasks[dayKey] || []), newTask] };
      setTasks(updated);
      persist(updated, somedayTasks);
    }
  }, [tasks, somedayTasks, persist]);

  // ── Toggle done — re-sorts list after toggle ───────────────────
  const toggleTask = useCallback((dayKey, index) => {
    if (dayKey === 'someday') {
      const updated = somedayTasks.map((t, i) =>
        i === index ? { ...t, done: !t.done } : t
      );
      const sorted = sortTasks(updated);
      setSomedayTasks(sorted);
      persist(tasks, sorted);
    } else {
      const list = [...(tasks[dayKey] || [])];
      list[index] = { ...list[index], done: !list[index].done };
      const sorted = sortTasks(list);
      const updated = { ...tasks, [dayKey]: sorted };
      setTasks(updated);
      persist(updated, somedayTasks);
    }
  }, [tasks, somedayTasks, persist]);

  // ── Edit task text ─────────────────────────────────────────────
  const editTask = useCallback((dayKey, index, text) => {
    if (!text.trim()) {
      deleteTask(dayKey, index);
      return;
    }
    if (dayKey === 'someday') {
      const updated = somedayTasks.map((t, i) =>
        i === index ? { ...t, text: text.trim() } : t
      );
      setSomedayTasks(updated);
      persist(tasks, updated);
    } else {
      const updated = {
        ...tasks,
        [dayKey]: (tasks[dayKey] || []).map((t, i) =>
          i === index ? { ...t, text: text.trim() } : t
        ),
      };
      setTasks(updated);
      persist(updated, somedayTasks);
    }
  }, [tasks, somedayTasks, persist]);

  // ── Delete task ────────────────────────────────────────────────
  const deleteTask = useCallback((dayKey, index) => {
    if (dayKey === 'someday') {
      const updated = somedayTasks.filter((_, i) => i !== index);
      setSomedayTasks(updated);
      persist(tasks, updated);
    } else {
      const updated = {
        ...tasks,
        [dayKey]: (tasks[dayKey] || []).filter((_, i) => i !== index),
      };
      setTasks(updated);
      persist(updated, somedayTasks);
    }
  }, [tasks, somedayTasks, persist]);

  // ── Move task between days (drag & drop) ──────────────────────
  const moveTask = useCallback((fromKey, fromIndex, toKey, toIndex) => {
    if (fromKey === toKey && fromIndex === toIndex) return;

    let newTasks = { ...tasks };
    let newSomeday = [...somedayTasks];

    // Extract the task
    let task;
    if (fromKey === 'someday') {
      task = newSomeday[fromIndex];
      newSomeday = newSomeday.filter((_, i) => i !== fromIndex);
    } else {
      const fromList = [...(newTasks[fromKey] || [])];
      task = fromList[fromIndex];
      fromList.splice(fromIndex, 1);
      newTasks = { ...newTasks, [fromKey]: fromList };
    }

    if (!task) return;

    // Insert the task
    if (toKey === 'someday') {
      newSomeday.splice(toIndex, 0, task);
    } else {
      const toList = [...(newTasks[toKey] || [])];
      toList.splice(toIndex, 0, task);
      newTasks = { ...newTasks, [toKey]: toList };
    }

    setTasks(newTasks);
    setSomedayTasks(newSomeday);
    persist(newTasks, newSomeday);
  }, [tasks, somedayTasks, persist]);

  // ── Move task to a different day (from edit modal) ─────────────
  const moveTaskToDay = useCallback((fromKey, fromIndex, toKey) => {
    const task = fromKey === 'someday'
      ? somedayTasks[fromIndex]
      : (tasks[fromKey] || [])[fromIndex];
    if (!task) return;

    let newTasks = { ...tasks };
    let newSomeday = [...somedayTasks];

    // Remove from source
    if (fromKey === 'someday') {
      newSomeday = newSomeday.filter((_, i) => i !== fromIndex);
    } else {
      newTasks[fromKey] = (newTasks[fromKey] || []).filter((_, i) => i !== fromIndex);
    }

    // Append to destination
    if (toKey === 'someday') {
      newSomeday = [...newSomeday, task];
    } else {
      newTasks[toKey] = [...(newTasks[toKey] || []), task];
    }

    setTasks(newTasks);
    setSomedayTasks(newSomeday);
    persist(newTasks, newSomeday);
  }, [tasks, somedayTasks, persist]);

  return (
    <TaskContext.Provider value={{
      tasks, somedayTasks, loading,
      addTask, toggleTask, editTask, deleteTask, moveTask, moveTaskToDay,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
