import webview
import json

class Api:
    def __init__(self):
        self.items = []

    def add_item(self, text):
        # Эту функцию вызовет JavaScript при нажатии кнопки
        new_item = {"id": len(self.items), "text": text}
        self.items.append(new_item)
        # Возвращаем созданный элемент, чтобы JS добавил его на страницу
        return json.dumps(new_item)

    def remove_item(self, item_id):
        # Удаляем элемент по индексу
        self.items = [item for item in self.items if item["id"] != int(item_id)]
        # Можно вернуть подтверждение
        return "ok"

if __name__ == "__main__":
    api = Api()
    window = webview.create_window(
        "Моё динамическое приложение",
        url='static/character_sheet.html',
        js_api=api,  # связываем API с окном
        width=1600,
        height=1400
    )
    webview.start()