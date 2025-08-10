// Theme definitions for styled-components and CSS variables interop
export interface AppTheme {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#f8f9fa',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#667eea',
    secondary: '#ff6b9d',
    border: '#e5e7eb',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#0b1220',
    surface: '#111827',
    surfaceAlt: '#0f172a',
    textPrimary: '#e5e7eb',
    textSecondary: '#9ca3af',
    primary: '#8da2fb',
    secondary: '#ff85ac',
    border: '#374151',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
};

// styled-components v6 theme typing augmentation
import 'styled-components';
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Omit<AppTheme, never> {}
}
