from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from typing import List, Dict


@dataclass_json
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
    strength: int = 3  # Сила
    dexterity: int = 3  # Ловкость
    stamina: int = 3  # Выносливость
    
    # Социальные
    charisma: int = 3  # Обаяние
    manipulation: int = 3  # Манипуляция
    composure: int = 3  # Самообладание
    
    # Ментальные
    intelligence: int = 3  # Интеллект
    wits: int = 3  # Смекалка
    resolve: int = 3  # Упорство
    
    # Здоровье и воля
    hard_health_damage: int = 0  # Агравированные повреждения
    light_health_damage: int = 0 # Легкие повреждения
    health_exhausted: bool = False # Физическое истощение 
    hard_willpower_damage: int = 0  # Тяжелый стресс
    light_willpower_damage: int = 0  # Легкий стресс
    willpower_exhausted: bool = False # Социальное и ментальное истощение
    
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
    disciplines: Dict[str, List[str]] = field(default_factory=dict)
    
    # Преимущества и недостатки (Advantages & Flaws)
    advantages: Dict[str, int] = field(default_factory=dict)
    flaws: Dict[str, int] = field(default_factory=dict)
    
    # Дополнительные параметры
    resonance: str = ""  # Резонанс
    hunger: int = 0  # Голод (max 5)
    humanity: int = 8  # Человечность (max 10)
    
    # Тема хроники и принципы
    chronicle_theme: str = ""
    touchstones_and_principles: str = ""
    
    # Клановый изъян
    clan_bane: str = ""
    
    # Сила Крови (Blood Potency)
    blood_potency: int = 1  # Сила Крови (max 10)
    
    # Опыт
    total_experience: int = 0  # Всего пунктов опыта
    spent_experience: int = 0  # Потрачено пунктов опыта
    
    # Возраст и внешность
    true_age: int = 100  # Истинный возраст
    apparent_age: int = 30  # Видимый возраст
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
    
    def get_basic_trackers(self) -> Dict[str, int]:
        """Возвращает словарь всех доступных простых трекеров"""
        return {
            **self.get_physical_attributes(),
            **self.get_social_attributes(),
            **self.get_mental_attributes(),
            **self.get_physical_skills(),
            **self.get_social_skills(),
            **self.get_mental_skills(),
            'hunger': self.hunger,
            'humanity': self.humanity,
            'blood_potency': self.blood_potency,
        }
    
    def get_max_health(self) -> int:
        """Возвращает максимальное здоровье вампира"""
        return self.stamina + 3
    
    def get_max_willpower(self) -> int:
        """Возвращает максимальное значение воли вампира"""
        return self.resolve + self.composure
    
    def add_discipline(self, discipline_name: str) -> None:
        """Добавляет дисциплину персонажу"""
        if discipline_name not in self.disciplines:
            self.disciplines[discipline_name] = []
    
    def remove_discipline(self, discipline_name: str) -> None:
        """Удаляет дисциплину и все её способности"""
        if discipline_name in self.disciplines:
            del self.disciplines[discipline_name]
    
    def add_power(self, power_name: str, discipline_name: str) -> None:
        """Добавляет способность дисциплины"""
        if discipline_name in self.disciplines:
            if power_name not in self.disciplines[discipline_name]:
                self.disciplines[discipline_name].append(power_name)
    
    def remove_power(self, discipline_name: str, power_name: str) -> None:
        """Удаляет способность дисциплины"""
        if discipline_name in self.disciplines:
            if power_name in self.disciplines[discipline_name]:
                self.disciplines[discipline_name].remove(power_name)
    
    def get_discipline_level(self, discipline_name: str) -> int:
        """Возвращает уровень дисциплины (количество способностей)"""
        return len(self.disciplines.get(discipline_name, []))
    
    def update_advantage(self, name: str, value: int) -> bool:
        """Обновить значение преимущества/недостатка (0-5)"""
        if 0 <= value <= 5 and name in self.advantages:
            self.advantages[name] = value
            return True
        return False

    def add_advantage(self, name: str) -> bool:
        """Добавить новое преимущество с 0 точками"""
        if name in self.advantages or not name.strip():
            return False
        self.advantages[name.strip()] = 0
        return True

    def remove_advantage(self, name: str) -> bool:
        """Удалить преимущество по названию"""
        if name in self.advantages:
            del self.advantages[name]
            return True
        return False

    def rename_advantage(self, old_name: str, new_name: str) -> bool:
        """Переименовать преимущество"""
        if old_name in self.advantages and new_name not in self.advantages and new_name.strip():
            value = self.advantages.pop(old_name)
            self.advantages[new_name.strip()] = value
            return True
        return False
    
    def update(self, attr_name: str, value: int) -> bool:
        """Обновляет значение атрибута"""
        if hasattr(self, attr_name):
            setattr(self, attr_name, value)
            return True
        return False
    
    def add_health_damage(self, damage: int, is_hard_damage: bool, is_partial_damage: bool) -> None:
        if is_partial_damage:
            damage = (damage + 1) // 2 # Округление в большую сторону

        remaining_health = self.get_max_health() - self.hard_health_damage - self.light_health_damage

        if is_hard_damage:
            self.hard_health_damage += damage
            self.light_health_damage += min(0, remaining_health - damage) # Остаток тяжелых повреждений перекрывает легкие
        else:
            self.light_health_damage += min(damage, remaining_health)
            self.add_health_damage(max(0, damage - remaining_health), True, False) # Остаток становится тяжелыми повреждениями

        self.hard_health_damage = min(self.get_max_health(), self.hard_health_damage)
        self.light_health_damage = max(0, self.light_health_damage)

        self.health_exhausted = (self.hard_health_damage + self.light_health_damage) >= self.get_max_health()

    def add_willpower_damage(self, damage: int, is_hard_damage: bool, is_partial_damage: bool) -> None:
        if is_partial_damage:
            damage = (damage + 1) // 2 # Округление в большую сторону

        remaining_willpower = self.get_max_willpower() - self.hard_willpower_damage - self.light_willpower_damage

        if is_hard_damage:
            self.hard_willpower_damage += damage
            self.light_willpower_damage += min(0, remaining_willpower - damage) # Остаток тяжелых повреждений перекрывает легкие
        else:
            self.light_willpower_damage += min(damage, remaining_willpower)
            self.add_willpower_damage(max(0, damage - remaining_willpower), True, False) # Остаток становится тяжелыми повреждениями

        self.hard_willpower_damage = min(self.get_max_willpower(), self.hard_willpower_damage)
        self.light_willpower_damage = max(0, self.light_willpower_damage)

        self.willpower_exhausted = (self.hard_willpower_damage + self.light_willpower_damage) >= self.get_max_willpower()

    def get_life_stats(self) -> Dict[str, int]:
        return {
            'max_health': self.get_max_health(),
            'hard_health_damage': self.hard_health_damage,
            'light_health_damage': self.light_health_damage,
            'health_exhausted': self.health_exhausted,
            'max_willpower': self.get_max_willpower(),
            'hard_willpower_damage': self.hard_willpower_damage,
            'light_willpower_damage': self.light_willpower_damage,
            'willpower_exhausted': self.willpower_exhausted,
        }
    
    def get_blood_stats(self) -> Dict[str, int]:
        base_stat_block = {
            0: {
                'blood_surge_modifier': '+1d10',  # Модификатор прилива Крови
                'healing': '1 лёгкое повреждение',  # Заживление
                'discipline_pool_modifier': 'Нет',  # Модификатор пула Дисциплин
                'blood_reroll': 'Нет',  # Повторное испытание Крови (уровень силы)
                'feeding_penalty': 'Нет',  # Проблемы с питанием
                'bane_severity': '0'  # Тяжесть изъяна
            },
            1: {
                'blood_surge_modifier': '+2d10',
                'healing': '1 лёгкое повреждение',
                'discipline_pool_modifier': 'Нет',
                'blood_reroll': 'Уровень 1',
                'feeding_penalty': 'Нет',
                'bane_severity': '2'
            },
            2: {
                'blood_surge_modifier': '+2d10',
                'healing': '2 лёгких повреждения',
                'discipline_pool_modifier': '+1d10',
                'blood_reroll': 'Уровень 1',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных  утоляет Голод в 2 раза хуже',
                'bane_severity': '2'
            },
            3: {
                'blood_surge_modifier': '+3d10',
                'healing': '2 лёгких повреждения',
                'discipline_pool_modifier': '+1d10',
                'blood_reroll': 'Уровень 1-2',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод',
                'bane_severity': '3'
            },
            4: {
                'blood_surge_modifier': '+3d10',
                'healing': '3 лёгких повреждения',
                'discipline_pool_modifier': '+2d10',
                'blood_reroll': 'Уровень 1-2',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 1 пункт Голода меньше',
                'bane_severity': '3'
            },
            5: {
                'blood_surge_modifier': '+4d10',
                'healing': '3 лёгких повреждения',
                'discipline_pool_modifier': '+2d10',
                'blood_reroll': 'Уровень 1-3',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 1 пункт Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 2',
                'bane_severity': '4'
            },
            6: {
                'blood_surge_modifier': '+4d10',
                'healing': '3 лёгких повреждения',
                'discipline_pool_modifier': '+3d10',
                'blood_reroll': 'Уровень 1-3',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 2 пункта Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 2',
                'bane_severity': '4'
            },
            7: {
                'blood_surge_modifier': '+5d10',
                'healing': '3 лёгких повреждения',
                'discipline_pool_modifier': '+3d10',
                'blood_reroll': 'Уровень 1-4',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 2 пункта Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 2',
                'bane_severity': '5'
            },
            8: {
                'blood_surge_modifier': '+5d10',
                'healing': '4 лёгких повреждения',
                'discipline_pool_modifier': '+4d10',
                'blood_reroll': 'Уровень 1-4',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 2 пункта Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 2',
                'bane_severity': '5'
            },
            9: {
                'blood_surge_modifier': '+6d10',
                'healing': '4 лёгких повреждения',
                'discipline_pool_modifier': '+4d10',
                'blood_reroll': 'Уровень 1-5',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 2 пункта Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 3',
                'bane_severity': '6'
            },
            10: {
                'blood_surge_modifier': '+6d10',
                'healing': '5 лёгких повреждений',
                'discipline_pool_modifier': '+5d10',
                'blood_reroll': 'Уровень 1-5',
                'feeding_penalty': 'Донорская кровь из пакетов и кровь животных вообще не утоляет Голод. Укусив человека, вампир убирает на 3 пункта Голода меньше. Не убивая человека, вампир может снизить значение Голода только до 3',
                'bane_severity': '6'
            }
        }
        return base_stat_block[self.blood_potency]
