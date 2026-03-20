import { lineReveal } from './splitText.js';

export function initAccordion() {
  document.querySelectorAll('.accordion_component').forEach((item) => {
    const button = item.querySelector('.accordion_toggle_button');
    const content = item.querySelector('.accordion_content_wrap');
    if (!button || !content) return;

    const revealElements = content.querySelectorAll('[data-accordion-reveal]');
    const revealTimelines = new Map();

    button.addEventListener('click', () => {
      const isOpen = content.classList.contains('is_opened');

      if (isOpen) {
        content.classList.remove('is_opened');
        window.lenis?.resize();
      } else {
        content.classList.add('is_opened');
        requestAnimationFrame(() => {
          revealElements.forEach((el) => {
            if (!revealTimelines.has(el)) {
              const controller = lineReveal(el);
              revealTimelines.set(el, controller);
              controller.play();
            } else {
              revealTimelines.get(el)?.restart();
            }
          });
          window.lenis?.resize();
        });
      }
    });
  });
}
