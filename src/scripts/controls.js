export function initializeControls(document, window) {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const menu = document.querySelector('.mobile-menu');
  const carouselToggle = document.querySelector('.carousel-toggle');
  const preferredTheme = () => root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const label = () => toggle.setAttribute('aria-label', `Switch to ${preferredTheme() === 'dark' ? 'light' : 'dark'} theme`);

  label();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label);
  toggle.addEventListener('click', () => {
    root.dataset.theme = preferredTheme() === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem('saco-theme', root.dataset.theme); } catch {}
    label();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  carouselToggle?.addEventListener('click', () => {
    const paused = carouselToggle.getAttribute('aria-pressed') !== 'true';
    carouselToggle.setAttribute('aria-pressed', String(paused));
    carouselToggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} sponsor carousel`);
    carouselToggle.textContent = paused ? 'Play' : 'Pause';
    document.querySelector('.sponsor-carousel').dataset.paused = String(paused);
  });
}
