import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTasks } from '../context/TaskContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 420px;
  max-width: 94vw;
  box-shadow: 0 8px 40px rgba(0,0,0,0.14);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #e8e8e6;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1a1a1a;
  resize: none;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.2s;
  &:focus { border-color: #aaa; }
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
`;

const DayGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const DayChip = styled.button`
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid ${p => p.active ? '#1a1a1a' : '#e0e0dc'};
  background: ${p => p.active ? '#1a1a1a' : 'none'};
  color: ${p => p.active ? '#fff' : '#555'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  &:hover { background: ${p => p.active ? '#333' : '#f5f5f5'}; }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: 1px solid #fca5a5;
  color: #ef4444;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #fef2f2; }
`;

const SaveBtn = styled.button`
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #333; }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 20px;
  color: #bbb;
  cursor: pointer;
  line-height: 1;
  &:hover { color: #555; }
`;

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Build the current week's day options
function getWeekDayOptions() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0,0,0,0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split('T')[0];
    return {
      key,
      label: `${DAYS_OF_WEEK[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`,
    };
  });
}

export default function TaskEditModal({ dayKey, index, onClose }) {
  const { tasks, somedayTasks, editTask, deleteTask, moveTaskToDay, toggleTask } = useTasks();

  const task = dayKey === 'someday'
    ? somedayTasks[index]
    : (tasks[dayKey] || [])[index];

  const [text, setText] = useState(task?.text || '');
  const [targetDay, setTargetDay] = useState(dayKey);
  const textRef = useRef();

  useEffect(() => {
    textRef.current?.focus();
    textRef.current?.select();
  }, []);

  if (!task) return null;

  const weekDays = getWeekDayOptions();

  const handleSave = () => {
    if (!text.trim()) return;
    editTask(dayKey, index, text.trim());
    if (targetDay !== dayKey) {
      // We need to find new index after edit
      setTimeout(() => moveTaskToDay(dayKey, index, targetDay), 0);
    }
    onClose();
  };

  const handleDelete = () => {
    deleteTask(dayKey, index);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>×</CloseBtn>

        <div>
          <Label>Task</Label>
          <TextArea
            ref={textRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <Label>Move to</Label>
          <DayGrid>
            <DayChip
              active={targetDay === 'someday'}
              onClick={() => setTargetDay('someday')}
            >
              Someday
            </DayChip>
            {weekDays.map(d => (
              <DayChip
                key={d.key}
                active={targetDay === d.key}
                onClick={() => setTargetDay(d.key)}
              >
                {d.label}
              </DayChip>
            ))}
          </DayGrid>
        </div>

        <Actions>
          <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>
          <SaveBtn onClick={handleSave}>Save</SaveBtn>
        </Actions>
      </Modal>
    </Overlay>
  );
}
