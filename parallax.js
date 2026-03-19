export function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  function updateParallax() {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // progress: 0 when element bottom enters viewport, 1 when element top leaves viewport
      const progress = 1 - (rect.bottom / (viewportHeight + rect.height));
      const clamped = Math.min(Math.max(progress, 0), 1);

      // map progress 0→1 to translateY -10%→10%
      const translateY = -10 + clamped * 20;

      const inner = el.firstElementChild;
      if (inner) {
        inner.style.transform = `translateY(${translateY}%)`;
        inner.style.willChange = 'transform';
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  updateParallax();
}
