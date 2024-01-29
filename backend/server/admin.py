from server.bo.User import User
from server.bo.Membership import Membership
from server.bo.ProjectBO import Project
from server.bo.Phase import Phase
from server.bo.Comment import Comment
from server.bo.Task import Task


from server.mapper.UserMapper import UserMapper
from server.mapper.TaskMapper import TaskMapper
from server.mapper.ProjectMapper import ProjectMapper
from server.mapper.PhaseMapper import PhaseMapper
from server.mapper.CommentMapper import CommentMapper
from server.mapper.MembershipMapper import MembershipMapper
from datetime import datetime



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
        
    """profil updaten"""

    def update_user(self, user_id, google_id, surname, name, nickname):
        user = User()
        user.set_id(user_id)
        user.set_google_id(google_id)
        user.set_surname(surname)
        user.set_name(name)
        user.set_nickname(nickname)
        with UserMapper() as mapper:
            return mapper.update(user)

    """delete user"""

    def delete_user(self, user_id):
        with UserMapper() as mapper:
            return mapper.delete(user_id)
        
    """
    Alle User ausgeben

    """

    def get_all_users(self):
        with UserMapper() as mapper:
            return mapper.find_all()


    """Alle Nicknames ausgeben"""
    def get_all_nicknames(self):
        with UserMapper() as mapper:
            users = mapper.find_all_nicknames()
            nicknames = []
            for user in users:
                nicknames.append(user.get_nickname())
            return nicknames

    """
    Nickname für user id

    """

    def get_nickname(self, number):
        with UserMapper() as mapper:
            users = mapper.find_by_key(number)
            nickname = users.get_nickname()
            return nickname


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
            return user

    """r
     user mit bestimmtem nickname ausgeben
     """

    def get_user_by_nickname(self, number):
        with UserMapper() as mapper:
            return mapper.find_by_nickname(number)


    def get_all_users_by_project_id(self, number):
        with UserMapper() as mapper:
            return mapper.get_members_by_project_id(number)


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

    """Projekt löschen"""

    def delete_project(self, pid, uid):
        with ProjectMapper() as mapper:
            verantwortlicher = mapper.find_by_key(pid).get_manager()
        if uid == verantwortlicher:
            with ProjectMapper() as mapper:
                return mapper.delete(pid)
        else:
            return "error"

    def delete_project_members(self, pid, uid):
        membership = Membership()
        membership.set_project_id(pid)
        membership.set_user_id(uid)
        with MembershipMapper() as mapper:
            return mapper.delete(membership)

    def project_by_id(self, id):
        with ProjectMapper() as mapper:
            return mapper.find_by_key(id)

    """Arbeitsstatistik"""
    def get_arbeitsstatistik_by_project_id(self, number):
        user_phase_task_count = {}
        phase_scores = {}  # Dictionary für die Phasen-Scores
        overdue_task_count = {}  # Dictionary für die Anzahl der überfälligen Aufgaben

        users_dict = {}  # Annahme: Dictionary mit UserId und Nickname

        # Erhalte das Dictionary mit UserId und Nickname
        with ProjectMapper() as mapper:
            users_dict = mapper.get_members_by_project_id(number)

        # Erhalte die Phasenids und Phasennamen mit Ranking
        with PhaseMapper() as mapper:
            phases = {phase.get_id(): {'name': phase.get_phasename(), 'ranking': phase.get_ranking()} for phase in
                      mapper.get_phases_by_project_id(number)}

        # Sortiere die Phasen nach dem Ranking
        sorted_phases = sorted(phases.items(), key=lambda x: x[1]['ranking'])

        with TaskMapper() as mapper:
            for user_id, user_nickname in users_dict.items():
                user_phase_task_count[user_nickname] = {}  # Verwende ein Dictionary, um Phasen-IDs und Task-Anzahl zu speichern
                for phase_id, phase_info in sorted_phases:
                    tasks = mapper.find_by_phase_id_and_user_id(phase_id, user_id)  # Erhalte Tasks für die Phase und Benutzer
                    score = sum(int(task.get_score()) for task in tasks)
                    user_phase_task_count[user_nickname][phase_info['name']] = score  # Speichert die summierten Task scores für den Phasennamen

                    # Füge die Score-Informationen zum Dictionary für das Kreisdiagramm hinzu
                    if phase_info['name'] not in phase_scores:
                        phase_scores[phase_info['name']] = sum(int(task.get_score()) for task in tasks)

                # Zähle die Anzahl der überfälligen Aufgaben für jeden Benutzer
                overdue_tasks = [task for task in tasks if task.get_duedate() and task.get_duedate() < datetime.now()]
                overdue_task_count[user_nickname] = len(overdue_tasks)

        # Rückgabe der Daten
        return {
            'user_phase_task_count': user_phase_task_count,
            'phase_scores': phase_scores,
            'overdue_task_count': overdue_task_count
        }


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


    """Phasen by phasenid"""
    def get_phase_by_phase_id(self, number):
        with PhaseMapper() as mapper:
            return mapper.find_by_key(number)

    """Phasen hinzufügen zu projekt"""
    def create_phasen(self, number):
        with PhaseMapper() as mapper:
            return mapper.insert(number)

    """Phasen hinzufügen zu projekt"""
    def create_phase(self, phasename, ranking, project_id):
        phase = Phase()
        phase.set_phasename(phasename),
        phase.set_ranking(ranking),
        phase.set_project_id(project_id)

        with PhaseMapper() as mapper:
            return mapper.insert(phase)

    """Phasen aus projekt löschen"""
    def delete_phase(self, phaseid, projectid, userid):
        with ProjectMapper() as mapper:
            verantwortlicher = mapper.find_by_key(projectid).get_manager()
        if userid == verantwortlicher:
            with PhaseMapper() as mapper:
                return mapper.delete(phaseid)
        else:
            return "error"

    def update_phase(self, id, phasename, ranking, project_id):
        phase = Phase()
        phase.set_id(id),
        phase.set_phasename(phasename),
        phase.set_ranking(ranking),
        phase.set_project_id(project_id),
        with PhaseMapper() as mapper:
            return mapper.update(phase)


    """Task"""
    """Task updaten"""

    def update_task(self, id, tasktitle, description, score, duedate, user_id, phase_id, creator_id):
        task = Task()
        task.set_id(id),
        task.set_tasktitle(tasktitle),
        task.set_description(description),
        task.set_score(score),
        task.set_duedate(duedate),
        task.set_user_id(user_id),
        task.set_phase_id(phase_id),
        task.set_creator_id(creator_id)
        with TaskMapper() as mapper:
            return mapper.update(task)

    """Task löschen"""

    def delete_task(self, number):
        with TaskMapper() as mapper:
            return mapper.delete(number)
        
        
    """Task hinzufügen"""
    
    def create_task(self, tasktitle, description, score, duedate, user_id, phase_id, creator_id):
        task = Task()
        task.set_tasktitle(tasktitle),
        task.set_description(description),
        task.set_score(score),
        task.set_duedate(duedate),
        task.set_user_id(user_id),
        task.set_phase_id(phase_id),
        task.set_creator_id(creator_id)

        with TaskMapper() as mapper:
            return mapper.insert(task)



    """Kommentare"""

    """Kommentare über Task id bekommen"""

    def get_comment_by_task_id(self, number):
        with CommentMapper() as mapper:
            return mapper.find_by_task_id(number)

    def create_comment(self, comment, creationdate, user_id, task_id):
        coment = Comment()
        coment.set_comment(comment),
        coment.set_creationdate(datetime.now().replace(microsecond=0)),
        coment.set_user_id(user_id),
        coment.set_task_id(task_id)

        with CommentMapper() as mapper:
            return mapper.insert(coment)

    def delete_comment(self, number):
        with CommentMapper() as mapper:
            return mapper.delete(number)

    def update_comment(self, id, comment, creationdate, user_id, task_id):
        coment = Comment()
        coment.set_id(id),
        coment.set_comment(comment),
        coment.set_creationdate(datetime.now().replace(microsecond=0)),
        coment.set_user_id(user_id),
        coment.set_task_id(task_id)
        with CommentMapper() as mapper:
            return mapper.update(coment)

    """Project"""

    """Project member"""
    def get_members_from_project_by_id(self, project_id):
        with UserMapper() as mapper:
            return mapper.get_members_by_project_id(project_id)


    """Project updaten"""
    def update_project(self, userid, id, project_title, project_description, founder, manager, start_date, end_date):
        with ProjectMapper() as mapper:
            verantwortlicher = mapper.find_by_key(id).get_manager()
        if userid == verantwortlicher:
            project = Project()
            project.set_id(id),
            project.set_project_title(project_title),
            project.set_project_description(project_description),
            project.set_founder(founder),
            project.set_manager(manager),
            project.set_start_date(start_date),
            project.set_end_date(end_date)
            with ProjectMapper() as mapper:
                return mapper.update(project)
        else:
            return "error"

    def add_member_to_project(self, user_id, project_id):
        membership = Membership()
        membership.set_user_id(user_id)
        membership.set_project_id(project_id)
        with MembershipMapper() as mapper:
            return mapper.insert(membership)


if __name__ == "__main__":
    adm = ProjectrackAdministration()
    pa = adm.create_phase("phasename", 6, 1)
    #for f in pa:
        #print(f)
    print(pa)

