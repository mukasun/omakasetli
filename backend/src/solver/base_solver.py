from functools import cached_property
from typing import Dict, List

from src.domain import CandidateTrack, User


class BaseSolver:
    users: List[User]
    num_users: int
    num_tracks: int
    time_limit: int

    def __init__(self, users: List[User], time_limit: int) -> None:
        self.users = users
        self.num_users = len(users)
        self.num_tracks = len(self.candidates)
        self.time_limit = time_limit

    @cached_property
    def candidates(self):
        candidates: Dict[str, CandidateTrack] = {}
        for j, user in enumerate(self.users):
            for track in user.tracks:
                if track.id not in candidates:
                    p = [0] * self.num_users
                    p[j] = track.priority
                    candidates[track.id] = CandidateTrack(
                        id=track.id,
                        name=track.name,
                        artist=track.artist,
                        small_image=track.small_image,
                        preview_url=track.preview_url,
                        duration_ms=track.duration_ms,
                        p=p
                    )
                else:
                    candidates[track.id].p[j] = track.priority
        return list(candidates.values())
