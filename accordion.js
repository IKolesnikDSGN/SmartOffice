export function initAccordion() {
  document.querySelectorAll('.accordion_component').forEach((item) => {
    const button = item.querySelector('.accordion_toggle_button');
    const content = item.querySelector('.accordion_content_wrap');
    if (!button || !content) return;

    const revealElements = content.querySelectorAll('[data-accordion-reveal]');
    const splits = new Map();

    button.addEventListener('click', () => {
      const opening = !content.classList.contains('is_opened');
      content.classList.toggle('is_opened');

      revealElements.forEach((el, i) => {
        if (!splits.has(el)) {
          const split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line',
          });
          gsap.set(el, { visibility: 'visible' });
          gsap.set(split.lines, { yPercent: 110 });
          splits.set(el, split);
        }

        const { lines } = splits.get(el);
        const isLast = i === revealElements.length - 1;

        gsap.killTweensOf(lines);

        if (opening) {
          gsap.to(lines, {
            yPercent: 0,
            delay: 0.2,
            duration: 1,
            ease: 'expo.out',
            stagger: { each: 0.045 },
            onComplete: isLast ? () => window.lenis?.resize() : undefined,
          });
        } else {
          gsap.to(lines, {
            yPercent: 110,
            duration: 0.6,
            ease: 'expo.in',
            stagger: { each: 0.03, from: 'end' },
            onComplete: isLast ? () => window.lenis?.resize() : undefined,
          });
        }
      });
    });
  });
}
