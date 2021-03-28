from src.domain import Track, User
from src.interface.driver import FirestoreDriver
from src.interface.repository import UserRepository


class UserRepositoryImpl(UserRepository):
    firestore_driver: FirestoreDriver

    def __init__(self, firestore_driver: FirestoreDriver):
        self.firestore_driver = firestore_driver

    def get_user(self, user_id: str) -> User:
        user_dict = self.firestore_driver.get_user(user_id)
        track_dicts = self.firestore_driver.get_user_tracks(user_id)
        tracks = [
            Track(
                id=track_dict["id"],
                name=track_dict["name"],
                duration_ms=track_dict["duration_ms"],
                priority=track_dict["priority"],
                artist=track_dict["artist"],
                small_image=track_dict["small_image"],
                preview_url=track_dict["preview_url"]
            )
            for track_dict in track_dicts
        ]

        return User(
            id=user_dict["id"],
            slug=user_dict["slug"],
            display_name=user_dict["display_name"],
            tracks=tracks
        )
