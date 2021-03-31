import os
import pickle
from typing import List, Union

from src.interface.driver import FirestoreDriver


class SampleDriverImpl(FirestoreDriver):
    def get_room(self, room_id: str) -> Union[dict, None]:
        return self.__restore_cache(f"room_{room_id}")

    def get_user(self, user_id: str) -> Union[dict, None]:
        return self.__restore_cache(f"user_{user_id}")

    def get_room_members(self, room_id: str) -> List[dict]:
        return self.__restore_cache(f"room_members_{room_id}")

    def get_user_tracks(self, user_id: str) -> Union[List[dict], None]:
        return self.__restore_cache(f"user_tracks_{user_id}")

    def add_room_setlist(self, room_id: str, setlist: dict):
        pass

    def __restore_cache(self, cache_key) -> Union[dict, List[dict], None]:
        cache_data = None
        cache_file = os.path.join(os.path.dirname(__file__), f"cache/{cache_key}.pkl")
        try:
            with open(cache_file, "rb") as f:
                cache_data = pickle.load(f)
        except Exception as e:
            print("cache miss!")
        return cache_data
