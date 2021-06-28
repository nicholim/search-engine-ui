import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
    body: '#E2E2E2',
    text: '#363537',
    toggleBorder: '#FFF',
    gradient: 'linear-gradient(#39598A, #79D7ED)',
    backgroundColor: 'rgba(248, 248, 248, 0.9)'
}

export const darkTheme = {
    // body: '#363537',
    body: '#2a2a2b',
    text: '#363537',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
    backgroundColor: 'rgba(243,243,243,0.8)'
}

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .card-accor {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
`;