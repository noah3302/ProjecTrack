from backend.server.bo.BuisnessObject import BusinessObject

class Task(BusinessObject):
    def __init__(self):
        super().__init__()
        self._tasktitle = ""
        self._desciption = ""
        self._duedate = ""
        self._user_id = ""
        self._phasen_id = ""

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

    def get_phasen_id(self):
        return self._phasen_id

    def set_phasen_id(self, phasen_id):
        self._phasen_id = phasen_id

    def __str__(self):
        return "task_id: {}\ntasktitle: {}\ndescription: {}\nduedate: {}\nuser_id: {}\nphasen_id {}\n".format(
                                                                                self.get_id(), self._tasktitle,
                                                                                    self._description, self._duedate,
                                                                                    self._user_id, self._phasen_id,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Task()
        obj.set_id(dictio["task_id"])
        obj.set_tasktitle(dictio["tasktitle"])
        obj.set_description(dictio["description"])
        obj.set_duedate(dictio["duedate"])
        obj.set_user_id(dictio["user_id"])
        obj.set_phasen_id(dictio["phasen_id"])

        return obj