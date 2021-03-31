import os

import numpy as np
from amplify import BinaryPoly, BinaryQuadraticModel, Solver, decode_solution, gen_symbols, sum_poly
from amplify.client import FixstarsClient
from amplify.constraint import penalty
from src.domain.setlist import Setlist

from .base_solver import BaseSolver


class QuboSolver(BaseSolver):
    """分散を最小化しつつ満足度が最大となるように選択するソルバー"""

    def solve(self, c_weight: float = 3, timeout: int = 1000, num_unit_step: int = 10) -> Setlist:
        """

        Args:
            c_weight (float): 時間制約の強さ
            timeout (int, optional): Fixstars AE のタイムアウト[ms] (デフォルト: 10000)
            num_unit_step (int, optional): Fixstars AE のステップ数 (デフォルト: 10)

        Returns:
            Setlist: セットリスト
        """
        self.q = gen_symbols(BinaryPoly, self.num_tracks)
        energy_function = self.energy(c_weight)
        model = BinaryQuadraticModel(energy_function)

        fixstars_client = FixstarsClient()
        fixstars_client.token = os.environ.get("FIXSTARS_API_TOKEN")
        fixstars_client.parameters.timeout = timeout
        fixstars_client.parameters.num_unit_steps = num_unit_step

        amplify_solver = Solver(fixstars_client)
        amplify_solver.filter_solution = False
        result = amplify_solver.solve(model)

        q_values = decode_solution(self.q, result[0].values)
        tracks = [self.candidates[i] for i, v in enumerate(q_values) if v == 1]

        total_time = 0
        user_scores = np.zeros(self.num_users)
        for track in tracks:
            user_scores += np.array(track.p)
            total_time += track.duration_ms

        return Setlist(
            tracks=tracks,
            scores=user_scores.tolist(),
            score_sum=user_scores.sum(),
            score_avg=user_scores.mean(),
            score_var=user_scores.var(),
            total_time=total_time
        )

    def energy(self, c_weight: float):
        """ハミルトニアン

        Returns:
            [type]: -H_A + H_B + λH_C
        """
        return BinaryQuadraticModel(-self.room_total_satisfaction() + self.room_variance_satisfaction() + c_weight * self.time_constraint())

    def someone_total_satisfaction(self, j: int):
        """メンバーjの総満足度

        Args:
            j (int): メンバーインデックス

        Returns:
            [amplify.BinaryPoly]: P(j) = \\sum_{i=1}^{N}p_{i,j}x_{i}
        """
        return sum_poly(self.num_tracks, lambda i: self.q[i] * self.candidates[i].p[j])

    def room_total_satisfaction(self):
        """ルームの総満足度

        Returns:
            [amplify.BinaryPoly]: \\sum_{j=1}^{M}P(j)
        """
        return sum_poly(self.num_users, lambda j: self.someone_total_satisfaction(j))

    def room_average_satisfaction(self):
        """ルームの平均満足度

        Returns:
            [amplify.BinaryPoly]: \\sum_{j=1}^{M}P(j) / M
        """
        return self.room_total_satisfaction() / self.num_users

    def room_variance_satisfaction(self):
        """ルームの満足度の分散

        Returns:
            [amplify.BinaryPoly]: \\sum_{j=1}^{M}(P_{avg}-P(j))^2 / M
        """
        return sum_poly(
            self.num_users,
            lambda j: (self.room_average_satisfaction() - self.someone_total_satisfaction(j)) ** 2
        ) / self.num_users

    def time_constraint(self):
        """時間制約

        Returns:
            [amplify.BinaryConstraint]: (\\sum_{i=1}^{N}(t_{i}x_{i}) - T)^2
        """
        return penalty(
            (
                self.time_limit
                - sum_poly(self.num_tracks, lambda i: self.q[i] * (self.candidates[i].duration_ms // 1000))
            ) ** 2
        )
