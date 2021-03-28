from dataclasses import asdict

from flask import jsonify
from src.interface.usecase import SolverUsecase


class SolverResource:
    solver_usecase: SolverUsecase

    def __init__(self, solver_usecase: SolverUsecase):
        self.solver_usecase = solver_usecase

    def solve(self, room_id: str, time_limit: int, c_weight: float, timeout: int, num_unit_step: int):
        setlist = self.solver_usecase.solve(room_id, time_limit, c_weight, timeout, num_unit_step)
        return jsonify(asdict(setlist))
