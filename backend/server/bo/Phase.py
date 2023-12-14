from backend.server.bo.BuisnessObject import BusinessObject


class Phase(BusinessObject):
    def __init__(self):
        super().__init__()
        self._id=""
        self._phasename = ""
        self._indx = ""
        self._project_id = ""

    def get_id(self):
        return self._id

    def get_phasename(self):
        return self._phasename

    def set_phasename(self, phasename):
        self._phasename = phasename

    def get_indx(self):
        return self._indx

    def set_indx(self, indx):
        self._indx = indx


    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id


    def __str__(self):
        return "phases_id: {}\nphasename: {}\nindx {}\nproject_id {}\n".format(self.get_id(),
                                                 self._phasename, self._indx, self._project_id)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Phase()
        obj.set_id(dictio["phases_id"])
        obj.set_phasenname(dictio["phasename"])
        obj.set_indx(dictio["index"])
        obj.set_project_id(dictio["project_id"])

        return obj