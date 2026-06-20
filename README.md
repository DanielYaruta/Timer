# ⏱ Стадионный таймер (React + Vite)

[**🔗 Демо на GitHub Pages**](https://danielyaruta.github.io/Timer/)

Круговой таймер обратного отсчёта в стиле механического секундомера. Та же визуальная задумка, что и в исходной ванильной версии, но логика переписана на **React** (`useState` + `useEffect`) и собирается через **Vite**.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## Что умеет

- **Обратный отсчёт** от заданного количества минут (от 1 до 99).
- **Круговой прогресс-бар**, который плавно сокращается по мере истечения времени.
- **Одна кнопка на старт/паузу/продолжение**.
- **Сброс** в любой момент, даже во время отсчёта.
- **Статусы**: `готов`, `идёт отсчёт`, `пауза`, `время вышло` — с пульсирующим индикатором во время работы.
- **Деления по кругу**, как на настоящем секундомере: каждое пятое — длиннее и красное.
- Фон со стадионом и «стеклянная» карточка таймера поверх него.

## Стек

- React 18 (функциональный компонент, хуки)
- Vite 5 (dev-сервер и сборка)
- Чистый CSS, без UI-библиотек

## Локальный запуск

```bash
npm install      # поставить зависимости
npm run dev      # запустить dev-сервер (адрес покажет в консоли)
```

## Сборка

```bash
npm run build    # собирает прод-версию в папку dist/
npm run preview  # локально посмотреть собранную версию
```

## Деплой на GitHub Pages

Через пакет `gh-pages` (уже в зависимостях):

```bash
npm run deploy
```

Команда соберёт проект и запушит содержимое `dist/` в ветку `gh-pages`.
В настройках репозитория (**Settings → Pages**) источником должна быть ветка `gh-pages`, папка `/ (root)`.

> ⚠️ Важно: `base` в `vite.config.js` должен совпадать с именем репозитория.
> Сейчас стоит `/Timer/` — под `https://danielyaruta.github.io/Timer/`.
> Переименуешь репозиторий — поменяй и `base`.

## Структура

```
timer-react/
├── index.html          # точка входа Vite
├── package.json
├── vite.config.js      # здесь base для GitHub Pages
└── src/
    ├── main.jsx        # монтирует App, подключает стили
    ├── App.jsx         # сам компонент таймера
    ├── index.css       # все стили
    └── StadiumBG.jpg   # фон
```
