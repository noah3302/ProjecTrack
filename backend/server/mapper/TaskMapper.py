from backend.server.mapper.Mapper import Mapper
from backend.server.bo.Task import Task

class TaskMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT task_id, tasktitle, description, duedate, user_id, phasen_id FROM task")
        tuples = cursor.fetchall()

        for (task_id, tasktitle, description, duedate, user_id, phasen_id) in tuples:
            task = Task()
            task.set_id(task_id)
            task.set_tasktitle(tasktitle)
            task.set_description(description)
            task.set_duedate(duedate)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result.append(task)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT task_id, tasktitle, description, duedate, user_id, phasen_id FROM task WHERE task_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (task_id, tasktitle,description, duedate, user_id, phasen_id) = tuples[0]
            task = Task()
            task.set_id(task_id)
            task.set_tasktitle(tasktitle)
            task.set_description(description)
            task.set_duedate(duedate)
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
        command = "SELECT task_id, tasktitle, description, duedate, user_id, phasen_id FROM task WHERE task_id='{}'".format(
        user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (task_id, tasktitle, description, duedate, user_id, phasen_id) = tuples[0]
            task = Task()
            task.set_id(task_id)
            task.set_tasktitle(tasktitle)
            task.set_description(description)
            task.set_duedate(duedate)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result = task

        except IndexError:
            result = None

            self._cnx.commit()
            cursor.close()
            return result

    def find_by_phase_id(self, key):
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT task_id, tasktitle, description, duedate, user_id, phasen_id FROM task WHERE phasen_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (task_id, tasktitle, description, duedate, user_id, phasen_id,) in tuples:
            task = Task()
            task.set_id(task_id)
            task.set_tasktitle(tasktitle)
            task.set_description(description)
            task.set_duedate(duedate)
            task.set_user_id(user_id)
            task.set_phasen_id(phasen_id)
            result.append(task)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_phase_id_and_user_id(self, phasen_id, user_id):
        result = []  # Initialisiere result als leere Liste

        cursor = self._cnx.cursor()
        command = ("SELECT task_id FROM task WHERE phasen_id='{}' and user_id = '{}'").format(phasen_id, user_id)
        cursor.execute(command)
        task_ids = cursor.fetchall()

        for (task_id,) in task_ids:
            result.append(task_id)  # Füge die task_id zur Ergebnisliste hinzu

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, task):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM task")
        count = cursor.fetchone()[0]
        if count == 0:
            task.set_id(1)
        else:
            cursor.execute("SELECT MAX(task_id) AS maxid FROM task")
            maxid = cursor.fetchone()[0]
            task.set_id(maxid + 1)
        command = "INSERT INTO task (task_id, tasktitle, description, duedate, user_id, phasen_id) VALUES (%s, %s, %s, %s, %s)"
        data = (task.get_id(), task.get_tasktitle(), task.get_description(), task.get_duedate(), task.get_user_id(), task.get_phasen_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return task

    def update(self, task):
        cursor = self._cnx.cursor()

        command = "UPDATE task SET task_id=%s, tasktitle=%s, description=%s, duedate=%s, user_id=%s, phasen_id=%s WHERE task_id=%s"
        data = (task.get_id(), task.get_tasktitle(), task.get_duedate(), task.get_user_id(), task.get_phasen_id())

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
        result = mapper.find_by_phase_id(1)
        print(result)
        #for f in result:
            #print(f)