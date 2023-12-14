from backend.server.bo.BuisnessObject import BusinessObject

class Comment(BusinessObject):
    def __init__(self):
        super().__init__()
        self._comment_id = 0
        self._comment = ""
        self._creationdate = ""
        self._user_id = 0
        self._task_id = 0

    def get_comment_id(self):
        return self._comment_id

    def set_comment_id(self, comment_id):
        self._comment_id = comment_id

    def get_comment(self):
        return self._comment

    def set_comment(self, comment):
        self._comment = comment

    def get_creationdate(self):
        return self._creationdate

    def set_creationdate(self, creationdate):
        self._creationdate = creationdate

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    def get_task_id(self):
        return self._task_id

    def set_task_id(self, task_id):
        self._task_id = task_id

    def __str__(self):
        return "comment_id: {}\ncomment: {}\ncreationdate: {}\nuser_id: {}\ntask_id: {}\n".format(
            self._comment_id, self._comment, self._creationdate, self._user_id, self._task_id)

    @staticmethod
    def from_dict(dictio=dict()):
        obj = Comment()
        obj.set_comment_id(dictio["comment_id"])
        obj.set_comment(dictio["comment"])
        obj.set_creationdate(dictio["creationdate"])
        obj.set_user_id(dictio["user_id"])
        obj.set_task_id(dictio["task_id"])

        return obj
