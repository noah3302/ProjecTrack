from backend.server.bo.BuisnessObject import BusinessObject

class Task(BusinessObject):
    def __init__(self):
        super().__init__()
        self._taskname = ""
        self._beschreibung = ""
        self._enddatum = ""
        self._user_id =""
        self._phasen_id = ""

    def get_id(self):
        return self._id

    def get_taskname(self):
        return self._taskname

    def set_taskname(self, taskname):
        self._taskname = taskname

    def get_beschreibung(self):
        return self._beschreibung

    def set_beschreibung(self, beschreibung):
        self._beschreibung = beschreibung

    def get_enddatum(self):
        return self._enddatum
    def set_enddatum(self, enddatum):
        self._enddatum = enddatum

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    def get_phasen_id(self):
        return self._phasen_id

    def set_phasen_id(self, phasen_id):
        self._phasen_id = phasen_id

    def __str__(self):
        return "task_id: {}\ntaskname: {}\nbeschreibung: {}\nenddatum: {}\nuser_id: {}\nphasen_id {}\n".format(
                                                                                self.get_id(), self._taskname,
                                                                                    self._beschreibung, self._enddatum,
                                                                                    self._user_id, self._phasen_id,)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Task()
        obj.set_id(dictio["task_id"])
        obj.set_taskname(dictio["taskname"])
        obj.set_beschreibung(dictio["beschreibung"])
        obj.set_enddatum(dictio["enddatum"])
        obj.set_user_id(dictio["user_id"])
        obj.set_phasen_id(dictio["phasen_id"])

        return obj