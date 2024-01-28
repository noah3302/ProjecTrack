from server.bo.BuisnessObject import BusinessObject

"""Klasse (Task), die von einer anderen Klasse (BusinessObject) erbt"""
class Task(BusinessObject):
    def __init__(self):
        super().__init__()
        self._tasktitle = ""
        self._description = ""
        self._score = 0
        self._duedate = ""
        self._user_id = 0
        self._phases_id = 0
        self._creator_id = 0

    """ 

    Get (lesen von Daten) - und Set (ändern und zuweisen von Daten) Methoden

    """
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

    def get_score(self):
        return self._score

    def set_score(self, score):
        self._score = score

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

    def get_creator_id(self):
        return self._creator_id

    def set_creator_id(self, creator_id):
        self._creator_id = creator_id

    def __str__(self):
        return "id: {}\ntasktitle: {}\ndescription: {}\nscore: {}\nduedate: {}\nuser_id: {}\nphases_id: {}\ncreator_id: {}\n".format(
            self.get_id(), self._tasktitle, self._description, self._score,
            self._duedate, self._user_id, self._phases_id, self._creator_id)

    """statische Methode für eine Klasse"""
    @staticmethod
    def from_dict(dictio=dict()):
        """Erstellt ein Objekt (Task)"""
        obj = Task()
        """Weisst dem Objekt Attribute zu"""
        obj.set_id(dictio["id"])
        obj.set_tasktitle(dictio["tasktitle"])
        obj.set_description(dictio["description"])
        obj.set_score(dictio["score"])
        obj.set_duedate(dictio["duedate"])
        obj.set_user_id(dictio["user_id"])
        obj.set_phases_id(dictio["phases_id"])
        obj.set_creator_id(dictio["creator_id"])

        return obj
