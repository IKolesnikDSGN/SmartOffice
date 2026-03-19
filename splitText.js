/**
 * SplitText core animation
 * Splits an element into lines and returns a paused GSAP timeline.
 * Use in separate files to attach triggers or play conditions.
 *
 * @param {Element} element
 * @returns {gsap.core.Timeline}
 */
export function lineReveal(element) {
  let tl;

  SplitText.create(element, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
    linesClass: "line",
    onSplit(self) {
      tl = gsap
        .timeline({ paused: true })
        .from(self.lines, {
          yPercent: 110,
          delay: 0.2,
          duration: 1,
          ease: "expo.out",
          stagger: { each: 0.045 },
        });
      return tl;
    },
  });

  gsap.set(element, { visibility: "visible" });

  return tl;
}
