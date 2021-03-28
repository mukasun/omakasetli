from abc import ABCMeta, abstractmethod
from typing import List, Union


class FirestoreDriver(metaclass=ABCMeta):
    @abstractmethod
    def get_room(self, room_id: str) -> Union[dict, None]:
        raise NotImplementedError

    @abstractmethod
    def get_user(self, user_id: str) -> Union[dict, None]:
        raise NotImplementedError

    @abstractmethod
    def get_room_members(self, room_id: str) -> List[dict]:
        raise NotImplementedError

    @abstractmethod
    def get_user_tracks(self, user_id: str) -> List[dict]:
        raise NotImplementedError

    @abstractmethod
    def add_room_setlist(self, room_id: str, setlist: dict):
        raise NotImplementedError
