import React from 'react';
import styled from 'styled-components';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';

const Col = styled.div`width:200px; border-left:1px solid #e8e8e6; display:flex; flex-direction:column; background:#fafaf8;`;
const Header = styled.div`padding:12px 14px 10px; border-bottom:1px solid #e8e8e6; font-size:11px; font-weight:600; color:#999; text-transform:uppercase;`;

export default function SomedayColumn() {
  const { somedayTasks, saveSomeday } = useTasks();
  const addTask = (e) => {
    if(e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if(!text) return;
    saveSomeday([...somedayTasks,{text,done:false}]);
    e.target.value='';
  };
  return (
    <Col>
      <Header>Someday</Header>
      {somedayTasks.map((task,i)=><TaskItem key={i} task={task} index={i} dayKey="someday"/>)}
      <input type="text" placeholder="+ Add task" onKeyDown={addTask}/>
    </Col>
  );
}