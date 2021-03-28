from unittest import TestCase

from src.domain import CandidateTrack, Track, User
from src.solver import QuboSolver


class TestQuboSolcer(TestCase):

    def setUp(self) -> None:
        users = [
            User(
                id="user1",
                tracks=[
                    Track(id="001", priority=1, duration_ms=100),
                    Track(id="003", priority=2, duration_ms=200),
                    Track(id="005", priority=3, duration_ms=300)
                ]
            ),
            User(
                id="user2",
                tracks=[
                    Track(id="002", priority=2, duration_ms=100),
                    Track(id="003", priority=1, duration_ms=200),
                    Track(id="004", priority=3, duration_ms=300)
                ]
            ),
            User(
                id="user3",
                tracks=[
                    Track(id="002", priority=3, duration_ms=100),
                    Track(id="003", priority=2, duration_ms=200),
                    Track(id="005", priority=1, duration_ms=300)
                ]
            ),
        ]
        self.solver = QuboSolver(users, 500)

    def test_candidates(self):
        self.assertEqual(self.solver.num_users, 3)
        self.assertEqual(self.solver.num_tracks, 5)
        self.assertEqual(
            self.solver.candidates,
            [
                CandidateTrack(id="001", duration_ms=100, p=[1, 0, 0]),
                CandidateTrack(id="003", duration_ms=200, p=[2, 1, 2]),
                CandidateTrack(id="005", duration_ms=300, p=[3, 0, 1]),
                CandidateTrack(id="002", duration_ms=100, p=[0, 2, 3]),
                CandidateTrack(id="004", duration_ms=300, p=[0, 3, 0]),
            ]
        )
