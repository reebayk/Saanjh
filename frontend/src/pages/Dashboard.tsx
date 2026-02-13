import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import Header from '../components/layout/Header';
import WeekView from '../components/tasks/WeekView';
import CreateTaskButton from '../components/tasks/CreateTaskButton';

export default function Dashboard() {
  const { tasks, loading, fetchTasks } = useTaskStore();
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
    fetchTasks();
  }, [initTheme, fetchTasks]);

  return (
    <div className="min-h-screen bg-beige-light dark:bg-slate transition-colors">
      <Header />
      
      <main className="min-h-[calc(100vh-64px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate dark:text-beige">Loading your week...</p>
            </div>
          </div>
        ) : (
          <WeekView tasks={tasks} />
        )}
      </main>

      <CreateTaskButton />
    </div>
  );
}