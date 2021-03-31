import numpy as np
from src.domain.setlist import Setlist

from .base_solver import BaseSolver


class NaiveMaxSolver(BaseSolver):
    """満足度が最大となるように選択するソルバー"""

    def solve(self) -> Setlist:
        """満足度で降順ソートして制限時間を超えるまで上から選択する。

        Returns:
            Setlist: セットリスト
        """
        sorted_candidates = sorted(self.candidates, key=lambda c: sum(c.p), reverse=True)

        tracks = []
        total_time = 0
        user_scores = np.zeros(self.num_users)

        for track in sorted_candidates:
            track_time = track.duration_ms
            user_scores += np.array(track.p)
            total_time += track_time
            tracks.append(track)
            if total_time > self.time_limit * 1000:
                break

        return Setlist(
            tracks=tracks,
            scores=user_scores.tolist(),
            score_sum=user_scores.sum(),
            score_avg=user_scores.mean(),
            score_var=user_scores.var(),
            total_time=total_time
        )
