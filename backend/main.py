from flask import Flask
from flask import request as http_request
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from SecurityDecorator import secured


from server.bo.User import User
from server.bo.ProjectBO import Project

from server.admin import ProjectrackAdministration


app = Flask(__name__)

CORS(app, resources=r'/projectrack/*', supports_credentials=True)

api = Api(app, version='1.0', title='projectrack',
          description='Ein Kanban board')

api = api.namespace('projectrack')

"""Business Object"""

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='primärschlüssel BO')
})

"""Api models für
 die restlichen bo klassen, sie erben alle von bo"""

user = api.inherit('User', bo, {
    'nachname': fields.String(attribute='_nachname', description='nachname des users'),
    'vorname': fields.String(attribute='_vorname', description='vorname des users'),
    'nickname': fields.String(attribute='_nickname', description='nickname des users'),
    'google_id': fields.String(attribute='_google_id', description='google_id des users')
})
project = api.inherit('Project', bo, {
        'project_id': fields.String(attribute='_project_id', description='Project_id des Projects'),
        'project_title': fields.String(attribute='_project_title', description='project_title des Projects'),
        'nickname': fields.String(attribute='_nickname', description='nickname des users'),
        'project_description': fields.String(attribute='_project_description',
                                             description='project_description des Projects'),
        'start_date': fields.String(attribute='_start_date', description='start_date des Projects'),
        'end_date': fields.String(attribute='_end_date', description='end_date des Projects'),
        'members': fields.String(attribute='_google_id', description='members des Projects')
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
                proposal.get_nachname(),
                proposal.get_vorname(),
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
class UserNicknamenOperations(Resource):
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
    @api.marshal_with(project)
    @api.expect(project)
    @secured
    def post(self):
        adm = ProjectrackAdministration()
        proposal = Project.from_dict(api.payload)

        print(proposal)
        print(api.payload)

        if proposal is not None:
            p = adm.create_user(
                proposal.get_nachname(),
                proposal.get_vorname(),
                proposal.get_nickname(),
                proposal.get_google_id()
            )
            return p, 200
        else:
            return "", 500


@api.route('/user/<int:id>/projects')
@api.response(500, "Falls es zu serverseitigen fehler kommt")
@api.param('id', 'project_id')
class UserProjectOperations(Resource):
    @api.marshal_list_with(project)
    def get(self, id):
        adm = ProjectrackAdministration()
        projects = adm.get_projects_by_user_id(id)
        return projects


if __name__ == '__main__':
    app.run(debug=True)
