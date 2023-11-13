from backend.server.mapper.Mapper import Mapper
from backend.server.bo.Comment import Comment

class CommentMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT comment_id, comment, erstellungsdatum, user_id, task_id FROM comment")
        tuples = cursor.fetchall()

        for (comment_id, comment, erstellungsdatum, user_id, task_id) in tuples:
            comment_obj = Comment()
            comment_obj.set_comment_id(comment_id)
            comment_obj.set_comment(comment)
            comment_obj.set_erstellungsdatum(erstellungsdatum)
            comment_obj.set_user_id(user_id)
            comment_obj.set_task_id(task_id)
            result.append(comment_obj)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT comment_id, comment, erstellungsdatum, user_id, task_id FROM comment WHERE comment_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (comment_id, comment, erstellungsdatum, user_id, task_id) = tuples[0]
            comment_obj = Comment()
            comment_obj.set_comment_id(comment_id)
            comment_obj.set_comment(comment)
            comment_obj.set_erstellungsdatum(erstellungsdatum)
            comment_obj.set_user_id(user_id)
            comment_obj.set_task_id(task_id)
            result = comment_obj

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_user_id(self, user_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT comment_id, comment, erstellungsdatum, user_id, task_id FROM comment WHERE user_id='{}'".format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (comment_id, comment, erstellungsdatum, user_id, task_id) in tuples:
            comment_obj = Comment()
            comment_obj.set_comment_id(comment_id)
            comment_obj.set_comment(comment)
            comment_obj.set_erstellungsdatum(erstellungsdatum)
            comment_obj.set_user_id(user_id)
            comment_obj.set_task_id(task_id)
            result.append(comment_obj)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_task_id(self, task_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT comment_id, comment, erstellungsdatum, user_id, task_id FROM comment WHERE task_id='{}'".format(task_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (comment_id, comment, erstellungsdatum, user_id, task_id) in tuples:
            comment_obj = Comment()
            comment_obj.set_comment_id(comment_id)
            comment_obj.set_comment(comment)
            comment_obj.set_erstellungsdatum(erstellungsdatum)
            comment_obj.set_user_id(user_id)
            comment_obj.set_task_id(task_id)
            result.append(comment_obj)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_comment(self, keyword):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT comment_id, comment, erstellungsdatum, user_id, task_id FROM comment WHERE comment LIKE '%{}%'".format(keyword)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (comment_id, comment, erstellungsdatum, user_id, task_id) in tuples:
            comment_obj = Comment()
            comment_obj.set_comment_id(comment_id)
            comment_obj.set_comment(comment)
            comment_obj.set_erstellungsdatum(erstellungsdatum)
            comment_obj.set_user_id(user_id)
            comment_obj.set_task_id(task_id)
            result.append(comment_obj)

        self._cnx.commit()
        cursor.close()
        return result


    def insert(self, comment):
        cursor = self._cnx.cursor()
        command = "INSERT INTO comment (comment_id, comment, erstellungsdatum, user_id, task_id) VALUES (%s, %s, %s, %s, %s)"
        data = (
            comment.get_comment_id(), comment.get_comment(), comment.get_erstellungsdatum(),
            comment.get_user_id(), comment.get_task_id()
        )
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return comment

    def update(self, comment):
        cursor = self._cnx.cursor()

        command = "UPDATE comment SET comment=%s, erstellungsdatum=%s, user_id=%s, task_id=%s WHERE comment_id=%s"
        data = (
            comment.get_comment(), comment.get_erstellungsdatum(), comment.get_user_id(),
            comment.get_task_id(), comment.get_comment_id()
        )

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, comment):
        cursor = self._cnx.cursor()
        command = "DELETE FROM comment WHERE comment_id='{}'".format(comment.get_comment_id())
        cursor.execute(command)
        self._cnx.commit()

if __name__ == "__main__":
    with CommentMapper() as mapper:
        result = mapper.find_by_key(2)
        print(result)
