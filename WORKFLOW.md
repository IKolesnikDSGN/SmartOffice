# SmartOffice — Workflow

## Структура

Скрипты хранятся в этом репозитории и подключаются к Webflow через jsDelivr CDN.

**GitHub:** `https://github.com/IKolesnikDSGN/SmartOffice`
**CDN base:** `https://cdn.jsdelivr.net/gh/IKolesnikDSGN/SmartOffice@main/`

---

## Подключение в Webflow

### Head
```html
<script>
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
</script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"></script>
```

### Footer
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/IKolesnikDSGN/SmartOffice@main/main.js"></script>
```

---

## Обновление кода

### Через Claude Code (рекомендуется)
Вносишь изменения в файлы → говоришь "запушь изменения" → Claude делает коммит и пуш.

### Вручную из терминала
```bash
git add .
git commit -m "описание что изменил"
git push
```

---

## Сброс кеша jsDelivr

После каждого пуша jsDelivr может отдавать старую версию файла до 24 часов.
Чтобы обновить мгновенно — открой в браузере:

```
https://purge.jsdelivr.net/gh/IKolesnikDSGN/SmartOffice@main/main.js
```

Для каждого изменённого файла отдельно, например:
```
https://purge.jsdelivr.net/gh/IKolesnikDSGN/SmartOffice@main/hero-scroll.js
https://purge.jsdelivr.net/gh/IKolesnikDSGN/SmartOffice@main/nav-menu.js
```

---

## Добавление нового файла

1. Создай файл в папке проекта
2. Импортируй его в `main.js`:
```js
import { initNewFeature } from './new-feature.js';
```
3. Запушь изменения
4. Сбрось кеш для `main.js` и нового файла
