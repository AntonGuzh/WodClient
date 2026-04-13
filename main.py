import webview
import os
import sys

from src.views.io import Api
from src.utils import resource_path

os.environ['WEBKIT_DISABLE_DMABUF_RENDERER'] = '1'

if __name__ == "__main__":
    api = Api()
    index_path = resource_path(os.path.join('static', 'index.html'))
    window = webview.create_window(
        "Мир тьмы. Лист персонажа",
        url=index_path,
        js_api=api,
        width=1600,
        height=1400
    )
    api.set_window(window)

    webview.start(debug=False)
    