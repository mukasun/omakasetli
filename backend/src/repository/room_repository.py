from dataclasses import asdict
from typing import List

from src.domain import Setlist, Track, User
from src.interface.driver import FirestoreDriver
from src.interface.repository import RoomRepository
from src.rest import ServerException


class RoomRepositoryImpl(RoomRepository):
    firestore_driver: FirestoreDriver

    def __init__(self, firestore_driver: FirestoreDriver):
        self.firestore_driver = firestore_driver

    def get_members(self, room_id: str) -> List[User]:
        member_dicts = self.firestore_driver.get_room_members(room_id)

        if member_dicts is None:
            raise ServerException("Not found room members")

        members = []

        for member_dict in member_dicts:
            user_id = member_dict["id"]
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

            members.append(
                User(
                    id=member_dict["id"],
                    slug=member_dict["slug"],
                    display_name=member_dict["display_name"],
                    tracks=tracks
                )
            )

        return members

    def save_setlist(self, room_id: str, setlist: Setlist):
        self.firestore_driver.add_room_setlist(room_id, asdict(setlist))
