import { lineReveal } from './splitText.js';

export function initAccordion() {
  document.querySelectorAll('.accordion_component').forEach((item) => {
    const button = item.querySelector('.accordion_toggle_button');
    const content = item.querySelector('.accordion_content_wrap');
    if (!button || !content) return;

    const revealElements = content.querySelectorAll('[data-accordion-reveal]');
    const revealTimelines = new Map();

    let debounceTimer = null;
    let observer = null;

    button.addEventListener('click', () => {
      const opening = !content.classList.contains('is_opened');
      content.classList.toggle('is_opened');

      if (observer) {
        observer.disconnect();
        clearTimeout(debounceTimer);
      }

      observer = new ResizeObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          observer.disconnect();
          observer = null;

          window.lenis?.resize();

          if (opening) {
            revealElements.forEach((el) => {
              if (!revealTimelines.has(el)) {
                const controller = lineReveal(el);
                revealTimelines.set(el, controller);
                controller.play();
              } else {
                revealTimelines.get(el)?.restart();
              }
            });
          }
        }, 50);
      });

      observer.observe(content);
    });
  });
}
