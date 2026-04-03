import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { useTasks } from '../context/TaskContext';

const Col = styled.div`
  flex: 1;
  min-width: 0;
  border-right: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  background: ${p => p.today ? '#fefdf7' : '#fff'};
  &:last-child { border-right: none; }
`;

const Header = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #ebebeb;
  flex-shrink: 0;
`;

const DayName = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 3px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const DayNum = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: ${p => p.today ? '#5b5bd6' : '#1a1a1a'};
  line-height: 1;
`;

const MonthTag = styled.span`
  font-size: 12px;
  color: #bbb;
  font-weight: 400;
`;

const TasksArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  background: ${p => p.isDraggingOver ? '#f5f7ff' : 'transparent'};
  transition: background 0.15s;
`;

const TaskSlot = styled.div`
  border-bottom: 1px solid #f0f0f0;
  min-height: 36px;
  display: flex;
  align-items: center;
`;

const AddInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #999;
  padding: 8px 16px;
  outline: none;
  font-family: inherit;
  min-height: 36px;
  border-bottom: 1px solid #f0f0f0;
  &::placeholder { color: #ccc; }
`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DayColumn({ date, keyString, onEdit }) {
  const { tasks, addTask } = useTasks();
  const dayTasks = tasks[keyString] || [];

  const handleAdd = (e) => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (!text) return;
    addTask(keyString, text);
    e.target.value = '';
  };

  return (
    <Col today={date.isToday}>
      <Header>
        <DayName>{date.day}</DayName>
        <DateRow>
          <DayNum today={date.isToday}>{date.num}</DayNum>
          <MonthTag>{MONTHS[date.month]}</MonthTag>
        </DateRow>
      </Header>

      <Droppable droppableId={keyString}>
        {(provided, snapshot) => (
          <TasksArea
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {dayTasks.map((task, i) => (
              <TaskSlot key={`${keyString}-${i}`}>
                <TaskItem
                  task={task}
                  index={i}
                  dayKey={keyString}
                  onEdit={onEdit}
                />
              </TaskSlot>
            ))}
            {provided.placeholder}
            <AddInput
              type="text"
              placeholder="+ Add task"
              onKeyDown={handleAdd}
            />
          </TasksArea>
        )}
      </Droppable>
    </Col>
  );
}
