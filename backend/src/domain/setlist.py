from dataclasses import dataclass
from typing import List

from .track import CandidateTrack


@dataclass
class Setlist:
    tracks: List[CandidateTrack]
    scores: List[int]
    score_sum: int
    score_avg: float
    score_var: float
    total_time: int
