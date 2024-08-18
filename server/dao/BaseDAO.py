from abc import abstractmethod

class BaseDAO:
    @abstractmethod
    def get_client():
        ...