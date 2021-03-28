from abc import ABCMeta, abstractmethod
from typing import List

from src.domain import User
from src.domain.setlist import Setlist


class RoomRepository(metaclass=ABCMeta):
    @abstractmethod
    def get_members(self, room_id: str) -> List[User]:
        raise NotImplementedError

    @abstractmethod
    def save_setlist(self, room_id: str, setlist: Setlist):
        raise NotImplementedError
