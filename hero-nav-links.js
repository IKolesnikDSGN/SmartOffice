// @ts-nocheck

export function initHeroNavLinks() {
  const source = document.querySelector('[data-pagelinks]');
  const target = document.querySelector('.hero_nav_links');
  if (!source || !target) return;

  const links = source.querySelectorAll('a');
  links.forEach((link) => {
    const clone = document.createElement('a');
    clone.href = link.href;
    clone.textContent = link.textContent.trim();
    clone.className = 'hero_nav_link u-text-style-x-small';
    clone.setAttribute('data-loading-reveal', '');
    target.appendChild(clone);
  });
}
