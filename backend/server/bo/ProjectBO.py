from server.bo.BuisnessObject import BusinessObject

"""Klasse (Project), die von einer anderen Klasse (BusinessObject) erbt"""
class Project(BusinessObject):
    def __init__(self):
        super().__init__()
        self._project_title = ""
        self._project_description = ""
        self._founder = 0
        self._manager = 0
        self._start_date = ""
        self._end_date = ""

    """ 

    Get (lesen von Daten) - und Set (ändern und zuweisen von Daten) Methoden

    """

    def get_project_title(self):
        return self._project_title

    def set_project_title(self, project_title):
        self._project_title = project_title

    def get_project_description(self):
        return self._project_description

    def set_project_description(self, project_description):
        self._project_description = project_description

    def get_founder(self):
        return self._founder

    def set_founder(self, founder):
        self._founder = founder

    def get_manager(self):
        return self._manager

    def set_manager(self, manager):
        self._manager = manager

    def get_start_date(self):
        return self._start_date

    def set_start_date(self, start_date):
        self._start_date = start_date

    def get_end_date(self):
        return self._end_date

    def set_end_date(self, end_date):
        self._end_date = end_date


    def __str__(self):
        return ("id: {}\nproject_title: {}\nproject_description: {}\nfounder: {}\nmanager: {}\nstart_date: {}\nend_date: {}\n"
                                                                                    .format(self.get_id(),
                                                                                    self._project_title,
                                                                                    self._project_description,
                                                                                    self._founder, self._manager,
                                                                                    self._start_date, self._end_date,))

    """statische Methode für eine Klasse"""
    @staticmethod
    def from_dict(dictio=None):
        if dictio is None:
            dictio = dict()
        """Erstellt ein Objekt (Projekt)"""
        obj = Project()
        """Weisst dem Objekt Attribute zu"""
        obj.set_id(dictio["id"])
        obj.set_project_description(dictio["project_description"])
        obj.set_project_title(dictio["project_title"])
        obj.set_founder(dictio["founder"])
        obj.set_manager(dictio["manager"])
        obj.set_start_date(dictio["start_date"])
        obj.set_end_date(dictio["end_date"])

        return obj