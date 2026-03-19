// @ts-nocheck

export function initContactModal() {
  console.log('[modal] initContactModal called');

  const modal = document.querySelector('.contact_modal');
  console.log('[modal] .contact_modal:', modal);
  if (!modal) return;

  const wrap = modal.querySelector('.contact_wrap');
  console.log('[modal] .contact_wrap:', wrap);

  function openModal() {
    console.log('[modal] openModal');
    modal.classList.add('is_opened');
    if (wrap) wrap.classList.add('is_opened');
    window.lenis?.stop();
  }

  function closeModal() {
    console.log('[modal] closeModal');
    modal.classList.remove('is_opened');
    if (wrap) wrap.classList.remove('is_opened');
    window.lenis?.start();
  }

  // Open on [data-modal]
  document.addEventListener('click', (e) => {
    console.log('[modal] click target:', e.target);

    if (e.target.closest('[data-modal]')) {
      console.log('[modal] trigger hit:', e.target.closest('[data-modal]'));
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
