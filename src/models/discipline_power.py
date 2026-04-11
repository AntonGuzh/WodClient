from dataclasses import dataclass
from dataclasses_json import dataclass_json
from typing import Optional


@dataclass_json
@dataclass
class DisciplinePower:
    name: str = ""
    source: str = ""
    short_description: str = ""
    description: str = ""
    level: int = 0
    discipline_name: str = ""
    check_pool: Optional[str] = None
    reckoning: Optional[str] = None
    rule: str = ""
    duration: str = ""

    @dataclass
    class Amalgam:
        level: int = 0
        discipline_name: str = ""

    amalgam: Optional[Amalgam] = None

    def __hash__(self):
        return str.__hash__(self.name)
    
    def __eq__(self, value):
        if isinstance(value, DisciplinePower):
            return self.name == value.name
        elif isinstance(value, str):
            return self.name == value
        return False
