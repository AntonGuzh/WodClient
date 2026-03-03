import json

from ..models.character import VampireCharacter

class Api:
    def __init__(self):
        self.character = VampireCharacter()
        self.character.add_health_damage(1, True, False)
        self.character.add_health_damage(2, False, False)
        self.window = None

    def set_window(self, window):
        self.window = window

    def update_basic_tracker(self, attr_id: str, value: int):
        """Вызывается из JavaScript при изменении трекера"""
        success = self.character.update(attr_id, value)
        self.update_life_display()
        return success
    
    def get_basic_trackers(self) -> dict:
        """Возвращает все атрибуты (для начальной загрузки)"""
        return self.character.get_basic_trackers()
    
    def get_life_stats(self) -> dict:
        return self.character.get_life_stats()
    
    def update_life_display(self):
        """Отправляет текущие данные о здоровье и воле в интерфейс"""
        if self.window:
            data = self.character.get_life_stats()
            js_code = f'updateLifeStats({json.dumps(data)})'
            self.window.evaluate_js(js_code)
