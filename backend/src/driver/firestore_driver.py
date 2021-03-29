import os
import pickle
from typing import List, Union

import firebase_admin
from firebase_admin import credentials, firestore
from src.interface.driver import FirestoreDriver


class FirestoreDriverImpl(FirestoreDriver):
    cache_enabled: bool
    db: firestore._FirestoreClient

    def __init__(self, db: Union[firestore._FirestoreClient, None] = None, cache_enabled: bool = False) -> None:
        self.cache_enabled = cache_enabled
        if not db:
            if os.environ.get("ENV") == "production":
                cred = credentials.ApplicationDefault()
                firebase_admin.initialize_app(cred, {"projectId": "omakasetli"})
            else:
                service_account_file = os.path.join(os.path.dirname(__file__), "service-account.json")
                cred = credentials.Certificate(service_account_file)
                firebase_admin.initialize_app(cred)

            self.db = firestore.client()
        else:
            self.db = db

    def get_room(self, room_id: str) -> Union[dict, None]:
        ref = self.db.collection("rooms").document(room_id)
        room = self.__load_document(f"room-{room_id}", ref)
        return room

    def get_room_members(self, room_id: str) -> Union[List[dict], None]:
        ref = self.db.collection("rooms").document(room_id).collection("members").order_by('joined_at')
        members = self.__load_documents(f"room-{room_id}-members", ref)
        return members

    def get_user(self, user_id: str) -> Union[dict, None]:
        ref = self.db.collection("users").document(user_id)
        user = self.__load_document(f"user-{user_id}", ref)
        return user

    def get_user_tracks(self, user_id: str) -> Union[List[dict], None]:
        ref = self.db.collection("users").document(user_id).collection("tracks")
        tracks = self.__load_documents(f"user-{user_id}-tracks", ref)
        return tracks

    def add_room_setlist(self, room_id: str, setlist: dict):
        ref = self.db.collection("rooms").document(room_id).collection("setlists")
        ref.add(setlist)

    def __load_document(self, cache_key, ref) -> Union[dict, None]:
        data = self.__restore_cache(cache_key)
        if not data:
            doc = ref.get()
            if doc.exists:
                data = dict(doc.to_dict(), **{"id": doc.id})
                self.__save_cache(cache_key, data)
        return data

    def __load_documents(self, cache_key, ref) -> Union[List[dict], None]:
        data = self.__restore_cache(cache_key)
        if not data:
            docs = ref.stream()
            data = [dict(doc.to_dict(), **{"id": doc.id}) for doc in docs]
            if not len(data):
                return None
            self.__save_cache(cache_key, data)
        return data

    # [開発用] キャッシュ読み込み
    def __restore_cache(self, cache_key) -> Union[dict, List[dict], None]:
        if not self.cache_enabled:
            return None
        cache_data = None
        cache_file = os.path.join(os.path.dirname(__file__), f"cache/{cache_key}.pkl")
        try:
            with open(cache_file, "rb") as f:
                cache_data = pickle.load(f)
                print("cache hit!")
        except Exception as e:
            print("cache miss!")
        return cache_data

    # [開発用] キャッシュ保存
    def __save_cache(self, cache_key, data):
        if not self.cache_enabled:
            return None
        cache_file = os.path.join(os.path.dirname(__file__), f"cache/{cache_key}.pkl")
        with open(cache_file, "wb") as f:
            pickle.dump(data, f)
