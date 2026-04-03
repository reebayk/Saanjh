import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../context/TaskContext';

// ── Day task row ─────────────────────────────────────────────────
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 16px;
  width: 100%;
  min-height: 36px;
  cursor: pointer;
  background: ${p => p.isDragging ? '#f0f4ff' : 'transparent'};
  border-radius: ${p => p.isDragging ? '6px' : '0'};
  box-shadow: ${p => p.isDragging ? '0 2px 12px rgba(0,0,0,0.1)' : 'none'};
  transition: background 0.1s;
  &:hover { background: #fafafa; }
`;

const Check = styled.div`
  width: 15px;
  height: 15px;
  border: 1.5px solid ${p => p.done ? '#ccc' : '#d0d0d0'};
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  background: ${p => p.done ? '#ccc' : 'transparent'};
  transition: all 0.15s;
  &:hover { border-color: #888; }
`;

const TaskText = styled.span`
  flex: 1;
  font-size: 13px;
  color: ${p => p.done ? '#bbb' : '#2a2a2a'};
  text-decoration: ${p => p.done ? 'line-through' : 'none'};
  line-height: 1.5;
  word-break: break-word;
  user-select: none;
`;

const DragHandle = styled.div`
  opacity: 0;
  color: #ccc;
  font-size: 14px;
  cursor: grab;
  padding: 0 2px;
  transition: opacity 0.15s;
  ${Row}:hover & { opacity: 1; }
`;

// ── Someday chip ─────────────────────────────────────────────────
const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${p => p.isDragging ? '#e8eeff' : '#f0f0ee'};
  border-radius: 20px;
  padding: 3px 10px 3px 8px;
  font-size: 12px;
  color: ${p => p.done ? '#bbb' : '#333'};
  text-decoration: ${p => p.done ? 'line-through' : 'none'};
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #e4e4e2; }
`;

const ChipDot = styled.div`
  width: 10px;
  height: 10px;
  border: 1.5px solid ${p => p.done ? '#ccc' : '#aaa'};
  border-radius: 50%;
  flex-shrink: 0;
  background: ${p => p.done ? '#ccc' : 'transparent'};
`;

export default function TaskItem({ task, index, dayKey, onEdit }) {
  const { toggleTask } = useTasks();
  const isSomeday = dayKey === 'someday';
  // Draggable ID must be unique and stable
  const draggableId = `${dayKey}__${index}__${task.id || task.text}`;

  const handleCheck = (e) => {
    e.stopPropagation();
    toggleTask(dayKey, index);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onEdit(dayKey, index);
  };

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        isSomeday ? (
          <Chip
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            done={task.done}
            isDragging={snapshot.isDragging}
            onClick={handleClick}
          >
            <ChipDot done={task.done} onClick={handleCheck} />
            {task.text}
          </Chip>
        ) : (
          <Row
            ref={provided.innerRef}
            {...provided.draggableProps}
            isDragging={snapshot.isDragging}
            onClick={handleClick}
          >
            <Check done={task.done} onClick={handleCheck} />
            <TaskText done={task.done}>{task.text}</TaskText>
            <DragHandle {...provided.dragHandleProps}>⠿</DragHandle>
          </Row>
        )
      )}
    </Draggable>
  );
}
