import sys
import os

def resource_path(relative_path):
    """Возвращает абсолютный путь к файлу для разработки и для собранного приложения."""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


def user_data_path(subpath=""):
    """
    Возвращает путь к папке для пользовательских данных (чтение/запись).
    Создаёт папку, если её нет.
    
    На Windows: %APPDATA%\WoDCharacterSheet\
    На macOS:   ~/Library/Application Support/WoDCharacterSheet/
    На Linux:   ~/.local/share/WoDCharacterSheet/
    
    В режиме разработки (не собранном) — папка 'user_data' рядом с utils.py.
    """
    APP_NAME = 'WoDCharacterSheet'

    if getattr(sys, 'frozen', False):
        # Собрано PyInstaller — используем системные папки
        if sys.platform == 'win32':
            base = os.environ.get('APPDATA', os.path.expanduser('~\\AppData\\Roaming'))
            base = os.path.join(base, APP_NAME)
        elif sys.platform == 'darwin':  # macOS
            base = os.path.expanduser(f'~/Library/Application Support/{APP_NAME}')
        else:  # Linux и другие Unix
            base = os.path.expanduser(f'~/.local/share/{APP_NAME}')
    else:
        # Режим разработки (запуск из .py) — папка рядом со скриптом
        base = os.path.abspath("./custom")
    
    full_path = os.path.join(base, subpath)
    os.makedirs(full_path, exist_ok=True)
    return full_path
