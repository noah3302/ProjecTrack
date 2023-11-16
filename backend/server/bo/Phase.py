from backend.server.bo.BuisnessObject import BusinessObject


class Phase(BusinessObject):
    def __init__(self):
        super().__init__()
        self._phasenname = ""
        self._projekt_id = ""

    def get_id(self):
        return self._id

    def get_phasenname(self):
        return self._phasenname

    def set_phasenname(self, phasenname):
        self._phasenname = phasenname


    def get_projekt_id(self):
        return self._projekt_id

    def set_projekt_id(self, projekt_id):
        self._projekt_id = projekt_id


    def __str__(self):
        return "id: {}\nphasenname: {}\nprojekt_id {}\n".format(self.get_id(),
                                                 self._phasenname, self._projekt_id)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Phase()
        obj.set_id(dictio["id"])
        obj.set_phasenname(dictio["phasenname"])
        obj.set_projekt_id(dictio["projekt_id"])

        return obj