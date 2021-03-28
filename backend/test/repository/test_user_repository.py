from typing import List, Union
from unittest import TestCase
from unittest.mock import MagicMock

from src.domain import Track, User
from src.interface.driver import FirestoreDriver
from src.repository import UserRepositoryImpl


class DriverMock(FirestoreDriver):
    def get_room(self, room_id: str) -> Union[dict, None]:
        raise NotImplementedError

    def get_user(self, user_id: str) -> Union[dict, None]:
        raise NotImplementedError

    def get_room_members(self, room_id: str) -> List[dict]:
        raise NotImplementedError

    def get_user_tracks(self, user_id: str) -> List[dict]:
        raise NotImplementedError


class TestUserRepository(TestCase):

    def test_get_user(self):
        user_dict_mock = {"id": "user1", "slug": "taro", "display_name": "Suzuki Taro"}
        track_dict_mocks = [
            {"id": "001", "name": "track1", "priority": 1, "duration_ms": 1000, "artist": "artist", "preview_url": "", "small_image": ""},
            {"id": "002", "name": "track2", "priority": 2, "duration_ms": 2000, "artist": "artist", "preview_url": "", "small_image": ""},
            {"id": "003", "name": "track3", "priority": 3, "duration_ms": 3000, "artist": "artist", "preview_url": "", "small_image": ""}
        ]
        get_user_mock = MagicMock(return_value=user_dict_mock)
        get_user_tracks_mock = MagicMock(return_value=track_dict_mocks)

        driver = DriverMock()
        driver.get_user = get_user_mock
        driver.get_user_tracks = get_user_tracks_mock
        repository = UserRepositoryImpl(firestore_driver=driver)

        self.assertEqual(
            repository.get_user(user_dict_mock["id"]),
            User(
                id=user_dict_mock["id"],
                slug=user_dict_mock["slug"],
                display_name=user_dict_mock["display_name"],
                tracks=[Track(**t) for t in track_dict_mocks]
            )
        )
        get_user_mock.assert_called_with(user_dict_mock["id"])
        get_user_tracks_mock.assert_called_with(user_dict_mock["id"])
