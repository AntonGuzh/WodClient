import threading
from ..models import character
from typing import List
from pathlib import Path
import uuid

import json

from ..utils import user_data_path


class CharactersController:
    def __init__(self):
        self.character_list = self.load_character_list()
        self.current_character: character.VampireCharacter = None
        self._path = None
        self._lock = threading.Lock()  # добавлено

    def save_character(self) -> None:
        with self._lock:
            if self._path is None:
                return

            data = self.current_character.to_dict()
            path = self._path

        with open(path, 'w+', encoding='utf-8') as f:
            json.dump(data, f)

    def load_character_list(self) -> List[dict]:
        chr_dir = Path(user_data_path('characters'))

        result = []
        for file in chr_dir.glob('*.json'):
            with open(file, 'r', encoding='utf-8') as f:
                f_dict = json.load(f)
                result.append({
                    'name': f_dict.get('name', None),
                    'sire': f_dict.get('sire', None),
                    'generation': f_dict.get('generation', None),
                    'file_path': str(file.absolute().resolve())
                })

        return result

    def load_character(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        new_character = character.VampireCharacter.from_dict(data)
        new_path = Path(file_path)

        with self._lock:
            self.current_character = new_character
            self._path = new_path

    def create_character(self):
        new_character = character.VampireCharacter()
        new_path = Path(user_data_path('characters')).joinpath(f'{uuid.uuid4()}.json')

        with self._lock:
            self.current_character = new_character
            self._path = new_path

            self.character_list.append({
                'name': new_character.name,
                'sire': new_character.sire,
                'generation': new_character.generation,
                'file_path': str(new_path.absolute().resolve())
            })

    def get_current_character(self):
        if self.current_character is None:
            raise ValueError('Character still not downloaded')
        return self.current_character
    
    def delete_character(self, file_path: Path):
        Path(file_path).unlink(missing_ok=True)
