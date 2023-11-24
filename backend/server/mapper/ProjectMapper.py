from backend.server.mapper.Mapper import Mapper
from backend.server.bo.ProjectBO import Project


class ProjectMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM project")
        tuples = cursor.fetchall()

        for (project_id, project_title, start_date, end_date, founder, project_description) in tuples:
            project = Project()
            project.set_id(project_id)
            project.set_project_title(project_title)
            project.set_start_date(start_date)
            project.set_end_date(end_date)
            project.set_founder(founder)
            project.set_project_description(project_description)
            result.append(project)

        self._cnx.commit()
        cursor.close()
        return result

    def get_members_by_project_id(self, project_id):
        result = {}
        cursor = self._cnx.cursor()
        command = ("SELECT user.user_id, user.nickname FROM user JOIN mitglieder ON user.user_id = mitglieder.user_id "
                   "WHERE mitglieder.project_id = '{}';").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (user_id, nickname) in tuples:
            result[user_id] = nickname

        self._cnx.commit()
        cursor.close()
        return result

    def get_projects_by_user_id(self, user_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT project.* FROM project JOIN mitglieder ON project.project_id = mitglieder.project_id "
                   "WHERE mitglieder.user_id = '{}';").format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, title, discription, founder, startdate, enddate) in tuples:
            project = Project()
            project.set_id(id)
            project.set_project_title(title)
            project.set_project_description(discription)
            project.set_founder(founder)
            project.set_start_date(startdate)
            project.set_end_date(enddate)
            result.append(project)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM project WHERE project_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (project_id, project_title, start_date, end_date, founder, project_description) = tuples[0]
            project = Project()
            project.set_id(project_id)
            project.set_project_title(project_title)
            project.set_start_date(start_date)
            project.set_end_date(end_date)
            project.set_founder(founder)
            project.set_project_description(project_description)
            result = project

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, project):
        cursor = self._cnx.cursor()
        # Überprüfung, ob bereits Einträge vorhanden sind
        cursor.execute("SELECT COUNT(*) FROM project")
        count = cursor.fetchone()[0]
        if count == 0:
            project.set_id(1)
        else:
            cursor.execute("SELECT MAX(project_id) AS maxid FROM project")
            maxid = cursor.fetchone()[0]
            project.set_id(maxid + 1)
        command = "INSERT INTO project (project_id, project_title, start_date, end_date, founder, project_description) VALUES (%s, %s, %s, %s, %s, %s)"
        data = (project.get_project_id(),project.get_project_title(), project.get_start_date(), project.get_end_date(), project.get_founder(), project.get_project_description())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return project

    def update(self, project):
        cursor = self._cnx.cursor()

        command = "UPDATE project SET project_id=%s, project_title=%s, start_date=%s, end_date=%s, founder=%s, project_description=%s WHERE project_id=%s"
        data = (project.get_project_id(),project.get_project_title(), project.get_start_date(), project.get_end_date(), project.get_founder(), project.get_project_description())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, project):
        cursor = self._cnx.cursor()
        command = "DELETE FROM project WHERE project_id='{}'".format(project.get_id())
        cursor.execute(command)
        self._cnx.commit()


if __name__ == "__main__":
    with ProjectMapper() as mapper:
        result = mapper.get_project_by_user_id(1)
        for f in result:
            print(f)

