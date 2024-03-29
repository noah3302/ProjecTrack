from server.bo.BuisnessObject import BusinessObject

"""Klasse (Phase), die von einer anderen Klasse (BusinessObject) erbt"""
class Phase(BusinessObject):
    def __init__(self):
        super().__init__()
        self._phasename = ""
        self._ranking = 0
        self._project_id = 0

    """ 

    Get (lesen von Daten) - und Set (ändern und zuweisen von Daten) Methoden

    """
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

    """statische Methode für eine Klasse"""
    @staticmethod
    def from_dict(dictio=dict()):
        """Erstellt ein Objekt (Phase)"""
        obj = Phase()
        """Weist dem Objekt Attribute zu"""
        obj.set_id(dictio["id"])
        obj.set_phasename(dictio["phasename"])
        obj.set_ranking(dictio["ranking"])
        obj.set_project_id(dictio["project_id"])

        return obj