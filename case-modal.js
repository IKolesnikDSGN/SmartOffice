// @ts-nocheck

export function initCaseModal() {
  const modal = document.querySelector('.case_modal');
  if (!modal) return;

  const innerWrap = modal.querySelector('.casemodal_inner_wrap');
  const inner = modal.querySelector('.casemodal_inner');

  function openModal() {
    modal.classList.add('is_opened');
    if (innerWrap) innerWrap.classList.add('is_opened');
    window.lenis?.stop();
  }

  function closeModal() {
    modal.classList.remove('is_opened');
    if (innerWrap) innerWrap.classList.remove('is_opened');
    window.lenis?.start();
    // Clear content after transition ends to free memory
    modal.addEventListener('transitionend', () => {
      if (!modal.classList.contains('is_opened') && inner) inner.innerHTML = '';
    }, { once: true });
  }

  async function loadCase(url) {
    if (!inner) return;
    inner.innerHTML = '';
    modal.classList.add('is_loading');

    try {
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const content = doc.querySelector('[data-modal-content]');
      if (content) inner.innerHTML = content.innerHTML;
    } catch (err) {
      console.error('[CaseModal] fetch failed:', err);
    } finally {
      modal.classList.remove('is_loading');
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-case-link]');
    if (link) {
      e.preventDefault();
      // link.href works for <a> tags; for divs hero-offers.js sets href as attribute
      const url = link.href || link.getAttribute('href') || link.getAttribute('data-case-link');
      if (!url) return;
      loadCase(url).then(openModal);
      return;
    }

    if (e.target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }

    // Close on click outside casemodal_inner_wrap
    if (modal.classList.contains('is_opened') && innerWrap && !innerWrap.contains(e.target)) {
      closeModal();
    }
  });
}
