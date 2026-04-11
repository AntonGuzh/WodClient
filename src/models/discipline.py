from dataclasses import dataclass
from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Discipline:
    name: str = ""
    icon: str = ""
    source: str = ""
    short_description: str = ""
    general_rule: str = ""
    description: str = ""
    type: str = ""
    resonance: str = ""

    def __hash__(self):
        return str.__hash__(self.name)
    
    def __eq__(self, value):
        if isinstance(value, Discipline):
            return self.name == value.name
        elif isinstance(value, str):
            return self.name == value
        return False
