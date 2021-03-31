from src.domain import Track, User
from src.interface.driver import FirestoreDriver


class SampleRepository:
    driver: FirestoreDriver

    def __init__(self, driver: FirestoreDriver):
        self.driver = driver

    def get_tracks(self, user_id: str) -> User:
        track_dicts = self.driver.get_user_tracks(user_id)
        return [
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
