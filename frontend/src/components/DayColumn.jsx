import React from 'react';
import styled from 'styled-components';
import TaskItem from './TaskItem';
import { useTasks } from '../context/TaskContext';

const Col = styled.div`
  flex:1; min-width:120px; border-right:1px solid #e8e8e6; display:flex; flex-direction:column;
  background:${props=>props.today?"#fffdf5":"#fff"};
`;
const Header = styled.div`padding:12px 14px 10px; border-bottom:1px solid #e8e8e6; position:sticky; top:0; background:inherit; z-index:10;`;
const TasksContainer = styled.div`flex:1; overflow-y:auto; padding:8px 0;`;

export default function DayColumn({ date, keyString }) {
  const { tasks, saveTasks } = useTasks();

  const addTask = (e) => {
    if(e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if(!text) return;
    const updated = {...tasks};
    if(!updated[keyString]) updated[keyString]=[];
    updated[keyString].push({text, done:false});
    saveTasks(updated);
    e.target.value='';
  };

  return (
    <Col today={date.isToday}>
      <Header>{date.day} {date.num}</Header>
      <TasksContainer>
        {(tasks[keyString]||[]).map((task,i)=><TaskItem key={i} task={task} index={i} dayKey={keyString}/>)}
        <input type="text" placeholder="+ Add task" onKeyDown={addTask}/>
      </TasksContainer>
    </Col>
  );
}