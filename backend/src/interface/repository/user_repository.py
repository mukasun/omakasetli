from abc import ABCMeta, abstractmethod

from src.domain import User


class UserRepository(metaclass=ABCMeta):
    @abstractmethod
    def get_user(self, user_id: str) -> User:
        raise NotImplementedError
