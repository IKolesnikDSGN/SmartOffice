// @ts-nocheck
import { lineReveal } from './splitText.js';

export function initHeroOffers() {
  const heroLayout = document.querySelector('.hero_layout');
  if (!heroLayout) return;

  const offersWrap = document.querySelector('.hero_offers_wrap');
  if (!offersWrap) return;

  const offers = [...offersWrap.querySelectorAll('.hero_offer')];
  if (offers.length === 0) return;

  const nav = offersWrap.querySelector('.hero_offers_nav');


  // ─── Initial setup ─────────────────────────────────────────────────────────

  // Set initial scale for all offer visuals (scrub will animate to 1)
  // Set initial clip-path: offer[0] always visible, rest hidden below
  offers.forEach((offer, i) => {
    const visual = offer.querySelector('.hero_offer_visual');
    if (visual) gsap.set(visual, { scale: 1.2 });
    if (i > 0) gsap.set(offer, { clipPath: 'inset(100% 0% 0%)' });
  });

  // Sync nav-bar text with offer[0] data on init (no animation)
  syncNavDirect(0);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Instantly set nav text from the hidden nav-content of a given offer index.
   * Used for initialization only.
   */
  function syncNavDirect(index) {
    const src = offers[index]?.querySelector('.hero_offers_nav-content.hide');
    if (!src || !nav) return;

    const targets = getNavTargets();
    if (targets.address) targets.address.textContent = src.querySelector('[hero-nav-address]')?.textContent ?? '';
    if (targets.text1) targets.text1.textContent = src.querySelector('[hero-nav-text1]')?.textContent ?? '';
    if (targets.text2) targets.text2.textContent = src.querySelector('[hero-nav-text2]')?.textContent ?? '';
    if (targets.btnText) {
      const label = src.querySelector('[hero-nav-btn]')?.textContent?.trim() ?? '';
      targets.btnText.textContent = label;
      if (targets.btn) targets.btn.setAttribute('aria-label', label);
    }
  }

  /** Collect the live nav DOM references. */
  function getNavTargets() {
    if (!nav) return {};
    const btnWrap = nav.querySelector('[hero-nav-btn]');
    return {
      address: nav.querySelector('[hero-nav-address]'),
      text1: nav.querySelector('[hero-nav-text1]'),
      text2: nav.querySelector('[hero-nav-text2]'),
      btnWrap,
      btnText: btnWrap?.querySelector('.button_main_text'),
      btn: btnWrap?.querySelector('button'),
    };
  }

  /**
   * Slide a nav text element up with a manual overflow mask.
   * SplitText is intentionally avoided here: GSAP's internal SplitText
   * registry auto-reverts saved innerHTML on repeat calls to SplitText.create,
   * overwriting freshly set textContent with the previous offer's text.
   */
  function revealNavText(el, text, delay = 0) {
    el.innerHTML = `<span class="nav-reveal-inner" style="display:block">${text}</span>`;
    gsap.set(el, { overflow: 'hidden', opacity: 1 });
    gsap.fromTo(
      el.querySelector('.nav-reveal-inner'),
      { yPercent: 110 },
      { yPercent: -5, duration: 0.8, ease: 'expo.out', delay }
    );
  }

  /**
   * Animate nav bar update: fade-out → swap content → reveal.
   * @param {number} index - source offer index
   */
  function animateNavUpdate(index) {
    const src = offers[index]?.querySelector('.hero_offers_nav-content.hide');
    if (!src || !nav) return;

    const t = getNavTargets();
    const textEls = [t.address, t.text1, t.text2].filter(Boolean);

    gsap.killTweensOf([...textEls, t.btnText].filter(Boolean));

    gsap.to([...textEls, t.btnText].filter(Boolean), {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        const addrText  = src.querySelector('[hero-nav-address]')?.textContent ?? '';
        const text1Text = src.querySelector('[hero-nav-text1]')?.textContent ?? '';
        const text2Text = src.querySelector('[hero-nav-text2]')?.textContent ?? '';
        const label     = src.querySelector('[hero-nav-btn]')?.textContent?.trim() ?? '';

        if (t.address) revealNavText(t.address, addrText,  0);
        if (t.text1)   revealNavText(t.text1,   text1Text, 0.05);
        if (t.text2)   revealNavText(t.text2,   text2Text, 0.1);

        if (t.btnText) {
          const btnEl = t.btnWrap?.querySelector('.button_main_element');
          const oldWidth = btnEl ? btnEl.offsetWidth : null;

          t.btnText.textContent = label;
          if (t.btn) t.btn.setAttribute('aria-label', label);

          if (btnEl && oldWidth !== null) {
            const newWidth = btnEl.offsetWidth;
            gsap.fromTo(btnEl,
              { width: oldWidth },
              { width: newWidth, duration: 0.65, ease: 'expo.inOut', onComplete: () => gsap.set(btnEl, { clearProps: 'width' }) }
            );
          }

          gsap.fromTo(
            t.btnText,
            { opacity: 0, yPercent: 60 },
            { opacity: 1, yPercent: 0, duration: 0.6, ease: 'expo.out', delay: 0.15 }
          );
        }
      },
    });
  }

  /**
   * Reveal an offer: clip-path wipe + data-offer-reveal texts + nav update.
   * @param {number} index
   */
  function revealOffer(index) {
    const offer = offers[index];
    if (!offer) return;

    // New offer: brightness 120% → 100%
    const image = offer.querySelector('.hero_offer_image');
    if (image) gsap.fromTo(image, { filter: 'brightness(200%)' }, { filter: 'brightness(100%)', duration: 0.6, ease: 'power1.inOut' });

    // Previous offer: brightness 100% → 20%
    const prevImage = offers[index - 1]?.querySelector('.hero_offer_image');
    if (prevImage) gsap.fromTo(prevImage, { filter: 'brightness(100%)' }, { filter: 'brightness(20%)', duration: 0.8, ease: 'power1.inOut' });

    gsap.to(offer, {
      clipPath: 'inset(0% 0% 0%)',
      duration: 1.2,
      ease: 'expo.out',
    });

    offer.querySelectorAll('[data-offer-reveal="true"]').forEach((el) => {
      const tl = lineReveal(el);
      if (tl) tl.play();
    });

    animateNavUpdate(index);
  }

  /**
   * Hide an offer back behind clip-path.
   * @param {number} index
   */
  function hideOffer(index) {
    const offer = offers[index];
    if (!offer) return;

    // Hiding offer: brightness back to 120% (will re-reveal from there next time)
    const image = offer.querySelector('.hero_offer_image');
    if (image) gsap.to(image, { filter: 'brightness(120%)', duration: 1.2, ease: 'power1.inOut' });

    // Previous offer: restore brightness 20% → 100%
    const prevImage = offers[index - 1]?.querySelector('.hero_offer_image');
    if (prevImage) gsap.fromTo(prevImage, { filter: 'brightness(20%)' }, { filter: 'brightness(100%)', duration: 1.2, ease: 'power1.inOut' });

    gsap.to(offer, {
      clipPath: 'inset(100% 0% 0%)',
      duration: 1.5,
      ease: 'expo.out',
    });
  }

  // ─── ScrollTrigger animations ──────────────────────────────────────────────
  // hero_layout is 700vh → thirds at 233.33vh and 466.67vh from its top.
  // All positions use "top+=Xvh top": the point Xvh below hero_layout's top
  // reaching the viewport top.

  // Positions as % of hero_layout's height (700vh → 33.33% = 233.33vh).
  // ScrollTrigger parses vh as px, so % is the reliable unit here.
  const T1 = 'top+=28% top'; // 1/3 boundary
  const T2 = 'top+=56% top'; // 2/3 boundary

  // Each segment: which offer to animate + its scroll range.
  // Segments[i] maps to offers[i].
  const segments = [
    { start: 'top top', end: T1 },
    { start: T1,        end: T2 },
    { start: T2,        end: 'bottom top' },
  ];

  // ── Per-offer: visual scale + divider width (scrub) ───────────────────────
  offers.forEach((offer, i) => {
    const { start, end } = segments[i];
    const scrollConfig = { trigger: heroLayout, start, end, scrub: true };

    gsap.to(offer.querySelector('.hero_offer_visual'), {
      scale: 1,
      ease: 'none',
      scrollTrigger: scrollConfig,
    });

    gsap.to(offer.querySelector('.hero_offer_divider'), {
      width: '100%',
      ease: 'none',
      scrollTrigger: scrollConfig,
    });
  });

  // ── Reveal/hide triggers at segment boundaries ────────────────────────────
  // boundaries[i]: reveal offers[i+1] when crossing, restore offers[i] on back.
  const boundaries = [
    { start: T1, revealIndex: 1, prevNavIndex: 0 },
    { start: T2, revealIndex: 2, prevNavIndex: 1 },
  ];

  boundaries.forEach(({ start, revealIndex, prevNavIndex }) => {
    ScrollTrigger.create({
      trigger: heroLayout,
      start,
      onEnter:    () => revealOffer(revealIndex),
      onLeaveBack: () => {
        hideOffer(revealIndex);
        animateNavUpdate(prevNavIndex);
      },
    });
  });
}
