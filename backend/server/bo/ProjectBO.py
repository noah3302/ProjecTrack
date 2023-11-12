from backend.server.bo.BuisnessObject import BusinessObject


class Project(BusinessObject):
    def __init__(self):
        super().__init__()
        self._project_title = ""
        self._project_description = ""
        self._founder = ""
        self._start_date = ""
        self._end_date = ""

    def get_id(self):
        return self._id

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


    def get_start_date(self):
        return self._start_date

    def set_start_date(self, start_date):
        self._start_date = start_date

    def get_end_date(self):
        return self._end_date

    def set_end_date(self, end_date):
        self._end_date = end_date


    def __str__(self):
        return "project_id: {}\nproject_title: {}\nproject_description: {}\nfounder: {}\nstart_date: {}\nend_date: {}\n".format(self.get_id(),
                                                                                    self._project_title,self._project_description,
                                                                                    self._founder, self._start_date, self._end_date,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Project()
        obj.set_id(dictio["project_id"])
        obj.set_project_description(dictio["project_description"])
        obj.set_project_title(dictio["project_title"])
        obj.set_founder(dictio["founder"])
        obj.set_start_date(dictio["start_date"])
        obj.set_end_date(dictio["end_date"])

        return obj