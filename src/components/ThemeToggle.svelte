<script lang="ts">
  import { themeStore } from '$lib/stores/theme';
  import { Sun, Moon, Monitor } from 'lucide-svelte';

  let currentTheme = $state('system');
  
  $effect(() => {
    currentTheme = $themeStore;
  });

  function cycleTheme() {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(currentTheme as any);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    themeStore.setTheme(nextTheme);
  }

  function getIcon(theme: string) {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  }

  function getLabel(theme: string) {
    switch (theme) {
      case 'light': return 'Light mode';
      case 'dark': return 'Dark mode';
      case 'system': return 'System theme';
      default: return 'System theme';
    }
  }
</script>

<button
  onclick={cycleTheme}
  class="theme-toggle"
  title={getLabel(currentTheme)}
  type="button"
  aria-label={getLabel(currentTheme)}
>
  <svelte:component this={getIcon(currentTheme)} size={20} />
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--background-color);
    color: var(--text-color);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    background-color: var(--popup-bg);
    border-color: var(--link-color);
  }

  .theme-toggle:focus {
    outline: 2px solid var(--link-color);
    outline-offset: 2px;
  }
</style>