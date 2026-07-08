const STORAGE_KEY = 'kiwibytes-theme';

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Dark is the designed-for default (hero, bloom, and lighting are all
  // tuned dark-first) -- don't auto-switch to light based on system
  // preference; light is available, but only as an explicit user choice.
  return 'dark';
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
