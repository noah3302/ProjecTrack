from backend.server.bo.BuisnessObject import BusinessObject


class Phase(BusinessObject):
    def __init__(self):
        super().__init__()
        self._id=""
        self._phasenname = ""
        self._indx = ""
        self._project_id = ""

    def get_id(self):
        return self._id

    def get_phasenname(self):
        return self._phasenname

    def set_phasenname(self, phasenname):
        self._phasenname = phasenname

    def get_indx(self):
        return self._indx

    def set_indx(self, indx):
        self._indx = indx


    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id


    def __str__(self):
        return "id: {}\nphasenname: {}\nindx {}\nproject_id {}\n".format(self.get_id(),
                                                 self._phasenname, self._indx, self._project_id)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Phase()
<<<<<<< Updated upstream
        obj.set_id(dictio["id"])
        obj.set_phasenname(dictio["phasenname"])
=======
        obj.set_id(dictio["phases_id"])
        obj.set_phasename(dictio["phasename"])
>>>>>>> Stashed changes
        obj.set_indx(dictio["index"])
        obj.set_project_id(dictio["project_id"])

        return obj