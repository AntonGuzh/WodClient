from dataclasses import dataclass, field
from typing import Optional, List, Dict

@dataclass
class VampireCharacter:
    # Основная информация (шапка)
    name: str = ""
    concept: str = ""
    hunting_style: str = ""
    chronicle: str = ""
    ambition: str = ""
    clan: str = ""
    sire: str = ""
    desire: str = ""
    generation: int = 13
    
    # Характеристики (Attributes)
    # Физические
    strength: int = 0  # Сила
    dexterity: int = 0  # Ловкость
    stamina: int = 0  # Выносливость
    
    # Социальные
    charisma: int = 0  # Обаяние
    manipulation: int = 0  # Манипуляция
    composure: int = 0  # Самообладание
    
    # Ментальные
    intelligence: int = 0  # Интеллект
    wits: int = 0  # Смекалка
    resolve: int = 0  # Упорство
    
    # Трекеры
    health: int = 0  # Здоровье (max 10)
    willpower: int = 0  # Воля (max 10)
    
    # Навыки (Skills)
    # Физические навыки
    athletics: int = 0  # Атлетика
    drive: int = 0  # Вождение
    stealth: int = 0  # Скрытность
    survival: int = 0  # Выживание
    brawl: int = 0  # Драка
    craft: int = 0  # Ремесло
    larceny: int = 0  # Воровство
    firearms: int = 0  # Стрельба
    melee: int = 0  # Фехтование
    
    # Социальные навыки
    intimidation: int = 0  # Запугивание
    performance: int = 0  # Исполнение
    leadership: int = 0  # Лидерство
    animal_ken: int = 0  # Обращение с животными
    insight: int = 0  # Проницательность
    persuasion: int = 0  # Убеждение
    streetwise: int = 0  # Уличное чутьё
    subterfuge: int = 0  # Хитрость
    etiquette: int = 0  # Этикет
    
    # Ментальные навыки
    humanities: int = 0  # Гуманитарные науки
    science: int = 0  # Естественные науки
    medicine: int = 0  # Медицина
    awareness: int = 0  # Наблюдательность
    occult: int = 0  # Оккультизм
    politics: int = 0  # Политика
    investigation: int = 0  # Расследование
    technology: int = 0  # Техника
    finance: int = 0  # Финансы
    
    # Дисциплины (Disciplines)
    disciplines: Dict[str, int] = field(default_factory=dict)
    
    # Преимущества и недостатки (Advantages & Flaws)
    advantages: Dict[str, int] = field(default_factory=dict)
    flaws: Dict[str, int] = field(default_factory=dict)
    
    # Дополнительные параметры
    resonance: str = ""  # Резонанс
    hunger: int = 0  # Голод (max 5)
    humanity: int = 0  # Человечность (max 10)
    
    # Тема хроники и принципы
    chronicle_theme: str = ""
    touchstones_and_principles: str = ""
    
    # Клановый изъян
    clan_bane: str = ""
    
    # Сила Крови (Blood Potency)
    blood_potency: int = 0  # Сила Крови (max 10)
    blood_surge_modifier: str = ""  # Модификатор прилива Крови
    healing: str = ""  # Заживление
    discipline_pool_modifier: str = ""  # Модификатор пула Дисциплин
    blood_reroll: str = ""  # Повторное испытание Крови (уровень силы)
    feeding_penalty: str = ""  # Проблемы с питанием
    bane_severity: str = ""  # Тяжесть изъяна
    
    # Опыт
    total_experience: str = ""  # Всего пунктов опыта
    spent_experience: str = ""  # Потрачено пунктов опыта
    
    # Возраст и внешность
    true_age: str = ""  # Истинный возраст
    apparent_age: str = ""  # Видимый возраст
    date_of_birth: str = ""  # Дата рождения
    date_of_death: str = ""  # Дата смерти
    
    # Описательные поля
    appearance: str = ""  # Внешность
    notes: str = ""  # Заметки
    distinctive_features: str = ""  # Отличительные черты
    history: str = ""  # История
    
    def get_physical_attributes(self) -> Dict[str, int]:
        """Возвращает словарь физических характеристик"""
        return {
            "strength": self.strength,
            "dexterity": self.dexterity,
            "stamina": self.stamina
        }
    
    def get_social_attributes(self) -> Dict[str, int]:
        """Возвращает словарь социальных характеристик"""
        return {
            "charisma": self.charisma,
            "manipulation": self.manipulation,
            "composure": self.composure
        }
    
    def get_mental_attributes(self) -> Dict[str, int]:
        """Возвращает словарь ментальных характеристик"""
        return {
            "intelligence": self.intelligence,
            "wits": self.wits,
            "resolve": self.resolve
        }
    
    def get_physical_skills(self) -> Dict[str, int]:
        """Возвращает словарь физических навыков"""
        return {
            "athletics": self.athletics,
            "drive": self.drive,
            "stealth": self.stealth,
            "survival": self.survival,
            "brawl": self.brawl,
            "craft": self.craft,
            "larceny": self.larceny,
            "firearms": self.firearms,
            "melee": self.melee
        }
    
    def get_social_skills(self) -> Dict[str, int]:
        """Возвращает словарь социальных навыков"""
        return {
            "intimidation": self.intimidation,
            "performance": self.performance,
            "leadership": self.leadership,
            "animal_ken": self.animal_ken,
            "insight": self.insight,
            "persuasion": self.persuasion,
            "streetwise": self.streetwise,
            "subterfuge": self.subterfuge,
            "etiquette": self.etiquette
        }
    
    def get_mental_skills(self) -> Dict[str, int]:
        """Возвращает словарь ментальных навыков"""
        return {
            "humanities": self.humanities,
            "science": self.science,
            "medicine": self.medicine,
            "awareness": self.awareness,
            "occult": self.occult,
            "politics": self.politics,
            "investigation": self.investigation,
            "technology": self.technology,
            "finance": self.finance
        }
    
    def add_discipline(self, name: str, level: int) -> None:
        """Добавляет или обновляет уровень дисциплины"""
        self.disciplines[name] = level
    
    def add_advantage(self, name: str, level: int) -> None:
        """Добавляет преимущество"""
        self.advantages[name] = level
    
    def add_flaw(self, name: str, level: int) -> None:
        """Добавляет недостаток"""
        self.flaws[name] = level
