from flask import Flask
from flask import request as http_request
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from SecurityDecorator import secured


from server.bo.User import User
from server.bo.ProjectBO import Project
from server.bo.Phase import Phase
from server.admin import ProjectrackAdministration


app = Flask(__name__)

CORS(app, resources=r'/projectrack/*', supports_credentials=True)

api = Api(app, version='1.0', title='projectrack',
          description='Ein Kanban board')

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
projectcard = api.inherit('Project', bo, {
        'project_title': fields.String(attribute='_project_title', description='project_title des Projects'),
        'nickname': fields.String(attribute='_nickname', description='nickname des users'),
        'project_description': fields.String(attribute='_project_description',
                                             description='project_description des Projects'),
        'start_date': fields.String(attribute='_start_date', description='start_date des Projects'),
        'end_date': fields.String(attribute='_end_date', description='end_date des Projects'),
    })

project = api.inherit('Project', bo, {
        'project_title': fields.String(attribute='_project_title', description='project_title des Projects'),
        'project_description': fields.String(attribute='_project_description', description='project_description des Projects'),
        'founder': fields.String(attribute='_founder', description='project_founder des Projects'),
        'start_date': fields.String(attribute='_start_date', description='start_date des Projects'),
        'end_date': fields.String(attribute='_end_date', description='end_date des Projects'),
    })

task = api.inherit('Task', bo, {
        'tasktitle': fields.String(attribute='_tasktitle', description='Name der Task'),
        'description': fields.String(attribute='_description', description='description der Task'),
        'duedate': fields.String(attribute='_duedate',
                                             description='Due Date für die Task'),
        'user_id': fields.String(attribute='_user_id', description='Userid des Verantwortlichen'),
        'phases_id': fields.String(attribute='_phases_id', description='phase_id der Task')
})

phase = api.inherit('phase', bo, {
        'phasename': fields.String(attribute='_phasename', description='Phasename des Projects'),
        'indx': fields.String(attribute='_indx', description='index der Phase'),
        'project_id': fields.String(attribute='_project_id',
                                             description='Project_id der Phase'),
    })

"""User"""


"""Alle User ausgeben"""


@api.route('/users')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserListOperations(Resource):
    @api.marshal_list_with(user)
    def get(self):
        adm = ProjectrackAdministration()
        users = adm.get_all_users()
        return users

    """Ein neuen User anlegen"""

    @api.marshal_with(user, code=200)
    @api.expect(user)
    @secured
    def post(self):
        adm = ProjectrackAdministration()
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


@api.route('/existusers/<id>')
@api.response(500, 'Falls es zu einem serverseitigen error kommt')
@api.param('id', 'ID des User-Objekts')
class UserOperations(Resource):
    @secured
    def get(self, id):
        adm = ProjectrackAdministration()
        user = adm.get_user_by_google_id(id)
        if user:
            return {"exist": True}
        else:
            return {"exist": False}


@api.route('/google_user/<string:uid>')
@api.response(500, 'Falls es zu einem serverseitigen error kommt')
@api.param('id', 'ID des User-Objekts')
class UserOperations(Resource):
    @api.marshal_with(user)
    @secured
    def get(self, uid):
        adm = ProjectrackAdministration()
        user = adm.get_user_by_google_id(uid)
        print(user)
        if user:
            return user, 200
        else:
            return "", 405


@api.route('/users/nicknames')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserNicknameOperations(Resource):
    @secured
    def get(self):
        adm = ProjectrackAdministration()
        nicknames = adm.get_all_nicknames()
        return {"nicknames": nicknames}


@api.route('/arbeitsstatistik/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'Projekt id')
class UserListOperations(Resource):
    def get(self, id):
        adm = ProjectrackAdministration()
        arbeitsstatistik = adm.get_arbeitsstatistik_by_project_id(id)
        return {"name": arbeitsstatistik}


@api.route('/projects')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class ProjectOperations(Resource):
    @api.marshal_with(projectcard)
    @api.expect(projectcard)
    @secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Project.from_dict(api.payload)

        print(proposal)
        print(api.payload)

        if proposal is not None:
            p = adm.create_project(proposal)
            return p, 200
        else:
            return "", 500

@api.route('/project/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param("id","project id")
class ProjectOperation(Resource):

    @api.marshal_list_with(project)
    def get(self, id):
        adm = ProjectrackAdministration()
        proposal = adm.project_by_id(id)

        return {proposal}



@api.route('/user/<int:id>/projects')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
class UserProjectOperations(Resource):
    #@api.marshal_list_with(project)
    def get(self, id):
        adm = ProjectrackAdministration()
        projects = adm.get_projects_by_user_id(id)
        print (projects)
        return {"projects":projects}


@api.route('/phase')
@api.response(500, "Falls es zu serverseitigen Fehler kommt")
class PhaseListOperations(Resource):
    @api.marshal_list_with(phase)
    def get(self):
        return phase
    @api.marshal_with(phase)
    @api.expect(phase)
    @secured
    def post(self):
        data = api.payload
        print(data)

@api.route('/project/<int:id>/user')
@api.response(500, "Falls es zu serverseitigen Fehler kommt")
class ProjectMemberListOperations(Resource):
    @api.marshal_with(user)
    @api.expect(user)
    @secured
    def post(self, id):
        adm = ProjectrackAdministration()
        proposal = User.from_dict(api.payload)

        if proposal is not None:
            member = adm.add_member_to_project(proposal, id)
            return member, 200
        else:
            return "", 500


@api.route('/phase/task/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'id')
class UserListOperations(Resource):
    @api.marshal_list_with(task)
    def get(self, id):
        adm = ProjectrackAdministration()
        tasks = adm.get_task_by_phase_id(id)
        return tasks

@api.route('/phase/<int:id>')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'phases_id')
class UserListOperations(Resource):
    @api.marshal_list_with(phase)
    def get(self, id):
        adm = ProjectrackAdministration()
        phases = adm.get_phase_by_project_id(id)
        return phases

    @api.marshal_with(phase, code=200)
    @api.expect(phase)
    def post(self, id):
        adm = ProjectrackAdministration()
        proposal = User.from_dict(api.payload)

        if proposal is not None:
            u = adm.create_phase(
                proposal.get_id(),
                proposal.get_phasename(),
                proposal.get_indx(),
                proposal.get_project_id(id)
            )
            return u, 200
        else:
            return "", 500

    @api.marshal_with(phase, code=200)
    @api.expect(phase)
    def put(self, id):
        adm = ProjectrackAdministration()
        proposal = User.from_dict(api.payload)

        if proposal is not None:
            u = adm.put_phase(
                proposal.get_id(),
                proposal.get_phasename(),
                proposal.get_indx(),
                proposal.get_project_id(id)
            )
            return u, 200
        else:
            return "", 500

    @api.marshal_with(phase, code=200)
    def delete(self, id):
        adm = ProjectrackAdministration()
        phases = adm.delete_phase(id)
        return phases, 200

@api.route('/project/<int:id>/phase')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'phases_id')
class ProjectPhaseListOperations(Resource):
    @api.marshal_with(phase)
    @api.expect(phase)
    def post(self, id):
        adm = ProjectrackAdministration()
        proposal = Phase.from_dict(api.payload)

        if proposal is not None:
            proposal.set_project_id(id)
            phase = adm.create_phase(proposal)
            return phase, 200
        else:
            return "", 500

if __name__ == '__main__':
    app.run(debug=True)
