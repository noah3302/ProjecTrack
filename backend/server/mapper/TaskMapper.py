from backend.server.mapper.Mapper import Mapper
from backend.server.bo.Task import Task

class TaskMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT task_id, taskname, beschreibung, enddate, user_id, phasen_id FROM task")
        tuples = cursor.fetchall()

        for (task_id, taskname, beschreibung, enddate, user_id, phasen_id) in tuples:
            task = Task()
            task.set_task_id(task_id)
            task.set_taskname(taskname)
            task.set_beschreibung(beschreibung)
            task.set_enddate(enddate)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result.append(task)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT task_id, taskname, beschreibung, enddate, user_id, phasen_id FROM task WHERE task_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (task_id, taskname,beschreibung, enddatum, user_id, phasen_id) = tuples[0]
            task = Task()
            task.set_task_id(task_id)
            task.set_taskname(taskname)
            task.set_beschreibung(beschreibung)
            task.set_enddatum(enddatum)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result = task

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_user_id(self, user_id):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT task_id, taskname, beschreibung, enddate, user_id, phasen_id FROM task WHERE task_id='{}'".format(
        user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (task_id, taskname, beschreibung, enddatum, user_id, phasen_id) = tuples[0]
            task = Task()
            task.set_task_id(task_id)
            task.set_taskname(taskname)
            task.set_beschreibung(beschreibung)
            task.set_enddatum(enddatum)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result = task

        except IndexError:
            result = None

            self._cnx.commit()
            cursor.close()
            return result

    def find_by_phasen_id(self, phasen_id):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT task_id, taskname, beschreibung, enddatum, user_id, phasen_id FROM task WHERE task_id='{}'".format(
            phasen_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (task_id, taskname, beschreibung, enddatum, user_id, phasen_id) = tuples[0]
            task = Task()
            task.set_task_id(task_id)
            task.set_taskname(taskname)
            task.set_beschreibung(beschreibung)
            task.set_enddatum(enddatum)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result = task

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, task_id):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM task")
        count = cursor.fetchone()[0]
        if count == 0:
            task.set_id(1)
        else:
            cursor.execute("SELECT MAX(task_id) AS maxid FROM task")
            maxid = cursor.fetchone()[0]
            task.set_id(maxid + 1)
        command = "INSERT INTO task (task_id, taskname, beschreibung, enddatum, user_id, phasen_id) VALUES (%s, %s, %s, %s, %s)"
        data = (task.get_task_id(), task.get_taskname(), user.get_beschreibung(), user.get_enddatum(), user.get_user_id(), user.get_phasen_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return task

    def update(self, task):
        cursor = self._cnx.cursor()

        command = "UPDATE task SET task_id=%s, taskname=%s, beschreibung=%s, enddatum=%s, user_id=%s, phasen_id=%s WHERE task_id=%s"
        data = (task.get_task_id(), task.get_taskname(), task.get_enddatum(), task.get_user_id(), task.get_phasen_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, task):
        cursor = self._cnx.cursor()
        command = "DELETE FROM task WHERE task_id='{}'".format(task.get_id())
        cursor.execute(command)
        self._cnx.commit()

if __name__ == "__main__":
    with TaskMapper() as mapper:
        result = mapper.find_by_key(2)
        print(result)