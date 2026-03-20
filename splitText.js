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

  SplitText.create(element, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
    linesClass: "line",
    onSplit(self) {
      currentTl = gsap
        .timeline({ paused: true })
        .from(self.lines, {
          yPercent: 110,
          delay: 0.2,
          duration: 1,
          ease: "expo.out",
          stagger: { each: 0.045 },
        });
      if (pendingPlay) {
        currentTl.play();
        pendingPlay = false;
      }
      return currentTl;
    },
  });

  gsap.set(element, { visibility: "visible" });

  return {
    restart() {
      if (currentTl) currentTl.restart();
      else pendingPlay = true;
    },
    play() {
      if (currentTl) currentTl.play();
      else pendingPlay = true;
    },
  };
}
