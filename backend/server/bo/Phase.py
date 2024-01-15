from server.bo.BuisnessObject import BusinessObject


class Phase(BusinessObject):
    def __init__(self):
        super().__init__()
        self._phasename = ""
        self._ranking = 0
        self._project_id = ""

    def get_id(self):
        return self._id

    def get_phasename(self):
        return self._phasename

    def set_phasename(self, phasename):
        self._phasename = phasename

    def get_ranking(self):
        return self._ranking

    def set_ranking(self, ranking):
        self._ranking = ranking


    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id


    def __str__(self):
        return "id: {}\nphasename: {}\nranking: {}\nproject_id: {}\n".format(self.get_id(),
                                                 self._phasename, self._ranking, self._project_id,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Phase()
        obj.set_id(dictio["id"])
        obj.set_phasename(dictio["phasename"])
        obj.set_ranking(dictio["ranking"])
        obj.set_project_id(dictio["project_id"])

        return obj