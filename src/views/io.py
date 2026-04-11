from copy import deepcopy
import json

from ..control import character
from ..control import dices
from ..control import disciplines
from ..control import clans

class Api:
    def __init__(self):
        self.character_controller = character.CharactersController()
        self.disciplines_controller = disciplines.DisciplinesController()
        self.clans_controller = clans.ClansController()
        self.window = None

    def set_window(self, window):
        self.window = window

    def get_character_list(self):
        """Возвращает список всех сохранённых персонажей"""
        return self.character_controller.load_character_list()
    
    def load_character(self, file_path: str) -> bool:
        """Загружает персонажа из указанного файла и делает его текущим"""
        try:
            self.character_controller.load_character(file_path)
            return True
        except Exception as e:
            print(f"Ошибка загрузки персонажа: {e}")
            return False

    def create_new_character(self) -> bool:
        """Создаёт нового персонажа (можно с шаблоном)"""
        self.character_controller.create_character()
        return True
    
    def save_character(self):
        self.character_controller.save_character()

    def update_basic_tracker(self, attr_id: str, value: int):
        """Вызывается из JavaScript при изменении трекера"""
        success = self.character_controller.get_current_character().update(attr_id, value)
        self.update_display()
        return success
    
    def get_basic_trackers(self) -> dict:
        """Возвращает все атрибуты (для начальной загрузки)"""
        return self.character_controller.get_current_character().get_basic_trackers()
    
    def get_life_stats(self) -> dict:
        return self.character_controller.get_current_character().get_life_stats()
    
    def update_display(self):
        """Отправляет текущие данные о здоровье и воле в интерфейс"""
        if self.window:
            data = self.character_controller.get_current_character().get_life_stats()
            js_code = f'updateLifeStats({json.dumps(data)})'
            self.window.evaluate_js(js_code)

            text_fields = self.get_all_text_fields()
            self.window.evaluate_js(f'updateAllTextFields({json.dumps(text_fields)})')

            autofilled_texts = self.get_autofilled_texts()
            self.window.evaluate_js(f'updateAllAutofilledTextFields({json.dumps(autofilled_texts)})')

    def update_text_field(self, field_id, value):
        char = self.character_controller.get_current_character()
        """Вызывается из JavaScript при изменении текстового поля"""
        annotations = getattr(char, '__annotations__', {})
        target_type = annotations.get(field_id)

        if hasattr(char, field_id):
            setattr(char, field_id, target_type(value))
            return True
        return False
    
    def get_all_text_fields(self):
        """Возвращает все текстовые поля для инициализации интерфейса"""
        text_fields = {}
        for key, value in self.character_controller.get_current_character().__dict__.items():
            if isinstance(value, str):
                text_fields[key] = value
            if isinstance(value, int):
                text_fields[key] = str(value)
        return text_fields

    def apply_damage(self, amount, isHeavy, halve):
        self.character_controller.get_current_character().add_health_damage(amount, isHeavy, halve)
        self.update_display()

    def apply_stress(self, amount, isHeavy, halve):
        self.character_controller.get_current_character().add_willpower_damage(amount, isHeavy, halve)
        self.update_display()

    def roll_dice(self, count, hungry):
        hunger_value = self.character_controller.get_current_character().hunger if hungry else 0
        successes, dice_details, special = dices.roll_dices(count, hunger_value)
    
        new_dice_details = []
        for d in dice_details:
            new_d = dict()
            new_d['result'] = d.value
            new_dice_details.append(new_d)
        special_str = (special[0].value, special[1].value)
        
        return (successes, new_dice_details, special_str)
    
    def get_autofilled_texts(self):
        blood_stats = deepcopy(self.character_controller.get_current_character().get_blood_stats())
        blood_stats['feeding_penalty'] = blood_stats['feeding_penalty'].replace('.', '.<br>')

        bane = self.get_clan_bane(self.character_controller.get_current_character().clan).format(bane_severity=blood_stats['bane_severity'])

        return {
            **blood_stats,
            **{'clan_bane': bane},
        }
    
    def get_all_disciplines(self):
        """Возвращает список всех доступных дисциплин для отображения в модальном окне"""
        result = []
        for discipline in self.disciplines_controller.get_disciplines_list():
            if discipline.name in self.character_controller.get_current_character().disciplines:
                continue

            disc_dict = discipline.to_dict()
            result.append(disc_dict)
        return result
    
    def get_discipline_powers(self, discipline_name: str, level: int):
        """Возвращает доступные способности для указанного уровня"""
        result = []
        for power in self.disciplines_controller.get_discipline_powers(discipline_name, level):
            if power in self.character_controller.get_current_character().disciplines[discipline_name]:
                continue
            if power.amalgam is not None and power.amalgam.level > self.character_controller.get_current_character().get_discipline_level(power.amalgam.discipline_name):
                continue

            result.append(power.to_dict())
        return result
    
    def get_discipline_details(self, discipline_name: str) -> dict:
        """Возвращает полную информацию о дисциплине"""
        for disc in self.disciplines_controller.get_disciplines_list():
            if disc.name == discipline_name:
                return disc.to_dict()
        return {}
    
    def get_power_details(self, power_name: str) -> dict:
        """Возвращает полную информацию о способности"""
        for powers_list in self.disciplines_controller.disciplines.values():
            for power in powers_list:
                if power.name == power_name:
                    return power.to_dict()
        return {}
    
    def add_discipline_to_character(self, discipline_name: str) -> bool:
        """Добавляет дисциплину персонажу"""
        # Ищем дисциплину в контроллере
        for disc in self.disciplines_controller.get_disciplines_list():
            if disc.name == discipline_name:
                self.character_controller.get_current_character().add_discipline(discipline_name)
                self.update_disciplines_display()
                return True
        return False
    
    def remove_discipline_from_character(self, discipline_name: str) -> bool:
        """Удаляет дисциплину у персонажа"""
        self.character_controller.get_current_character().remove_discipline(discipline_name)
        self.update_disciplines_display()
        return True
    
    def add_power_to_character(self, discipline_name: str, power_name: str) -> bool:
        """Добавляет способность персонажу"""
        # Ищем способность в контроллере
        for power in self.disciplines_controller.disciplines[discipline_name]:
            if power.name == power_name:
                self.character_controller.get_current_character().add_power(power_name, discipline_name)
                self.update_disciplines_display()
                return True
        return False
    
    def remove_power_from_character(self, discipline_name: str, power_name: str) -> bool:
        """Удаляет способность у персонажа"""
        self.character_controller.get_current_character().remove_power(discipline_name, power_name)
        self.update_disciplines_display()
        return True
    
    def get_character_disciplines(self) -> dict:
        """Возвращает дисциплины персонажа с их способностями и уровнями"""
        result = {}
        for disc_name, powers in self.character_controller.get_current_character().disciplines.items():
            # Получаем полную информацию о дисциплине
            disc_info = self.get_discipline_details(disc_name)
            result[disc_name] = {
                'info': disc_info,
                'level': len(powers),
                'powers': powers
            }
        return result
    
    def update_disciplines_display(self):
        """Обновляет отображение дисциплин в интерфейсе"""
        if self.window:
            data = self.get_character_disciplines()
            self.window.evaluate_js(f'renderCharacterDisciplines({json.dumps(data)})')
    
    def get_clans_list(self):
        """Возвращает список всех кланов"""
        return [clan.to_dict() for clan in self.clans_controller.get_clans()]
    
    def get_clan_bane(self, clan_name: str) -> str:
        """Возвращает краткое описание изъяна клана"""
        for clan in self.clans_controller.get_clans():
            if clan.name == clan_name:
                return clan.bane_short_description
        return ""
    
    def get_clan_disciplines(self):
        """Возвращает список дисциплин клана текущего персонажа"""
        clan_name = self.character_controller.get_current_character().clan
        for clan in self.clans_controller.get_clans():
            if clan.name == clan_name:
                return clan.disciplines
        return []
    
    def set_character_clan(self, clan_name: str) -> bool:
        """Устанавливает клан персонажа"""
        self.character_controller.get_current_character().clan = clan_name
        return True
    
    def get_character_clan(self) -> str:
        """Возвращает текущий клан персонажа"""
        return self.character_controller.get_current_character().clan
    
    def get_advantages(self):
        return self.character_controller.get_current_character().advantages

    def update_advantage(self, name: str, value: int) -> bool:
        return self.character_controller.get_current_character().update_advantage(name, value)

    def add_advantage(self, name: str) -> bool:
        return self.character_controller.get_current_character().add_advantage(name)

    def remove_advantage(self, name: str) -> bool:
        return self.character_controller.get_current_character().remove_advantage(name)

    def rename_advantage(self, old_name: str, new_name: str) -> bool:
        return self.character_controller.get_current_character().rename_advantage(old_name, new_name)
