# SplitText

## Файлы

- `splitText.js` — утилита, экспортирует функцию `lineReveal(element)`
- `main.js` — entrypoint, подключается к Webflow как `type="module"`
- `hero-offers.js` — анимации секции hero с офферами (scroll-driven)
- `hero-scroll.js` — Lenis smooth scroll + класс `is_scrolled` на первом скролле
- `lenis.js` — инициализация Lenis, пишет инстанс в `window.lenis`

## Webflow: подключение

В Site Settings → **Before `</body>`**:

```html
<script type="module" src="YOUR_URL/main.js"></script>
```

В Site Settings → **Head**:

```html
<style>
  html:not(.gsap-not-found) [data-prevent-flicker='true'] { visibility: hidden; }
  .line-mask, .word-mask, .char-mask { padding-block: 0.1em; margin-block: -0.1em; }
</style>
<noscript><style>[data-prevent-flicker='true'] { visibility: visible !important; }</style></noscript>
```

GSAP + плагины (ScrollTrigger, SplitText) подключаются через Webflow Apps или CDN отдельно до main.js.

---

## hero-offers.js

Управляет scroll-driven анимацией трёх офферов в `.hero_layout` (700vh).

### Структура секции

- `.hero_layout` — скролл-контейнер, 700vh (делится на 3 равные части по ~233vh)
- `.hero_offers_wrap` — обёртка офферов + nav-бар
- `.hero_offer` × 3 — каждый оффер со своим визуалом, изображением, разделителем
- `.hero_offers_nav` — фиксированный nav-бар с текстом и кнопкой

### Как работает

**Инициализация** (до скролла):
- Все `.hero_offer_visual` получают `scale: 1.2` через `gsap.set` (важно: не CSS, иначе сломается при сбросе кэша)
- Офферы `[1]` и `[2]` скрыты через `gsap.set(offer, { clipPath: 'inset(100% 0% 0%)' })` (важно: не CSS, та же причина)
- Nav-бар синхронизируется с данными оффера `[0]` напрямую без анимации

**Scroll-анимации** (scrub):
- Каждый оффер в своём диапазоне: `[0]` → 0–33%, `[1]` → 33–66%, `[2]` → 66–100%
- `.hero_offer_visual`: `scale 1.2 → 1`
- `.hero_offer_divider`: `width 0 → 100%`

**Триггеры на границах**:
- На 33%: `revealOffer(1)` / `hideOffer(1)` + `animateNavUpdate(0)` при откате
- На 66%: `revealOffer(2)` / `hideOffer(2)` + `animateNavUpdate(1)` при откате

**revealOffer(i)**:
1. Новый оффер: `clipPath inset(100%) → inset(0%)`, длительность 1.2s
2. Новое изображение: `brightness 200% → 100%`
3. Предыдущее изображение: `brightness 100% → 20%`
4. Запуск `lineReveal` на элементах с `[data-offer-reveal="true"]`
5. Анимация nav-бара (`animateNavUpdate`)

**animateNavUpdate(i)**:
- Читает данные из скрытого `.hero_offers_nav-content.hide` внутри оффера `[i]`
- Fade-out текстов → swap textContent → slide-up reveal (`revealNavText`)
- Кнопка: замер ширины до/после смены текста → `gsap.fromTo(width)` → `clearProps`

### Атрибуты в Webflow

| Атрибут | Где ставить | Назначение |
|---|---|---|
| `hero-nav-address` | внутри `.hero_offers_nav-content.hide` и nav | адрес оффера |
| `hero-nav-text1` | то же | первый текст |
| `hero-nav-text2` | то же | второй текст |
| `hero-nav-btn` | то же | текст кнопки |
| `data-offer-reveal="true"` | текстовые элементы внутри `.hero_offer` | запускает `lineReveal` при появлении оффера |

### Важные ограничения

- Начальные состояния (`clipPath`, `scale`) **обязательно** через `gsap.set`, не через CSS — иначе ломается при сбросе кэша (CSS может загрузиться позже GSAP)
- `revealNavText` использует ручной `overflow: hidden` вместо SplitText — GSAP SplitText перезаписывает `innerHTML` при повторных вызовах, что сбрасывает новый текст

---

## lineReveal(element)

Разбивает элемент на строки и возвращает **paused** GSAP timeline.

```js
import { lineReveal } from "./splitText.js";

const tl = lineReveal(element);
tl.play();      // запустить
tl.restart();   // перезапустить
```

### Текущие параметры анимации

| Параметр | Значение |
|---|---|
| `yPercent` | 110 |
| `delay` | 0.2s |
| `duration` | 0.8s |
| `ease` | expo.out |
| `stagger.each` | 0.045s |

### Атрибуты в Webflow

- `data-line-reveal="true"` — на текстовом элементе
- `data-prevent-flicker="true"` — скрывает текст до инициализации (опционально)

---

## Варианты триггеров

### По клику

```js
trigger.addEventListener("click", () => tl.restart());
```

### ScrollTrigger

```js
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  onEnter: () => tl.play(),
  onLeaveBack: () => tl.restart().pause(),
});
```

### По событию (например, после другой анимации)

```js
someTimeline.add(() => tl.play());
```
