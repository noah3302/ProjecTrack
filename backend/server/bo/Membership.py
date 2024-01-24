from server.bo.BuisnessObject import BusinessObject

class Membership(BusinessObject):
    def __init__(self):
        super().__init__()
        self._user_id = ""
        self._project_id = ""

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id

    def __str__(self):
        return "user_id: {}\nproject_id: {}\n".format(self._user_id, self._project_id)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Membership()
        obj.set_user_id(dictio["user_id"])
        obj.set_project_id(dictio["project_id"])

        return obj