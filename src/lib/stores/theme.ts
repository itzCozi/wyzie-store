import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getStoredTheme, setStoredTheme, applyTheme, getSystemTheme, type Theme } from '$lib/theme';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('system');

  return {
    subscribe,
    init: () => {
      if (!browser) return;
      
      const stored = getStoredTheme();
      set(stored);
      applyTheme(stored);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        update(current => {
          if (current === 'system') {
            applyTheme('system');
          }
          return current;
        });
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    },
    setTheme: (theme: Theme) => {
      if (browser) {
        setStoredTheme(theme);
        applyTheme(theme);
      }
      set(theme);
    },
    getResolvedTheme: (currentTheme: Theme): 'light' | 'dark' => {
      return currentTheme === 'system' ? getSystemTheme() : currentTheme;
    }
  };
}

export const themeStore = createThemeStore();