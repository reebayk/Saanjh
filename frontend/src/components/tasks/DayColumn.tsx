import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Day } from '../../types';
import SortableTaskCard from './SortableTaskCard';

interface DayColumnProps {
  day: Day;
  label: string;
  shortLabel: string;
  tasks: Task[];
  isFullWidth?: boolean;
}

export default function DayColumn({ day, label, shortLabel, tasks, isFullWidth = false }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day });
  
  const isToday = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    return today === day;
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white dark:bg-burgundy rounded-xl p-4
        transition-all duration-200
        ${isFullWidth ? 'w-full' : 'min-h-[400px]'}
        ${isOver ? 'ring-2 ring-sage shadow-xl' : 'shadow-sm'}
        ${isToday() ? 'ring-2 ring-sage-dark' : ''}
      `}
    >
      {/* Day Header - Cleaner */}
      <div className="mb-3 pb-2 border-b border-beige dark:border-plum">
        <div className="flex items-center justify-between">
          <h3 className={`
            font-semibold text-base
            ${isToday() 
              ? 'text-sage-dark dark:text-sage-light' 
              : 'text-burgundy dark:text-beige'
            }
          `}>
            {isFullWidth ? label : (
              <>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </>
            )}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-beige dark:bg-plum text-slate dark:text-beige">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className={`space-y-2 ${isFullWidth ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3' : ''}`}>
          {tasks.length === 0 ? (
            <p className="text-center text-slate-light dark:text-slate py-8 text-sm">
              {isFullWidth ? 'No tasks in backlog' : 'No tasks'}
            </p>
          ) : (
            tasks.map(task => (
              <SortableTaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}