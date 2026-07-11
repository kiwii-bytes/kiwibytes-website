const STORAGE_KEY = 'kiwibytes-theme';

// NOTE: this default is duplicated in the inline no-flash script in
// BaseLayout.astro. If the two ever disagree, every visitor gets a visible
// flash of the wrong theme on first paint. Change both together.
export const DEFAULT_THEME = 'light';

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Light on first visit for everyone, by product decision -- deliberately
  // NOT following prefers-color-scheme. A returning visitor's own toggle
  // choice always wins over this.
  return DEFAULT_THEME;
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initTheme() {
  setTheme(getInitialTheme());

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });
}

export function onThemeChange(callback) {
  window.addEventListener('themechange', (e) => callback(e.detail.theme));
}
