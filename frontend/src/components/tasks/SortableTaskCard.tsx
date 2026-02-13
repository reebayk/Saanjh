import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import EditTaskModal from './EditTaskModal';

interface SortableTaskCardProps {
  task: Task;
}

export default function SortableTaskCard({ task }: SortableTaskCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const { toggleTask, deleteTask } = useTaskStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityStyles = {
    LOW: 'border-l-4 border-sage bg-gradient-to-r from-sage/5 to-transparent',
    MEDIUM: 'border-l-4 border-beige-dark bg-gradient-to-r from-beige/20 to-transparent',
    HIGH: 'border-l-4 border-burgundy bg-gradient-to-r from-burgundy/10 to-transparent',
  };

  const priorityDots = {
    LOW: 'bg-sage',
    MEDIUM: 'bg-beige-dark',
    HIGH: 'bg-burgundy',
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <div
          className={`
            group relative rounded-lg p-3
            transition-all duration-200
            ${priorityStyles[task.priority]}
            ${isDragging ? 'shadow-2xl rotate-2' : 'hover:shadow-md'}
            ${task.completed ? 'opacity-60' : ''}
            bg-white dark:bg-plum
          `}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox - Clickable */}
            <button
              type="button"
              onClick={handleToggle}
              className={`
                mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 
                transition-all duration-200 cursor-pointer z-10
                ${task.completed 
                  ? 'bg-sage border-sage dark:bg-sage-light' 
                  : 'border-slate dark:border-beige hover:border-sage'
                }
              `}
            >
              {task.completed && (
                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Content - Draggable */}
            <div 
              {...attributes} 
              {...listeners}
              className="flex-1 min-w-0 cursor-move"
              onClick={() => setShowEdit(true)}
            >
              <h3 className={`
                font-medium text-sm
                ${task.completed 
                  ? 'line-through text-slate dark:text-slate-light' 
                  : 'text-burgundy dark:text-beige'
                }
              `}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-xs text-slate-light dark:text-beige-dark mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
                <span className="text-xs text-slate dark:text-beige-dark capitalize">
                  {task.priority.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Delete Button - Clickable */}
            <button
              type="button"
              onClick={handleDelete}
              className="
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-200
                text-burgundy dark:text-beige-light 
                hover:text-red-600 dark:hover:text-red-400
                flex-shrink-0 cursor-pointer z-10
              "
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  );
}