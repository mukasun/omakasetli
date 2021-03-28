from src.domain import Setlist
from src.interface.repository import RoomRepository
from src.interface.usecase import SolverUsecase
from src.solver import QuboSolver


class SolverInteractor(SolverUsecase):
    room_repository: RoomRepository

    def __init__(self, room_repository: RoomRepository):
        self.room_repository = room_repository

    def solve(self, room_id: str, time_limit: int) -> Setlist:
        room_members = self.room_repository.get_members(room_id)
        solver = QuboSolver(room_members, time_limit)
        setlist = solver.solve()
        self.room_repository.save_setlist(room_id, setlist)
        return setlist
