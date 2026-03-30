// @ts-nocheck

export function initNavMenu() {
  const navContain = document.querySelector('.nav_contain');
  if (!navContain) return;

  const triggerWrap  = document.querySelector('.nav_trigger_wrap');
  const backdrop     = document.querySelector('.nav_menu_backdrop');
  const footer       = document.querySelector('#footer');
  const svgPath      = triggerWrap?.querySelector('path');

  const STATE1_D = 'M10.5 9H0V8H10.5V9ZM10.5 5H0V4H10.5V5ZM10.5 1H0V0H10.5V1Z';
  const STATE2_D = 'M10.5 5H0V4H10.5V5ZM10.5';

  const scrollClassEls = [
    navContain.querySelector('.nav_desktop_logo'),
    navContain.querySelector('.nav_id_text-wrap'),
    navContain.querySelector('.burger_icon'),
  ].filter(Boolean);

  // State
  let isOpen           = false;
  let openSource       = null;
  let scrollCalls      = [];
  let scrollDelayedOpen = null;

  // ─── SplitText — split once, no autoSplit to prevent line re-creation ────
  // autoSplit:true would rebuild line elements when navContain resizes during
  // animation, causing allLines to reference detached DOM nodes on 2nd+ open.

  const revealEls = [...navContain.querySelectorAll('[data-menu-reveal]')];
  const allLines  = [];

  revealEls.forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      autoSplit: false,
      mask: 'lines',
      linesClass: 'line',
      onSplit(self) {
        allLines.push(...self.lines);
      },
    });
    gsap.set(el, { visibility: 'visible' });
  });

  // Pre-hide lines behind mask so they're invisible in closed state
  if (allLines.length) gsap.set(allLines, { yPercent: 110 });

  // ─── Container timeline (size only) — reversed on close ──────────────────
  // Desktop: animate width + height. Mobile: height only (width stays as-is).

  let tl;

  gsap.matchMedia().add(
    {
      desktop: '(min-width: 768px)',
      mobile:  '(max-width: 767px)',
    },
    (ctx) => {
      const { desktop } = ctx.conditions;
      tl = gsap
        .timeline({ paused: true })
        .to(
          navContain,
          {
            ...(desktop ? { width: '24rem' } : {}),
            height: 'auto',
            duration: 0.8,
            ease: 'expo.inOut',
          },
          0
        );
      return () => { tl?.kill(); tl = null; };
    }
  );

  // ─── Open / Close ─────────────────────────────────────────────────────────

  function openMenu(source) {
    if (isOpen) return;
    isOpen     = true;
    openSource = source;

    // Container
    tl?.play();

    // Text: explicit fromTo so it's fresh on every open regardless of prior state
    if (allLines.length) {
      gsap.killTweensOf(allLines);
      gsap.set(allLines, { yPercent: 110 });
      gsap.to(allLines, {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        delay: 0.35,
        stagger: { each: 0.045 },
      });
    }

    if (source === 'click') {
      if (svgPath) gsap.to(svgPath, { morphSVG: STATE2_D, duration: 0.5, ease: 'expo.out' });
      if (backdrop) gsap.to(backdrop, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      window.lenis?.stop();
    }

    if (source === 'scroll') {
      const ctaBtn = document.querySelector('.nav_cta_btn');
      const els = ctaBtn ? [...scrollClassEls, ctaBtn] : scrollClassEls;
      els.slice().reverse().forEach((el, i) => {
        const call = gsap.delayedCall(i * 0.08, () => el.classList.add('is_footer'));
        scrollCalls.push(call);
      });
    }
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    const source = openSource;
    openSource   = null;

    // Container
    tl?.reverse();

    // Text: slide back behind mask
    if (allLines.length) {
      gsap.killTweensOf(allLines);
      gsap.to(allLines, {
        yPercent: 110,
        duration: 0.5,
        ease: 'expo.in',
        stagger: { each: 0.025, from: 'end' },
      });
    }

    if (source === 'click') {
      if (svgPath) gsap.to(svgPath, { morphSVG: STATE1_D, duration: 0.5, ease: 'expo.out' });
      if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.4, ease: 'power2.in' });
      window.lenis?.start();
    }

    if (source === 'scroll') {
      scrollCalls.forEach((c) => c.kill());
      scrollCalls = [];
      const ctaBtn = document.querySelector('.nav_cta_btn');
      [...scrollClassEls, ...(ctaBtn ? [ctaBtn] : [])].forEach((el) => el.classList.remove('is_footer'));
    }
  }

  // ─── Click trigger ────────────────────────────────────────────────────────

  if (triggerWrap) {
    triggerWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) closeMenu();
      else openMenu('click');
    });
  }

  // Close on click outside — only when menu was opened by click
  document.addEventListener('click', (e) => {
    if (isOpen && openSource === 'click' && !navContain.contains(e.target)) {
      closeMenu();
    }
  });

  // ─── Scroll trigger ───────────────────────────────────────────────────────
  // Fires when the TOP of #footer reaches the BOTTOM of .nav_contain.

  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: () => `top ${navContain.getBoundingClientRect().bottom}`,
      onEnter: () => {
        scrollDelayedOpen = gsap.delayedCall(0.5, () => openMenu('scroll'));
      },
      onLeaveBack: () => {
        if (scrollDelayedOpen) { scrollDelayedOpen.kill(); scrollDelayedOpen = null; }
        closeMenu();
      },
    });
  }
}
