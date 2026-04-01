import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  body {
    font-family: 'Inter', sans-serif;
    background: #f7f7f5;
    color: #1a1a1a;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

export default GlobalStyles;