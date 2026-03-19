// @ts-nocheck

/**
 * Измеряет ширину текста в пикселях через Canvas API.
 * @param {string} text
 * @param {string} font — CSS font string, например "600 48px Inter"
 * @returns {number}
 */
function measureTextWidth(text, font) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

/**
 * Извлекает CSS font string из DOM-элемента.
 * @param {Element} el
 * @returns {string}
 */
function getFontFromElement(el) {
  const s = window.getComputedStyle(el);
  return `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
}

/**
 * Применяет выравнивающие отступы к строкам trust_heading:
 *
 * — Строка 3: margin-right = 4.5 × средняя ширина буквы (сдвиг влево).
 *
 * — Строка 4: margin-right = 1.5 × средняя ширина одного символа
 *   (на основе текста этой же строки).
 */
export function initTrustHeading() {
  const heading = document.querySelector('.trust_heading');
  if (!heading) return;

  const lines = heading.querySelectorAll('.trust_h_line');
  if (lines.length < 4) return;

  const line3 = lines[2];
  const line4 = lines[3];

  const font3 = getFontFromElement(line3);
  const font4 = getFontFromElement(line4);

  const text3 = line3.textContent.trim();
  const text4 = line4.textContent.trim();

  const width3 = measureTextWidth(text3, font3);
  const width4 = measureTextWidth(text4, font4);

  // Строка 3: сдвигаем влево на 4.5 средней ширины буквы.
  const avgCharWidth3 = text3.length > 0 ? width3 / text3.length : 0;
  line3.style.marginRight = `${avgCharWidth3 * 8.5}px`;

  // Строка 4: отступ справа = 1.5 средней ширины буквы.
  const avgCharWidth4 = text4.length > 0 ? width4 / text4.length : 0;
  const marginLine4 = avgCharWidth4 * 1.5;
  line4.style.marginRight = `${marginLine4}px`;
}
