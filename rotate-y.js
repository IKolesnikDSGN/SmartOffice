export function initRotateY() {
  const containers = document.querySelectorAll('[data-rotate-container]');
  if (!containers.length) return;

  containers.forEach((container) => {
    const elements = container.querySelectorAll('[data-rotate]');
    if (!elements.length) return;

    gsap.set(elements, { rotateY: 0, transformPerspective: 800 });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 60%',
      once: false,
      onEnter: () => {
        gsap.to(elements, {
          rotateY: 180,
          duration: 1.2,
          ease: 'expo.inOut',
          stagger: { each: 0.1 },
        });
      },
    });
  });
}
