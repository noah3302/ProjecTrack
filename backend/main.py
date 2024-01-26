from flask import Flask
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from SecurityDecorator import secured


from server.bo.User import User
from server.bo.ProjectBO import Project
from server.bo.Phase import Phase
from server.bo.Comment import Comment
from server.bo.Task import Task
from server.admin import ProjectrackAdministration


app = Flask(__name__)

CORS(app, resources=r'/projectrack/*', supports_credentials=True)

api = Api(app, version='1.0', title='projectrack', description='Ein Kanban board')

api = api.namespace('projectrack')

"""Business Object"""

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='primarykey BO')
})

"""Api models für
 die restlichen bo klassen, sie erben alle von bo"""

user = api.inherit('User', bo, {
    'surname': fields.String(attribute='_surname', description='surname des users'),
    'name': fields.String(attribute='_name', description='name des users'),
    'nickname': fields.String(attribute='_nickname', description='nickname des users'),
    'google_id': fields.String(attribute='_google_id', description='google_id des users')
})

project = api.inherit('Project', bo, {
        'project_title': fields.String(attribute='_project_title', description='project_title des Projects'),
        'project_description': fields.String(attribute='_project_description', description='project_description des Projects'),
        'founder': fields.Integer(attribute='_founder', description='project_founder des Projects'),
        'manager': fields.Integer(attribute='_manager', description='Manager des Projects'),
        'start_date': fields.String(attribute='_start_date', description='start_date des Projects'),
        'end_date': fields.String(attribute='_end_date', description='end_date des Projects')
    })

phase = api.inherit('Phase', bo, {
        'phasename': fields.String(attribute='_phasename', description='Phasename des Projects'),
        'ranking': fields.Integer(attribute='_ranking', description='index der Phase'),
        'project_id': fields.Integer(attribute='_project_id', description='Project_id der Phase')
    })

task = api.inherit('Task', bo, {
        'tasktitle': fields.String(attribute='_tasktitle', description='Name der Task'),
        'description': fields.String(attribute='_description', description='description der Task'),
        'score': fields.String(attribute='_score', description='Score der Task'),
        'duedate': fields.String(attribute='_duedate', description='Due Date für die Task'),
        'user_id': fields.Integer(attribute='_user_id', description='Userid des Verantwortlichen'),
        'phase_id': fields.Integer(attribute='_phase_id', description='phase_id der Task'),
        'creator_id': fields.Integer(attribute='_creator_id', description='creator_id der Task')
})

comment = api.inherit('Comment', bo, {
        'comment': fields.String(attribute='_comment', description='Kommentar string'),
        'creationdate': fields.String(attribute='_creationdate', description='Datum der Erstellung des Kommentars'),
        'user_id': fields.Integer(attribute='_user_id', description='Userid des Kommentars'),
        'task_id': fields.Integer(attribute='_task_id', description='Taskid des Kommentars')
})

"""User abfragen"""
@api.route('/users')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserListOperations(Resource):

    """Alle User bekommen"""
    @api.marshal_list_with(user)
    def get(self):
        adm = ProjectrackAdministration()
        users = adm.get_all_users()
        return users

    """Ein neuen User anlegen"""
    @api.marshal_with(user, code=200)
    @api.expect(user)
    #@secured
    def post(self):
        adm = ProjectrackAdministration()
        print(api.payload)
        proposal = User.from_dict(api.payload)

        if proposal is not None:
            u = adm.create_user(
                proposal.get_surname(),
                proposal.get_name(),
                proposal.get_nickname(),
                proposal.get_google_id()
            )
            return u, 200
        else:
            return "", 500


"""Ein User über die Google_id bekommen"""
@api.route('/google_user/<uid>')
@api.response(500, 'Falls es zu einem serverseitigen error kommt')
@api.param('id', 'ID des User-Objekts')
class UserOperations(Resource):
    @api.marshal_with(user)
    #@secured
    def get(self, uid):
        adm = ProjectrackAdministration()
        user = adm.get_user_by_google_id(uid)
        if user:
            return user, 200
        else:
            return "", 405


"""Alle Nicknamen bekommen die im System existieren"""
@api.route('/users/nicknames')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserNicknameOperations(Resource):
    #@secured
    def get(self):
        adm = ProjectrackAdministration()
        nicknames = adm.get_all_nicknames()
        return {"nicknames": nicknames}


"""Ein User bearbeiten"""
@api.route('/users/<string:google_id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserListOperations(Resource):
    @api.marshal_with(user, code=200)
    @api.expect(user)
    #@secured
    def put(self, google_id):
        adm = ProjectrackAdministration()
        proposal = User.from_dict(api.payload)
        if proposal is not None:
            u = adm.update_user(
                proposal.get_id(),
                proposal.get_google_id(),
                proposal.get_surname(),
                proposal.get_name(),
                proposal.get_nickname(),
            )
            return u, 200
        else:
            return "", 500


"""Ein neuen User löschen"""
@api.route('/users/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'user_id')
class UserListOperations(Resource):
    #@secured
    def delete(self, id):
        adm = ProjectrackAdministration()
        user = adm.delete_user(id)
        return user, 200



"""Projekt abfragen"""


"""Projektdaten über die Projektid bekommen"""
@api.route('/project/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param("id","project id")
class ProjectOperation(Resource):

    @api.marshal_list_with(project)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        proposal = adm.project_by_id(id)

        return proposal


"""Projekt über die userid finden"""
@api.route('/user/<int:id>/projects')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserProjectOperations(Resource):
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        projects = adm.get_projects_by_user_id(id)
        return {"projects": projects}


"""Projekt erstellen"""
@api.route('/createproject')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectOperations(Resource):
    @api.marshal_with(project)
    @api.expect(project)
    #@secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Project.from_dict(api.payload)

        if proposal is not None:
            p = adm.create_project(proposal)
            return p, 200
        else:
            return "", 500


"""Projekt bearbeiten"""
@api.route('/project/<int:id>/user/<int:userid>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectListOperations(Resource):

    @api.marshal_list_with(project, code="201")
    @api.expect(project)
    #@secured
    def put(self, id, userid):
        adm = ProjectrackAdministration()
        proposal = Project.from_dict(api.payload)

        if proposal is not None:
            u = adm.update_project(
                userid,
                id,
                proposal.get_project_title(),
                proposal.get_project_description(),
                proposal.get_founder(),
                proposal.get_manager(),
                proposal.get_start_date(),
                proposal.get_end_date(),
            )
            if u == "error":
                return 403
            else:
                return u, 200
        else:
            return "", 500


"""Alle User aus dem Projket bekommen"""
@api.route('/project/<int:id>/users')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectListOperations(Resource):

    @api.marshal_list_with(user)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        users = adm.get_all_users_by_project_id(id)
        return users


"""User zum Projekt hinzufügen"""
@api.route('/project/<int:id>/user')
@api.response(500, "Falls es zu serverseitigen Fehler kommt")
class ProjectMemberListOperations(Resource):

    @api.marshal_with(user)
    @api.expect(user)
    #@secured
    def post(self, id):
        adm = ProjectrackAdministration()
        proposal = User.from_dict(api.payload)

        if proposal is not None:
            member = adm.add_member_to_project(proposal.get_id(), id)
            return member, 200
        else:
            return "", 500

"""User aus dem Projekt entfernen"""
@api.route('/project/<int:pid>/members/<int:uid>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectListOperations(Resource):
    #@secured
    def delete(self, pid, uid):
        adm = ProjectrackAdministration()
        project = adm.delete_project_members(pid, uid)
        return project, 200


"""Projekt löschen"""
@api.route('/project/<int:pid>/userid/<int:uid>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectListOperations(Resource):
    #@secured
    def delete(self, pid, uid):
        adm = ProjectrackAdministration()
        project = adm.delete_project(pid, uid)
        return project, 200


"""Arbeitsstatistik vom Projekt"""
@api.route('/arbeitsstatistik/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'Projekt id')
class UserListOperations(Resource):
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        arbeitsstatistik = adm.get_arbeitsstatistik_by_project_id(id)
        return {"name": arbeitsstatistik}


"""Phasen"""

"""Phase zu einem Projekt bekommen"""
@api.route('/project/phase/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'phase_id')
class PhaseListOperations(Resource):
    @api.marshal_list_with(phase)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        phase = adm.get_phase_by_project_id(id)
        return phase


"""Phase zu einem Projekt bekommen mit phasenid"""
@api.route('/phase/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'phase_id')
class PhaseListOperations(Resource):
    @api.marshal_list_with(phase)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        phase = adm.get_phase_by_phase_id(id)
        return phase


"""Phase erstellen"""
@api.route('/phase')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class PhaseListOperations(Resource):

    @api.marshal_list_with(phase, code="201")
    @api.expect(phase)
    #@secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Phase.from_dict(api.payload)

        if proposal is not None:
            p = adm.create_phase(
                proposal.get_phasename(),
                proposal.get_ranking(),
                proposal.get_project_id()

            )
            return p, 200
        else:
            return "", 500



"""Phase erstellen in einem Projekt"""
@api.route('/project/<int:id>/phases')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'phase_id')
class ProjectPhaseListOperations(Resource):
    @api.marshal_list_with(phase)
    @api.expect(phase)
    # #@secured
    def post(self, id):
        adm = ProjectrackAdministration()

        if len(api.payload) > 0:
            phases = []
            for phase_proposal in api.payload:
                phaseBO = Phase.from_dict(phase_proposal)

                if phaseBO is not None:
                    # proposal.set_project_id(id)
                    phases_object = adm.create_phasen(phaseBO)
                    phases.append(phases_object)

            return phases, 200
        else:
            return "No phase in request", 500


"""Phase Updaten"""
@api.route('/phases/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class PhasesListOperations(Resource):

    @api.marshal_list_with(phase, code="201")
    @api.expect(phase)
    #@secured
    def put(self, id):
        adm = ProjectrackAdministration()
        proposal = Phase.from_dict(api.payload)

        if proposal is not None:
            u = adm.update_phase(
                id,
                proposal.get_phasename(),
                proposal.get_ranking(),
                proposal.get_project_id(),
            )
            return u, 200
        else:
            return "", 500

"""Alle Tasks aus einer Phase bekommen"""
@api.route('/phase/task/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'id')
class PhaseListOperations(Resource):
    @api.marshal_list_with(task)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        tasks = adm.get_task_by_phase_id(id)
        return tasks


"""Phase löschen"""
@api.route('/phase/<int:phaseid>/project/<int:projectid>/user/<int:userid>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class PhaseListOperations(Resource):

    @api.marshal_with(phase, code=200)
    #@secured
    def delete(self, phaseid, projectid, userid):
        adm = ProjectrackAdministration()
        phase = adm.delete_phase(phaseid, projectid, userid)
        if phase == "error":
            return "", 403
        else:
            return phase, 200


"""Task"""

"""Task hinzufügen"""
@api.route('/task')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class TaskOperations(Resource):

    @api.marshal_with(task, code=200)
    @api.expect(task)
    #@secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Task.from_dict(api.payload)

        if proposal is not None:
            p = adm.create_task(
                proposal.get_tasktitle(),
                proposal.get_description(),
                proposal.get_score(),
                proposal.get_duedate(),
                proposal.get_user_id(),
                proposal.get_phase_id(),
                proposal.get_creator_id()
            )
            return p, 200
        else:
            return "", 500

"""Task Updaten"""
@api.route('/task/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class TaskListOperations(Resource):

    @api.marshal_list_with(task, code="201")
    @api.expect(task)
    #@secured
    def put(self, id):
        adm = ProjectrackAdministration()
        proposal = Task.from_dict(api.payload)

        if proposal is not None:
            u = adm.update_task(
                id,
                proposal.get_tasktitle(),
                proposal.get_description(),
                proposal.get_score(),
                proposal.get_duedate(),
                proposal.get_user_id(),
                proposal.get_phase_id(),
                proposal.get_creator_id()
            )
            return u, 200
        else:
            return "", 500

"""Task löschen"""
@api.route('/tasks/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'task_id')
class TaskListOperations(Resource):
    #@secured
    def delete(self, id):
        adm = ProjectrackAdministration()
        tasks = adm.delete_task(id)
        return tasks, 200


"""Kommentare"""


"""Kommentare über die Taskid ziehen"""
@api.route('/task/comment/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'task_id')
class CommentListOperations(Resource):
    @api.marshal_list_with(comment)
    #@secured
    def get(self, id):
        adm = ProjectrackAdministration()
        comments = adm.get_comment_by_task_id(id)
        return comments


"""Kommentare hinzufügen"""
@api.route('/comment')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class CommentListOperations(Resource):

    @api.marshal_list_with(comment, code="201")
    @api.expect(comment)
    #@secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Comment.from_dict(api.payload)

        if proposal is not None:
            u = adm.create_comment(
                proposal.get_comment(),
                proposal.get_creationdate(),
                proposal.get_user_id(),
                proposal.get_task_id()
            )
            return u, 200
        else:
            return "", 500


"""Kommentar bearbeiten"""
@api.route('/comment/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'comment_id')
class CommentListOperations(Resource):

    @api.marshal_list_with(comment, code=201)
    @api.expect(comment)
    #@secured
    def put(self, id):
        adm = ProjectrackAdministration()
        proposal = Comment.from_dict(api.payload)

        if proposal is not None:
            u = adm.update_comment(
                id,
                proposal.get_comment(),
                proposal.get_creationdate(),
                proposal.get_user_id(),
                proposal.get_task_id()
            )
            return u, 200
        else:
            return "", 500


"""Kommentar löschen"""
@api.route('/coment/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'comment_id')
class CommentListOperations(Resource):
    #@secured
    def delete(self, id):
        adm = ProjectrackAdministration()
        comments = adm.delete_comment(id)
        return comments, 200



if __name__ == '__main__':
    app.run(debug=True)
