from dataclasses import dataclass, field
from typing import List


@dataclass
class Track:
    id: str = ""
    name: str = ""
    artist: str = ""
    small_image: str = ""
    preview_url: str = ""
    priority: int = 0
    duration_ms: int = 0


@dataclass
class CandidateTrack:
    id: str = ""
    name: str = ""
    artist: str = ""
    small_image: str = ""
    preview_url: str = ""
    duration_ms: int = 0
    p: List[int] = field(default_factory=list)
