import React from 'react';
import styled from 'styled-components';

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e6;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`font-weight: 600; font-size: 20px; color: #1a1a1a;`;
const Center = styled.div`display:flex; align-items:center; gap:8px;`;
const Button = styled.button`
  background:none; border:1px solid #e0e0dc; border-radius:6px; padding:4px 10px;
  font-size:13px; cursor:pointer; color:#444; &:hover{background:#f0f0ed;}
`;
const TodayBtn = styled(Button)`font-size:12px; font-weight:500;`;

export default function Navbar({ prevWeek, nextWeek, today, weekLabel }) {
  return (
    <Nav>
      <Logo>Saanjh</Logo>
      <Center>
        <Button onClick={prevWeek}>&larr;</Button>
        <span>{weekLabel}</span>
        <Button onClick={nextWeek}>&rarr;</Button>
        <TodayBtn onClick={today}>Today</TodayBtn>
      </Center>
      <Button>☰</Button>
    </Nav>
  );
}