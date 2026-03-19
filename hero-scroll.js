// @ts-nocheck
import { initLenis } from './lenis.js';


document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  window.lenis.stop();

  setTimeout(() => {
    window.lenis.start();

    function onFirstScroll() {
      const heroLayout = document.querySelector('.hero_layout');
      if (heroLayout) {
        heroLayout.querySelectorAll('[data-hero-scrolled]').forEach((el) => {
          el.classList.add('is_scrolled');
        });
      }

      const navComponent = document.querySelector('.nav_component');
      if (navComponent) {
        navComponent.querySelectorAll('[nav-scrolled]').forEach((el, i) => {
          setTimeout(() => el.classList.remove('is_scrolled'), i * 120);
        });

        const letterEls = navComponent.querySelectorAll('[nav-scrolled-letter]');
        if (letterEls.length) {
          gsap.to(letterEls, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.025,
            ease: 'power2.out',
          });
        }
      }

      window.removeEventListener('wheel', onFirstScroll);
      window.removeEventListener('touchmove', onFirstScroll);
    }

    window.addEventListener('wheel', onFirstScroll, { passive: true });
    window.addEventListener('touchmove', onFirstScroll, { passive: true });
  }, 2000);
});
