// @ts-nocheck

export function initPageLoading() {
  const navComponent = document.querySelector('.nav_component');
  const logoWrap = navComponent?.querySelector('.logo_wrap');
  const loadingLogo = document.querySelector('.page_loading_logo');
  const loadingOverlay = document.querySelector('.page_loading_overlay');
  const navDesktopLogo = document.querySelector('.nav_desktop_logo');
  const heroInfo = document.querySelector('.hero_info');

  if (!logoWrap || !loadingLogo || !loadingOverlay || !navDesktopLogo) return;

  const navEntry = performance.getEntriesByType('navigation')[0];
  // Hard reload (Cmd+Shift+R) bypasses cache → full network fetch → transferSize > 0
  // Soft reload (Cmd+R) serves from cache → transferSize === 0
  const isHardReload = navEntry?.type === 'reload' && navEntry?.transferSize > 0;
  const hasAnimated = sessionStorage.getItem('pageLoadingDone');

  if (hasAnimated && !isHardReload) {
    // Soft reload → show final state immediately
    gsap.set(loadingOverlay, { autoAlpha: 0 });
    if (heroInfo) {
      heroInfo.querySelectorAll('[data-loading-reveal]').forEach((el) => {
        gsap.set(el, { visibility: 'visible' });
      });
    }
    return;
  }

  sessionStorage.setItem('pageLoadingDone', '1');

  // ── First visit / cache reset: run loading animation ─────────────────────

  // Move logo_wrap into loading container and hide it
  loadingLogo.appendChild(logoWrap);
  gsap.set(logoWrap, { opacity: 0 });

  // Hide letters for stagger reveal
  const leftLetters = logoWrap.querySelectorAll('.u-svg.left [nav-scrolled-letter]');
  const rightLetters = logoWrap.querySelectorAll('.u-svg.right [nav-scrolled-letter]');
  gsap.set(leftLetters, { opacity: 0, xPercent: -10, filter: 'blur(2px)' });
  gsap.set(rightLetters, { opacity: 0, xPercent: 10, filter: 'blur(2px)' });

  const tl = gsap.timeline();

  // Phase 1 (0.3s): fade in logo_wrap
  tl.to(logoWrap, { opacity: 1, duration: 0.3, ease: 'power2.out' });

  // Phase 2 (0.5s): reveal letters with stagger — left from end, right from start
  tl.fromTo(leftLetters,
    { opacity: 0, xPercent: -20, filter: 'blur(2px)' },
    { opacity: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', stagger: { each: 0.05, from: 'end' } }
  );
  tl.fromTo(rightLetters,
    { opacity: 0, xPercent: 20, filter: 'blur(2px)' },
    { opacity: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', stagger: { each: 0.05, from: 'start' } },
    '<'
  );

  // Phase 3 (0.8s): GSAP Flip — move logo_wrap to nav_desktop_logo
  tl.add(() => {
    const state = Flip.getState(logoWrap);
    navDesktopLogo.appendChild(logoWrap);
    Flip.from(state, { duration: 1, ease: 'expo.inOut' });
  });

  // +0.5s after Flip starts: fade out overlay
  tl.to(loadingOverlay, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, '+=0.35');

  // Simultaneously: reveal [data-loading-reveal] texts inside hero_info
  // Split all elements via SplitText, collect all lines into one array,
  // then animate with a single fromTo so stagger is global across all text blocks
  tl.add(() => {
    if (!heroInfo) return;
    const revealEls = [...heroInfo.querySelectorAll('[data-loading-reveal]')];
    const allLines = [];

    revealEls.forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        autoSplit: true,
        mask: 'lines',
        linesClass: 'line',
        onSplit(self) {
          allLines.push(...self.lines);
        },
      });
      gsap.set(el, { visibility: 'visible' });
    });

    if (allLines.length) {
      gsap.fromTo(
        allLines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.4, ease: 'expo.out', delay: 0.2, stagger: { each: 0.055 } }
      );
    }
  }, '<');
}
