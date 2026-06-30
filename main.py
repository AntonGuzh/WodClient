import webview
import os
import threading
import time

from src.views.io import Api
from src.utils import resource_path

os.environ['WEBKIT_DISABLE_DMABUF_RENDERER'] = '1'


def is_debug_enabled():
    return os.environ.get('WOD_DEBUG', '').lower() in ('1', 'true', 'yes', 'on')


def periodic_save(api, interval_seconds):
    """Фоновая функция: каждые interval_seconds вызывает save_character."""
    while True:
        time.sleep(interval_seconds)
        try:
            api.character_controller.save_character()
            print(f"[Auto-save] Character saved at {time.ctime()}")
        except Exception as e:
            print(f"[Auto-save] Error: {e}")


if __name__ == "__main__":
    api = Api()
    index_path = resource_path(os.path.join('static', 'index.html'))
    window = webview.create_window(
        "Мир тьмы. Лист персонажа",
        url=index_path,
        js_api=api,
        width=1630,
        height=1400
    )
    api.set_window(window)

    autosave_thread = threading.Thread(
        target=periodic_save,
        args=(api, 10),
        daemon=True
    )
    autosave_thread.start()

    webview.start(debug=is_debug_enabled())

    print('Finished')
    api.character_controller.save_character()
