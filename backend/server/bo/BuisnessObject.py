from abc import ABC

"""BusinessObject bildet die Supperklasse der anderen Klassen, sie vererbt das Attribut id"""
class BusinessObject(ABC):
    def __init__(self):
        self._id = 0

    def set_id(self, value):
        self._id = value

    def get_id(self):
        return self._id