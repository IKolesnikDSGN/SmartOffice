/**
 * SplitText core animation
 * Splits an element into lines and returns a paused GSAP timeline.
 * Use in separate files to attach triggers or play conditions.
 *
 * @param {Element} element
 * @returns {gsap.core.Timeline}
 */
export function lineReveal(element) {
  let currentTl;
  let pendingPlay = false;

  gsap.set(element, { visibility: 'hidden' });

  SplitText.create(element, {
    type: 'lines',
    autoSplit: true,
    mask: 'lines',
    linesClass: 'line',
    onSplit(self) {
      currentTl?.kill();
      currentTl = gsap
        .timeline({ paused: true })
        .set(element, { visibility: 'visible' })
        .set(self.lines, { yPercent: 110 })
        .to(self.lines, {
          yPercent: 0,
          delay: 0.2,
          duration: 1,
          ease: 'expo.out',
          stagger: { each: 0.045 },
        });
      if (pendingPlay) {
        currentTl.play();
        pendingPlay = false;
      }
    },
  });

  return {
    restart() {
      gsap.set(element, { visibility: 'hidden' });
      if (currentTl) currentTl.restart();
      else pendingPlay = true;
    },
    play() {
      if (currentTl) currentTl.play();
      else pendingPlay = true;
    },
  };
}
