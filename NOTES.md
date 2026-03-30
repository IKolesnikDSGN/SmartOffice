# Заметки по проекту

## Модальное окно для кейсов

### Решение
Barba.js + нативный fetch/DOMParser (без htmx, без Ajax-плагинов)

### Контекст
Сайт девелопера коммерческой недвижимости. На странице каталога проектов карточки кейсов открываются в модальном окне.

Хардкод модалок не подходит: кейсов много, нужны SEO-индексируемые отдельные страницы и шеринг по прямой ссылке.

### Стек
- Webflow → WordPress + ACF Pro
- Barba.js — переходы между страницами
- Нативный fetch + DOMParser — загрузка контента кейса в модал

### WordPress шаблоны
- `archive-project.php` — каталог проектов
- `single-project.php` — полная страница кейса
- `single-project-partial.php` — без header/footer, для загрузки в модал

### Паттерн загрузки в модал
```js
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', async (e) => {
    e.preventDefault()
    const url = card.href
    const html = await fetch(url).then(r => r.text())
    const content = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-modal-content]')

    modal.querySelector('.modal-body').innerHTML = content.innerHTML
    modal.classList.add('is-open')
    history.pushState({}, '', url)
  })
})
```

При открытии модала URL обновляется через `history.pushState` — шеринг по прямой ссылке работает.

### Отклонённые варианты
- htmx — избыточен, нативный fetch справляется
- Swup Fragment Plugin — сложнее в настройке, нет явных преимуществ
- Хардкод модалок с ACF — не масштабируется, плохо для SEO
- Barba Parallel Plugin — не про модалки, только про параллельные анимации
