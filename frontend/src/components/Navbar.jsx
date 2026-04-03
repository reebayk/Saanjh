import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
  letter-spacing: -0.5px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MonthLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #444;
  min-width: 140px;
  text-align: center;
`;

const NavBtn = styled.button`
  background: none;
  border: 1px solid #e0e0dc;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  font-size: 14px;
  transition: background 0.15s;
  &:hover { background: #f5f5f5; }
`;

const TodayBtn = styled.button`
  background: none;
  border: 1px solid #e0e0dc;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #555;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #f5f5f5; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AuthBtn = styled.button`
  background: ${p => p.primary ? '#1a1a1a' : 'none'};
  color: ${p => p.primary ? '#fff' : '#444'};
  border: 1px solid ${p => p.primary ? '#1a1a1a' : '#e0e0dc'};
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: ${p => p.primary ? '#333' : '#f5f5f5'}; }
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #999;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function Navbar({ prevWeek, nextWeek, today, monthLabel, onLogin, onSignup }) {
  const { user, logout } = useAuth();

  return (
    <Nav>
      <Logo>saanjh</Logo>
      <Center>
        <NavBtn onClick={prevWeek}>&#8592;</NavBtn>
        <MonthLabel>{monthLabel}</MonthLabel>
        <NavBtn onClick={nextWeek}>&#8594;</NavBtn>
        <TodayBtn onClick={today}>Today</TodayBtn>
      </Center>
      <Right>
        {user ? (
          <>
            <UserEmail>{user.email}</UserEmail>
            <AuthBtn onClick={logout}>Logout</AuthBtn>
          </>
        ) : (
          <>
            <AuthBtn onClick={onLogin}>Login</AuthBtn>
            <AuthBtn primary onClick={onSignup}>Sign up</AuthBtn>
          </>
        )}
      </Right>
    </Nav>
  );
}
