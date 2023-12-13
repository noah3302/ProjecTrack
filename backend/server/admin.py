from server.bo.User import User
from server.bo.Task import Task
from server.bo.ProjectBO import Project
from server.bo.Phase import Phase



from flask import request
from google.auth.transport import requests
import google.oauth2.id_token


from server.mapper.UserMapper import UserMapper
from server.mapper.TaskMapper import TaskMapper
from server.mapper.ProjectMapper import ProjectMapper
from server.mapper.PhaseMapper import PhaseMapper


class ProjectrackAdministration(object):
    def __init__(self):
        pass

    """
    Methoden Für User

    """

    """
    Neuen User anlegen
    """

    def create_user(self, surname, name, nickname, google_id):
        user = User()
        user.set_surname(surname)
        user.set_name(name)
        user.set_nickname(nickname)
        user.set_google_id(google_id)

        with UserMapper() as mapper:
            return mapper.insert(user)

    """
    Alle User ausgeben

    """

    def get_all_users(self):
        with UserMapper() as mapper:
            return mapper.find_all()

    """
    Alle Nicknames ausgeben

    """

    def get_all_nicknames(self):
        with UserMapper() as mapper:
            users = mapper.find_all_nicknames()
            nicknames = []
            for user in users:
                nicknames.append(user.get_nickname())
            return nicknames


    """
    user mit bestimmter id ausgeben
    """

    def get_user_by_id(self, number):
        with UserMapper() as mapper:
            return mapper.find_by_key(number)

    """
     user mit bestimmter google_id ausgeben
     """

    def get_user_by_google_id(self, google_id):
        with UserMapper() as mapper:
            user = mapper.find_by_google_id(google_id)
            # if user is not None:
            #    user = mapper.
            return user

    """r
     user mit bestimmtem nickname ausgeben
     """

    def get_user_by_nickname(self, number):
        with UserMapper() as mapper:
            return mapper.find_by_nickname(number)

    """Project"""
    """Project by user id"""


    def get_projects_by_user_id(self, user_id):
        projects = []
        with ProjectMapper() as mapper:
            result = mapper.get_projects_by_user_id(user_id)
            for project in result:
                with UserMapper() as mapper:
                    members = mapper.get_members_by_project_id(project.get_id())
                    project_members = []
                    for member in members:
                        #project_members.append({
                            #"user_id": member.get_id(),
                            #"nickname": member.get_nickname(),
                        #})
                        project_members.append(member.get_nickname())

                projects.append({
                    "project_id": project.get_id(),
                    "project_title": project.get_project_title(),
                    "project_description": project.get_project_description(),
                    "founder": project.get_founder(),
                    "start_date": project.get_start_date(),
                    "end_date": project.get_end_date(),
                    "members": project_members
                })
        return projects

    """Create Projects"""
    def create_project(self, project):
        with ProjectMapper() as mapper:
            return mapper.insert(project)

    def project_by_id(self, id):
        with ProjectMapper() as mapper:
            return mapper.find_by_key(id)

    """Arbeitsstatistik"""

    def get_arbeitsstatistik_by_project_id(self, number):
        user_phase_task_count = {}
        users_dict = {}  # Annahme: Dictionary mit UserId und Nickname

        with ProjectMapper() as mapper:
            users_dict = mapper.get_members_by_project_id(number)  # Erhalte das Dictionary mit UserId und Nickname

        with PhaseMapper() as mapper:
            phase_ids = [phase.get_id() for phase in mapper.get_phases_by_project_id(number)]  # Erhalte die Phasenids

        with TaskMapper() as mapper:
            for user_id, user_nickname in users_dict.items():
                user_phase_task_count[user_nickname] = {}  # Verwende ein Dictionary, um Phasen-IDs und Task-Anzahl zu speichern
                for phase_id in phase_ids:
                    tasks = mapper.find_by_phase_id_and_user_id(phase_id, user_id)  # Erhalte Tasks für die Phase und Benutzer
                    task_count = len(tasks)  # Anzahl der Tasks für die Phase und Benutzer
                    user_phase_task_count[user_nickname][phase_id] = task_count  # Speichere die Task-Anzahl für die Phasen-ID

            print(user_phase_task_count)

        return user_phase_task_count

    """Tasks"""

    """Tasks by phasenid"""

    def get_task_by_phase_id(self, number):
        with TaskMapper() as mapper:
            return mapper.find_by_phase_id(number)

    """Phasen"""

    """Phasen by projectid"""

    def get_phase_by_project_id(self, number):
        with PhaseMapper() as mapper:
            return mapper.get_phases_by_project_id(number)

    """Phasen hinzufügen zu projekt"""
    def create_phase(self, number):
        with PhaseMapper() as mapper:
            return mapper.insert(number)

    """Phasen aus projekt löschen"""
    def delete_phase(self, number):
        with PhaseMapper() as mapper:
            return mapper.delete(number)

    def put_phase(self, number):
        with PhaseMapper() as mapper:
            return mapper.update(number)

if __name__ == "__main__":
    adm = ProjectrackAdministration()
    pa = adm.project_by_id(1)
    print(pa)

