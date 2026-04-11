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
        self.path = None

    def save_character(self) -> None:
        if self.path is None:
            return

        with open(self.path, 'w+') as f:
            json.dump(self.current_character.to_dict(), f)

    def load_character_list(self) -> List[dict]:
        chr_dir = Path(user_data_path('characters'))

        result = []
        for file in chr_dir.glob('*.json'):
            with open(file, 'r') as f:
                f_dict = json.load(f)
                result.append({
                    'name': f_dict.get('name', None),
                    'sire': f_dict.get('sire', None),
                    'generation': f_dict.get('generation', None),
                    'file_path': str(file.absolute())
                })

        return result

    def load_character(self, file_path: str):
        with open(file_path, 'r') as f:
            self.current_character = character.VampireCharacter.from_dict(json.load(f))
            self.path = Path(file_path)

    def create_character(self):
        self.current_character = character.VampireCharacter()
        self.path = Path(user_data_path('characters')).joinpath(f'{uuid.uuid4()}.json')
        self.character_list.append({
            'name': self.current_character.name,
            'sire': self.current_character.sire,
            'generation': self.current_character.generation,
            'file_path': str(self.path.absolute())
            
        })
        
    def get_current_character(self):
        if self.current_character is None:
            raise ValueError('Character still not downloaded')
        return self.current_character
    
    def delete_character(self, file_path: Path):
        Path(file_path).unlink(missing_ok=True)
