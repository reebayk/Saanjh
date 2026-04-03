import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Navbar from '../components/Navbar';
import DayColumn from '../components/DayColumn';
import SomedayColumn from '../components/SomedayColumn';
import AuthModal from '../components/AuthModal';
import TaskEditModal from '../components/TaskEditModal';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #fff;
`;

const Grid = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 60%;
  background: #5b5bd6;
  animation: slide 1s ease-in-out infinite alternate;
  z-index: 9999;
  @keyframes slide {
    from { width: 20%; }
    to { width: 80%; }
  }
`;

const GuestBanner = styled.div`
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
  padding: 8px 20px;
  font-size: 12px;
  color: #92400e;
  text-align: center;
  flex-shrink: 0;
`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getWeekStart(offset = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + offset * 7);
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function isToday(date) {
  return date.toDateString() === new Date().toDateString();
}

export default function Planner() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [authModal, setAuthModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null); // { dayKey, index }
  const { moveTask, loading } = useTasks();
  const { user } = useAuth();

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const monthLabel = weekStart.getMonth() === weekEnd.getMonth()
    ? `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
    : `${MONTHS[weekStart.getMonth()]} – ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const dayObjects = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      day: DAYS[date.getDay()],
      num: date.getDate(),
      month: date.getMonth(),
      isToday: isToday(date),
      keyString: formatDateKey(date),
    };
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    moveTask(
      source.droppableId,
      source.index,
      destination.droppableId,
      destination.index
    );
  };

  const openEdit = (dayKey, index) => {
    setEditTarget({ dayKey, index });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Wrapper>
        {loading && <LoadingBar />}
        <Navbar
          prevWeek={() => setWeekOffset(o => o - 1)}
          nextWeek={() => setWeekOffset(o => o + 1)}
          today={() => setWeekOffset(0)}
          monthLabel={monthLabel}
          onLogin={() => setAuthModal('login')}
          onSignup={() => setAuthModal('signup')}
        />
        {!user && (
          <GuestBanner>
            You're not logged in — tasks won't be saved. <span
              style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setAuthModal('signup')}
            >Sign up free</span> to save your tasks.
          </GuestBanner>
        )}
        <Grid>
          {dayObjects.map(d => (
            <DayColumn
              key={d.keyString}
              date={d}
              keyString={d.keyString}
              onEdit={openEdit}
            />
          ))}
        </Grid>
        <SomedayColumn onEdit={openEdit} />

        {authModal && (
          <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
        )}
        {editTarget && (
          <TaskEditModal
            dayKey={editTarget.dayKey}
            index={editTarget.index}
            onClose={() => setEditTarget(null)}
          />
        )}
      </Wrapper>
    </DragDropContext>
  );
}
