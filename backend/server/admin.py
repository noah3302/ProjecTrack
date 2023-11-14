from server.bo.User import User
from server.bo.Task import Task



from flask import request
from google.auth.transport import requests
import google.oauth2.id_token


from server.mapper.UserMapper import UserMapper
from server.mapper.TaskMapper import TaskMapper


class ProjectrackAdministration(object):
    def __init__(self):
        pass

    """
    Methoden Für User

    """

    """
    Neuen User anlegen
    """

    def create_user(self, nachname, vorname, nickname, google_id):
        user = User()
        user.set_nachname(nachname)
        user.set_vorname(vorname)
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
            user_exists = mapper.find_by_google_id(google_id)
            return user_exists

    """
     user mit bestimmtem nickname ausgeben
     """

    def get_user_by_nickname(self, number):
        with UserMapper() as mapper:
            return mapper.find_by_nickname(number)




if __name__ == "__main__":
    adm = ProjectrackAdministration()
    nachname = "Bruan"
    vorname = "noah"
    nickname = "Noah3003"
    google_id = "googleid123"
    pa = adm.create_user(nachname, vorname, nickname, google_id)
    print(pa)
    #for f in pa:
        #print(f)
