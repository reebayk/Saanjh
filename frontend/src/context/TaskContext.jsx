import React, { createContext, useState, useContext, useEffect } from 'react';

// Placeholder for Firebase integration later
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [somedayTasks, setSomedayTasks] = useState([]);

  // Example: Load from localStorage (replace with Firebase later)
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tweek_tasks') || '{}');
    const savedSomeday = JSON.parse(localStorage.getItem('tweek_someday') || '[]');
    setTasks(savedTasks);
    setSomedayTasks(savedSomeday);
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tweek_tasks', JSON.stringify(updatedTasks));
  };

  const saveSomeday = (updated) => {
    setSomedayTasks(updated);
    localStorage.setItem('tweek_someday', JSON.stringify(updated));
  };

  return (
    <TaskContext.Provider value={{ tasks, somedayTasks, saveTasks, saveSomeday }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);