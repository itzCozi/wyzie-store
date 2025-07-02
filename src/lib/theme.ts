export type Theme = 'light' | 'dark' | 'system';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;
  
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}