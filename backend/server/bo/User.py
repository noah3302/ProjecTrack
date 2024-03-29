from server.bo.BuisnessObject import BusinessObject


"""Klasse (User), die von einer anderen Klasse (BusinessObject)erbt"""
class User(BusinessObject):
    def __init__(self):
        super().__init__()
        self._surname = ""
        self._name = ""
        self._nickname = ""
        self._google_id = ""

    """ 

    Get (lesen von Daten) - und Set (ändern und zuweisen von Daten) Methoden

    """
    def get_id(self):
        return self._id

    def get_surname(self):
        return self._surname

    def set_surname(self, surname):
        self._surname = surname

    def get_name(self):
        return self._name

    def set_name(self, name):
        self._name = name

    def get_nickname(self):
        return self._nickname

    def set_nickname(self, nickname):
        self._nickname = nickname


    def get_google_id(self):
        return self._google_id

    def set_google_id(self, google_id):
        self._google_id = google_id


    def __str__(self):
        return "id: {}\nsurname: {}\nname: {}\nnickname: {}\ngoogle_id: {}\n".format(self.get_id(),
                                                                                    self._surname, self._name,
                                                                                    self._nickname, self._google_id)
    """statische Methode für eine Klasse"""
    @staticmethod
    def from_dict(dictio=dict()):
        """Erstellt ein Objekt (User)"""
        obj = User()
        """Weisst Attribute dem Objekt zu"""
        obj.set_id(dictio["id"])
        obj.set_surname(dictio["surname"])
        obj.set_name(dictio["name"])
        obj.set_nickname(dictio["nickname"])
        obj.set_google_id(dictio["google_id"])

        return obj