import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Day } from '../../types';
import DayColumn from './DayColumn';
import { useTaskStore } from '../../store/taskStore';
import TaskCard from './TaskCard';

interface WeekViewProps {
  tasks: Task[];
}

const WEEK_DAYS: { key: Day; label: string; short: string }[] = [
  { key: 'MONDAY', label: 'Monday', short: 'Mon' },
  { key: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { key: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { key: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { key: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { key: 'SUNDAY', label: 'Sunday', short: 'Sun' },
];

export default function WeekView({ tasks }: WeekViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTask = useTaskStore((state) => state.updateTask);

  const tasksByDay = useMemo(() => {
    const map = new Map<Day, Task[]>();
    [...WEEK_DAYS, { key: 'SOMEDAY' as Day, label: 'Someday', short: 'Later' }].forEach(({ key }) => {
      map.set(key, tasks.filter(task => task.day === key));
    });
    return map;
  }, [tasks]);

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newDay = over.id as Day;
    
    const task = tasks.find(t => t.id === taskId);
    if (task && task.day !== newDay) {
      updateTask(taskId, { day: newDay });
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const weekTasks = tasksByDay.get('SOMEDAY') || [];
  const somedayTasks = weekTasks;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-burgundy dark:text-beige mb-1">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-slate dark:text-beige-dark">
            {tasks.filter(t => t.completed).length} of {tasks.length} completed
          </p>
        </div>

        {/* Week Days - Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {WEEK_DAYS.map(({ key, label, short }) => (
            <DayColumn
              key={key}
              day={key}
              label={label}
              shortLabel={short}
              tasks={tasksByDay.get(key) || []}
            />
          ))}
        </div>

        {/* Someday Section - Full Width at Bottom */}
        <div className="mt-6 pt-6 border-t-2 border-beige dark:border-plum">
          <DayColumn
            day="SOMEDAY"
            label="Someday"
            shortLabel="Someday"
            tasks={tasksByDay.get('SOMEDAY') || []}
            isFullWidth
          />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}