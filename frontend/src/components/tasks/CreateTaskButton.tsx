import { useState } from 'react';
import CreateTaskModal from './CreateTaskModal';

export default function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-8 right-8 
          w-14 h-14 rounded-full
          bg-gradient-to-br from-sage to-sage-dark
          text-white shadow-lg
          hover:shadow-xl hover:scale-110
          transition-all duration-200
          flex items-center justify-center
          group
        "
        title="Create new task"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {isOpen && <CreateTaskModal onClose={() => setIsOpen(false)} />}
    </>
  );
}