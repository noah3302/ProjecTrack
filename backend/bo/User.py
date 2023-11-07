from backend.bo.BuisnessObject import BusinessObject


class User(BusinessObject):
    def __init__(self):
        super().__init__()
        self._nachname = ""
        self._vorname = ""
        self._nickname = ""
        self._google_id = ""

    def get_id(self):
        return self._id

    def get_nachname(self):
        return self._nachname

    def set_nachname(self, nachname):
        self._nachname = nachname

    def get_vorname(self):
        return self._vorname

    def set_vorname(self, vorname):
        self._vorname = vorname

    def get_nickname(self):
        return self._nickname

    def set_nickname(self, nickname):
        self._nickname = nickname


    def get_google_id(self):
        return self._google_id

    def set_google_id(self, google_id):
        self._google_id = google_id


    def __str__(self):
        return "user_id: {}\nnachname: {}\nvorname: {}\nnickname: {}\ngoogle_id: {}\n".format(self.get_id(),
                                                                                    self._nachname,self._vorname,
                                                                                    self._nickname, self._google_id,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = User()
        obj.set_id(dictio["user_id"])
        obj.set_nachname(dictio["nachname"])
        obj.set_vorname(dictio["vorname"])
        obj.set_nickname(dictio["nickname"])
        obj.set_google_id(dictio["google_id"])

        return obj