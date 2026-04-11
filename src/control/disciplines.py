from typing import List, Dict
from pathlib import Path
import sys
import json
from collections import defaultdict

from ..models.discipline import Discipline
from ..models.discipline_power import DisciplinePower
from ..utils import resource_path

class DisciplinesController:
    def __init__(self):
        self.disciplines: Dict[Discipline, List[DisciplinePower]] = self.load_disciplines()

    def get_disciplines_list(self):
        return self.disciplines.keys()
    
    def get_discipline_powers(self, discipline: str, level: int):
        result = []
        for discipline_power in self.disciplines[discipline]:
            if discipline_power.level <= level:
                result.append(discipline_power)
        return result

    def load_disciplines(self):
        chr_dir = Path(resource_path('static/json/disciplines'))
        print(chr_dir.absolute())

        result = defaultdict(list)
        for file in chr_dir.glob('*.json'):
            with open(file, 'r') as f:
                f_dict = json.load(f)
                for item_dict in f_dict['powers']:
                    result[Discipline.from_dict(f_dict['discipline'])].append(DisciplinePower.from_dict(item_dict))

        return result
