from pathlib import Path
from typing import List
import json

from ..models.clan import Clan
from ..utils import resource_path


class ClansController:
    def __init__(self):
        self.clans: List[Clan] = self.load_clans()

    def get_clans(self):
        return self.clans

    def load_clans(self):
        clans_dir = Path(resource_path('static/json/clans'))

        result = []
        for file in sorted(clans_dir.glob('*.json')):
            with open(file, 'r', encoding='utf-8') as f:
                result.append(Clan.from_dict(json.load(f)))

        result.sort(key=lambda clan: clan.name)
        return result
