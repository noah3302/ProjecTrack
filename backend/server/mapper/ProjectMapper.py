from server.mapper.Mapper import Mapper
from server.bo.ProjectBO import Project
import json


class ProjectMapper(Mapper):
    def __init__(self):
        super().__init__()

    """Dictionary mit User-ID und den dazugehörigen Nicknames"""
    def get_members_by_project_id(self, project_id):
        result = {}
        cursor = self._cnx.cursor()
        command = ("SELECT user.user_id, user.nickname FROM user JOIN members ON user.user_id = members.user_id "
                   "WHERE members.project_id = '{}';").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (user_id, nickname) in tuples:
            result[user_id] = nickname

        self._cnx.commit()
        cursor.close()
        return result

    """Liste von Projekten, die Nutzer enthalten, basierend auf die User-ID"""
    def get_projects_by_user_id(self, user_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT project.* FROM project JOIN members ON project.project_id = members.project_id "
                   "WHERE members.user_id = '{}';").format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, title, description, founder, manager, startdate, enddate) in tuples:
            project = Project()
            project.set_id(id)
            project.set_project_title(title)
            project.set_project_description(description)
            project.set_founder(founder)
            project.set_manager(manager)
            project.set_start_date(startdate.isoformat())
            project.set_end_date(enddate.isoformat())
            result.append(project)

        self._cnx.commit()
        cursor.close()
        return result

    """Projekt wird basierend auf die Projekt-ID gesucht"""
    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM project WHERE project_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (project_id, title, description, founder, manager, start_date, end_date ) = tuples[0]
            project = Project()
            project.set_id(project_id)
            project.set_project_title(title)
            project.set_project_description(description)
            project.set_founder(founder)
            project.set_manager(manager)
            project.set_start_date(start_date)
            project.set_end_date(end_date)
            result = project

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    """Neues Projekt wird in der DB-Tabelle gespeichert (Projekt-Tabelle)"""
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
        command = "INSERT INTO project (project_id, title, startdate, enddate, founder, manager, description) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        data = (project.get_id(), project.get_project_title(), project.get_start_date(), project.get_end_date(),
                project.get_founder(), project.get_manager(), project.get_project_description())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return project

    """Proejkt wird geupdted in der DB"""
    def update(self, project):
        cursor = self._cnx.cursor()

        command = "UPDATE project SET title=%s, description=%s, founder=%s, manager=%s, startdate=%s, enddate=%s WHERE project_id=%s"
        data = (project.get_project_title(),project.get_project_description(),project.get_founder(),
                project.get_manager(), project.get_start_date(), project.get_end_date(), project.get_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return project

    """Projekt wird gelöscht"""
    def delete(self, project):
        cursor = self._cnx.cursor()
        command = "DELETE FROM project WHERE project_id='{}'".format(project)
        cursor.execute(command)
        self._cnx.commit()


if __name__ == "__main__":
    with ProjectMapper() as mapper:
        result = mapper.find_by_key(1)
        #for f in result:
            #print(f)
        print(result)

