export function initDrawSvg() {
  const elements = document.querySelectorAll('[data-draw]');
  if (!elements.length) return;

  elements.forEach((el) => {
    const paths = el.querySelectorAll('path, line, polyline, circle, rect, ellipse');
    if (!paths.length) return;

    const reverse = el.dataset.draw === 'reverse';

    gsap.set(paths, { drawSVG: reverse ? '100% 100%' : '0%' });

    gsap.to(paths, {
      drawSVG: reverse ? '100% 0%' : '100%',
      ease: 'none',
      stagger: { each: 0.15 },
      scrollTrigger: {
        trigger: el,
        start: 'top 50%',
        end: 'bottom 10%',
        scrub: true,
      },
    });
  });
}
