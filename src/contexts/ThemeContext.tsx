import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider as SCThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme, type AppTheme } from '../styles/theme';
import { ThemeContext, type ThemeMode } from './ThemeContextBase';

// styled-components theme typing augmentation
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: ${(props) => props.theme.mode};
  }
  body {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('theme-mode') as ThemeMode) || 'system');
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(getSystemMode());

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemMode(getSystemMode());
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? systemMode : mode;

  const theme = useMemo<AppTheme>(() => (resolvedMode === 'dark' ? darkTheme : lightTheme), [resolvedMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedMode);
  }, [resolvedMode]);

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode]);

  return (
    <ThemeContext.Provider value={value}>
      <SCThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
};

// File now only exports React component(s)
