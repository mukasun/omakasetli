from dataclasses import dataclass, field
from typing import List

from .track import Track


@dataclass
class User:
    id: str = ""
    slug: str = ""
    display_name: str = ""
    tracks: List[Track] = field(default_factory=list)
