from abc import ABCMeta, abstractmethod

from src.domain import Setlist


class SolverUsecase(metaclass=ABCMeta):
    @abstractmethod
    def solve(self, room_id: str, time_limit: int, c_weight: float, timeout: int, num_unit_step: int) -> Setlist:
        raise NotImplementedError
