import './hero-scroll.js';
import { initTrustHeading } from './trust-heading.js';
import { initHeroOffers } from './hero-offers.js';
import { initPageLoading } from './page-loading.js';
import { initNavMenu } from './nav-menu.js';
import { initParallax } from './parallax.js';
import { initFooterSvg } from './footer-svg.js';
import { initContactModal } from './contact-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoading();
  initTrustHeading();
  initHeroOffers();
  initNavMenu();
  initParallax();
  initFooterSvg();
  initContactModal();
});
