import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';

const Strip = styled.div`
  border-top: 1px solid #ebebeb;
  background: #fafaf8;
  flex-shrink: 0;
`;

const StripHeader = styled.div`
  padding: 7px 20px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #ebebeb;
`;

const TasksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 16px;
  align-items: center;
  min-height: 44px;
  background: ${p => p.isDraggingOver ? '#f0f4ff' : 'transparent'};
  transition: background 0.15s;
`;

const AddInput = styled.input`
  border: none;
  background: transparent;
  font-size: 13px;
  color: #999;
  outline: none;
  font-family: inherit;
  min-width: 120px;
  &::placeholder { color: #ccc; }
`;

export default function SomedayColumn({ onEdit }) {
  const { tasks, somedayTasks, addTask } = useTasks();

  const handleAdd = (e) => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (!text) return;
    addTask('someday', text);
    e.target.value = '';
  };

  return (
    <Strip>
      <StripHeader>Someday</StripHeader>
      <Droppable droppableId="someday" direction="horizontal">
        {(provided, snapshot) => (
          <TasksRow
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {somedayTasks.map((task, i) => (
              <TaskItem
                key={`someday-${i}`}
                task={task}
                index={i}
                dayKey="someday"
                onEdit={onEdit}
              />
            ))}
            {provided.placeholder}
            <AddInput type="text" placeholder="+ Add task" onKeyDown={handleAdd} />
          </TasksRow>
        )}
      </Droppable>
    </Strip>
  );
}
