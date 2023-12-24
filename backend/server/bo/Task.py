from server.bo.BuisnessObject import BusinessObject

class Task(BusinessObject):
    def __init__(self):
        super().__init__()
        self._tasktitle = ""
        self._description = ""
        self._duedate = ""
        self._user_id = ""
        self._phases_id = ""

    def get_id(self):
        return self._id

    def get_tasktitle(self):
        return self._tasktitle

    def set_tasktitle(self, tasktitle):
        self._tasktitle = tasktitle

    def get_description(self):
        return self._description

    def set_description(self, description):
        self._description = description

    def get_duedate(self):
        return self._duedate
    def set_duedate(self, duedate):
        self._duedate = duedate

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    def get_phases_id(self):
        return self._phases_id

    def set_phases_id(self, phases_id):
        self._phases_id = phases_id

    def __str__(self):
        return "id: {}\ntasktitle: {}\ndescription: {}\nduedate: {}\nuser_id: {}\nphases_id {}\n".format(
                                                                                self.get_id(), self._tasktitle,
                                                                                    self._description, self._duedate,
                                                                                    self._user_id, self._phases_id,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Task()
        obj.set_id(dictio["id"])
        obj.set_tasktitle(dictio["tasktitle"])
        obj.set_description(dictio["description"])
        obj.set_duedate(dictio["duedate"])
        obj.set_user_id(dictio["user_id"])
        obj.set_phases_id(dictio["phases_id"])

        return obj