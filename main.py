import webview

from src.views.io import Api

if __name__ == "__main__":
    api = Api()
    window = webview.create_window(
        "Моё динамическое приложение",
        url='static/character_sheet.html',
        js_api=api,  # связываем API с окном
        width=1600,
        height=1400
    )
    api.set_window(window)

    def on_loaded():
        api.update_life_display()

    window.events.loaded += on_loaded

    webview.start(debug=False)
