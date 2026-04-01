import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import DayColumn from '../components/DayColumn';
import SomedayColumn from '../components/SomedayColumn';

const PlannerContainer = styled.main`display:flex; flex:1; overflow:hidden;`;
const DaysGrid = styled.div`display:flex; flex:1; overflow-x:auto;`;

export default function Planner() {
  const [weekOffset,setWeekOffset] = useState(0);

  const weekStart = new Date(); // Simple placeholder, replace with real calculation
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const prevWeek = ()=>setWeekOffset(weekOffset-1);
  const nextWeek = ()=>setWeekOffset(weekOffset+1);
  const today = ()=>setWeekOffset(0);
  const weekLabel = 'Apr 2 – Apr 8, 2026';

  const dayObjects = DAYS.map((d,i)=>({day:d,num:i+1,isToday:i===0}));

  return (
    <>
      <Navbar prevWeek={prevWeek} nextWeek={nextWeek} today={today} weekLabel={weekLabel}/>
      <PlannerContainer>
        <DaysGrid>
          {dayObjects.map((d,i)=><DayColumn key={i} date={d} keyString={`2026-04-0${i+2}`}/>)}
        </DaysGrid>
        <SomedayColumn/>
      </PlannerContainer>
    </>
  );
}