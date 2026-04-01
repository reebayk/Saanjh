import React from 'react';
import styled from 'styled-components';
import { useTasks } from '../context/TaskContext';

const Item = styled.div`display:flex; gap:8px; padding:5px 14px; align-items:flex-start; cursor:pointer;`;
const Check = styled.div`
  width:15px; height:15px; border:1.5px solid #ccc; border-radius:50%; flex-shrink:0;
  margin-top:3px; display:flex; justify-content:center; align-items:center;
  background:${props=>props.done?"#bbb":"transparent"};
`;
const Text = styled.div`
  flex:1; outline:none; cursor:text; color:${props=>props.done?"#aaa":"#333"};
  text-decoration:${props=>props.done?"line-through":"none"};
`;

export default function TaskItem({ task, index, dayKey }) {
  const { tasks, saveTasks } = useTasks();
  const toggleDone = () => {
    const updated = {...tasks};
    updated[dayKey][index].done = !updated[dayKey][index].done;
    saveTasks(updated);
  };
  return (
    <Item>
      <Check done={task.done} onClick={toggleDone}/>
      <Text contentEditable suppressContentEditableWarning={true} onBlur={(e)=>{
        const updated = {...tasks};
        updated[dayKey][index].text = e.target.innerText;
        saveTasks(updated);
      }} done={task.done}>{task.text}</Text>
    </Item>
  );
}