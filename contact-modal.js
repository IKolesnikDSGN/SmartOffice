// @ts-nocheck

export function initContactModal() {
  const modal = document.querySelector('.contact_modal');
  if (!modal) return;

  const wrap = modal.querySelector('.contact_wrap');

  function openModal() {
    modal.classList.add('is_opened');
    if (wrap) wrap.classList.add('is_opened');
    window.lenis?.stop();
  }

  function closeModal() {
    modal.classList.remove('is_opened');
    if (wrap) wrap.classList.remove('is_opened');
    window.lenis?.start();
  }

  // Open on [data-modal]
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal]')) {
      openModal();
      return;
    }

    // Close on [data-modal-close]
    if (e.target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }

    // Close on click outside .contact_wrap
    if (modal.classList.contains('is_opened') && wrap && !wrap.contains(e.target)) {
      closeModal();
    }
  });
}
