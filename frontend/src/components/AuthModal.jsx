import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 36px 40px;
  width: 360px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #888;
  margin: -8px 0 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0dc;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  color: #1a1a1a;
  transition: border-color 0.2s;
  &:focus { border-color: #888; }
  &::placeholder { color: #bbb; }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  &:hover { background: #333; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const SwitchText = styled.p`
  font-size: 13px;
  color: #888;
  text-align: center;
  margin: 0;
  span {
    color: #1a1a1a;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    &:hover { color: #555; }
  }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #e53935;
  margin: 0;
  text-align: center;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
  line-height: 1;
  &:hover { color: #555; }
`;

export default function AuthModal({ mode, onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (err) {
      const msg = err.code === 'auth/invalid-email' ? 'Invalid email address.'
        : err.code === 'auth/wrong-password' ? 'Wrong password.'
        : err.code === 'auth/user-not-found' ? 'No account found with this email.'
        : err.code === 'auth/email-already-in-use' ? 'Email already in use.'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>×</CloseBtn>
        <Title>{isLogin ? 'Welcome back' : 'Create account'}</Title>
        <Subtitle>{isLogin ? 'Log in to see your tasks.' : 'Sign up to start planning.'}</Subtitle>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <PrimaryBtn onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}
        </PrimaryBtn>

        <SwitchText>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </SwitchText>
      </Modal>
    </Overlay>
  );
}
