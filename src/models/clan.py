from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from typing import List


@dataclass_json
@dataclass
class Clan:
    name: str = ""
    icon: str = ""
    source: str = ""
    description: str = ""
    who_is_clan: str = ""

    disciplines: List[str] = field(default_factory=list)
    bane_short_description: str = ""
    bane_description: str = ""
