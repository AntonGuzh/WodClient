# WoD Character Sheet

Настольное приложение для ведения листов персонажей Vampire: The Masquerade / World of Darkness.

Проект сделан как Python-приложение с окном `pywebview`: Python хранит и обрабатывает данные персонажа, а интерфейс находится в HTML/CSS/JavaScript в папке `static/`.

## Что умеет приложение

- Показывает список сохраненных персонажей.
- Создает нового персонажа.
- Открывает и редактирует лист персонажа.
- Сохраняет данные персонажей в JSON.
- Поддерживает базовые трекеры характеристик, навыков, голода, человечности и силы крови.
- Позволяет вести здоровье, волю, пятна человечности, преимущества, специализации навыков, клан и дисциплины.
- Делает броски d10 с учетом костей голода.
- Подгружает справочные данные по кланам и дисциплинам из JSON-файлов.

## Быстрый старт

### 1. Создать виртуальное окружение

```bash
python3 -m venv .venv
```

### 2. Активировать окружение

macOS / Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### 4. Запустить приложение

```bash
python main.py
```

После запуска откроется окно приложения со списком персонажей.

### Debug-режим

По умолчанию приложение запускается без debug-режима. Для локальной разработки его можно включить явно:

macOS / Linux:

```bash
WOD_DEBUG=1 python main.py
```

Windows PowerShell:

```powershell
$env:WOD_DEBUG = "1"
python main.py
```

## Где хранятся персонажи

В режиме разработки персонажи сохраняются в:

```text
custom/characters/
```

Каждый персонаж хранится отдельным JSON-файлом. При сборке приложения через PyInstaller путь меняется на системную папку пользовательских данных:

- Windows: `%APPDATA%\WoDCharacterSheet\`
- macOS: `~/Library/Application Support/WoDCharacterSheet/`
- Linux: `~/.local/share/WoDCharacterSheet/`

Логика выбора пути находится в `src/utils.py`.

## Структура проекта

```text
.
├── main.py                         # Точка входа: создает окно pywebview и запускает приложение
├── requirements.txt                # Python-зависимости
├── src/
│   ├── control/                    # Контроллеры персонажей, кланов, дисциплин и бросков костей
│   ├── models/                     # Модели данных
│   ├── views/io.py                 # API, доступный JavaScript через pywebview
│   └── utils.py                    # Пути к ресурсам и пользовательским данным
├── static/
│   ├── character_sheet.html        # Основной экран листа персонажа
│   ├── index.html                  # Экран списка персонажей
│   ├── dices.html                  # Экспериментальный/отдельный экран броска костей
│   ├── css/                        # Стили
│   ├── js/
│   │   ├── api.js                  # Адаптер между frontend и pywebview API
│   │   └── components/             # Alpine-компоненты
│   ├── json/
│   │   ├── clans/                  # Данные кланов
│   │   └── disciplines/            # Данные дисциплин и способностей
│   └── img/                        # Иконки и изображения
└── custom/characters/              # Локальные сохранения персонажей в dev-режиме
```

## Как устроена связь frontend и backend

`main.py` создает экземпляр `Api` из `src/views/io.py` и передает его в `pywebview` как `js_api`.

Frontend не должен обращаться к `pywebview` напрямую из компонентов. Для этого есть `static/js/api.js`: он ждет готовности `pywebview` и экспортирует функции вроде `getBasicTrackerValue`, `setCharacterClan`, `getCharacterDisciplines`, `addPower` и других.

Общий поток данных такой:

```text
Alpine-компонент -> static/js/api.js -> pywebview.api -> src/views/io.py -> контроллеры/модели
```

## Как добавлять данные

### Новый клан

1. Добавить JSON-файл в `static/json/clans/`.
2. Убедиться, что структура совпадает с моделью `src/models/clan.py`.
3. Добавить изображение клана в `static/img/clans/`, если оно нужно интерфейсу.

### Новая дисциплина или способность

1. Добавить или обновить JSON-файл в `static/json/disciplines/`.
2. Убедиться, что данные дисциплины совпадают с `src/models/discipline.py`.
3. Убедиться, что данные способностей совпадают с `src/models/discipline_power.py`.
4. Добавить изображение дисциплины в `static/img/diciplines/`, если оно используется.

## Правила разработки frontend

В этом проекте reusable Alpine-компоненты лежат в:

```text
static/js/components/
```

Компоненты регистрируются через:

```javascript
document.addEventListener('alpine:init', () => {
    Alpine.data('componentName', () => ({
        // ...
    }));
});
```

Важное правило проекта: компоненты не должны напрямую вызывать `pywebview`. Если компоненту нужны данные backend, добавьте или используйте функцию из `static/js/api.js`.

## Автосохранение

При запуске `main.py` создается фоновый поток, который каждые 10 секунд вызывает сохранение текущего персонажа. При закрытии приложения персонаж также сохраняется.

## Текущее состояние тестов

Автоматических тестов в проекте сейчас нет.
