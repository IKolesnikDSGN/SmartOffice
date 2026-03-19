// @ts-nocheck

export function initFooterSvg() {
  const navContain = document.querySelector('.nav_contain');
  const footer     = document.querySelector('#footer');
  const footerLayout = document.querySelector('.footer_layout');

  if (!navContain || !footer || !footerLayout) return;

  const leftEls  = [...footerLayout.querySelectorAll('.u-svg.left [nav-scrolled-letter]')];
  const rightEls = [...footerLayout.querySelectorAll('.u-svg.right [nav-scrolled-letter]')];

  if (!leftEls.length && !rightEls.length) return;

  // Set initial state
  gsap.set(leftEls,  { opacity: 0, filter: 'blur(2px)', xPercent: -20 });
  gsap.set(rightEls, { opacity: 0, filter: 'blur(2px)', xPercent: 20 });

  function animateIn() {
    gsap.killTweensOf([...leftEls, ...rightEls]);
    const base = { opacity: 1, filter: 'blur(0px)', xPercent: 0, duration: 0.8, ease: 'expo.out' };
    if (leftEls.length)  gsap.to(leftEls,  { ...base, stagger: { each: 0.05, from: 'end' } });
    if (rightEls.length) gsap.to(rightEls, { ...base, stagger: { each: 0.05, from: 'start' } });
  }

  function animateOut() {
    gsap.killTweensOf([...leftEls, ...rightEls]);
    if (leftEls.length)  gsap.to(leftEls,  { opacity: 0, filter: 'blur(2px)', xPercent: -20, duration: 0.4, ease: 'expo.out' });
    if (rightEls.length) gsap.to(rightEls, { opacity: 0, filter: 'blur(2px)', xPercent: 20,  duration: 0.4, ease: 'expo.out' });
  }

  ScrollTrigger.create({
    trigger: footer,
    start: () => `top ${navContain.getBoundingClientRect().bottom}`,
    onEnter:    () => animateIn(),
    onLeaveBack: () => animateOut(),
  });
}
