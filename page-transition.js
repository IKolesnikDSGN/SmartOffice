// @ts-nocheck

export function initPageTransition() {
  const pageWrap = document.querySelector('.page_wrap');

  // Fade in on page load
  if (pageWrap) {
    gsap.fromTo(pageWrap, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }

  // Intercept all inter-page links except data-case-link
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.hasAttribute('data-case-link')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;

    // External links
    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
    } catch {
      return;
    }

    e.preventDefault();

    if (pageWrap) {
      gsap.to(pageWrap, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => { window.location.href = href; },
      });
    } else {
      window.location.href = href;
    }
  });
}
