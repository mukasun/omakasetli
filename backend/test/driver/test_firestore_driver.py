
from unittest import TestCase

from mockfirestore import MockFirestore
from src.driver.firestore_driver import FirestoreDriverImpl


class TestFirestoreDriverImpl(TestCase):
    def setUp(self):
        self.mock_db = MockFirestore()
        self.driver = FirestoreDriverImpl(db=self.mock_db, cache_enabled=False)

    def test_get_room(self):
        room_id = "test_room1"
        mock_room = {"name": "room-A"}
        self.mock_db.collection("rooms").document(room_id).set(mock_room)
        self.assertEqual(self.driver.get_room(room_id), dict(mock_room, **{"id": room_id}))

    def test_get_user(self):
        user_id = "test_user1"
        mock_user = {"name": "user-A"}
        self.mock_db.collection("users").document(user_id).set(mock_user)
        self.assertEqual(self.driver.get_user(user_id), dict(mock_user, **{"id": user_id}))

    def test_get_room_members(self):
        room_id = "test_room2"
        mock1 = {"name": "Suzuki Taro", "id": "t.suzuki"}
        mock2 = {"name": "Yamada Hanako", "id": "h.yamada"}
        self.mock_db.collection("rooms").document(room_id).collection("members").document(mock1["id"]).set(mock1)
        self.mock_db.collection("rooms").document(room_id).collection("members").document(mock2["id"]).set(mock2)
        self.assertEqual(self.driver.get_room_members(room_id), [mock2, mock1])

    def test_get_user_tracks(self):
        user_id = "test_user1"
        mock1 = {"name": "song-A", "id": "track1"}
        mock2 = {"name": "song-B", "id": "track2"}
        mock3 = {"name": "song-C", "id": "track3"}
        self.mock_db.collection("users").document(user_id).collection("tracks").document(mock1["id"]).set(mock1)
        self.mock_db.collection("users").document(user_id).collection("tracks").document(mock2["id"]).set(mock2)
        self.mock_db.collection("users").document(user_id).collection("tracks").document(mock3["id"]).set(mock3)
        self.assertEqual(self.driver.get_user_tracks(user_id), [mock1, mock2, mock3])
