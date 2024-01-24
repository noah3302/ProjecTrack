from server.mapper.Mapper import Mapper
from server.bo.User import User


class UserMapper(Mapper):
    def __init__(self):
        super().__init__()

    """Alle Nutzer aus der DB ausgegeben"""
    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM user")
        tuples = cursor.fetchall()

        for (user_id, surname,name, nickname, google_id) in tuples:
            user = User()
            user.set_id(user_id)
            user.set_surname(surname)
            user.set_name(name)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result.append(user)

        self._cnx.commit()
        cursor.close()
        return result

    """Hier werden Nutzer basierend auf deren Nicknames gesucht"""
    def find_all_nicknames(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT nickname FROM user")
        tuples = cursor.fetchall()

        for (nickname,) in tuples:
            user = User()
            user.set_nickname(nickname)
            result.append(user)

        self._cnx.commit()
        cursor.close()
        return result

    """Liste an Nutzern, die Mitglieder eines bestimmten Projekts sind"""
    def get_members_by_project_id(self, project_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT user.user_id,user.surname,user.name, user.nickname, user.google_id FROM user "
                   "JOIN membership ON user.user_id = membership.user_id "
                   "WHERE membership.project_id = '{}';").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (user_id, surname, name, nickname, google_id) in tuples:
            user = User()
            user.set_id(user_id)
            user.set_surname(surname)
            user.set_name(name)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result.append(user)

        self._cnx.commit()
        cursor.close()
        return result


    """Nutzer mit einer spezifischen User-ID wird gesucht"""
    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT user_id, surname, name, nickname, google_id FROM user WHERE user_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (user_id, surname,name, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(user_id)
            user.set_surname(surname)
            user.set_name(name)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    """User wird gesucht, basierend auf einer Google-ID"""
    def find_by_google_id(self, google_id):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM user WHERE google_id='{}'".format(google_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, surname, name, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_surname(surname)
            user.set_name(name)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result
    """User wird gesucht, basierend auf seinem Nickname"""
    def find_by_nickname(self, nickname):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT user_id, surname, name, nickname, google_id FROM user WHERE nickname='{}'".format(nickname)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (user_id, surname,name, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(user_id)
            user.set_surname(surname)
            user.set_name(name)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result


    """Nutzer wird in der DB hinzugefügt (User-Tabelle)"""
    def insert(self, user):
        cursor = self._cnx.cursor()
        # Überprüfung, ob bereits Einträge vorhanden sind
        cursor.execute("SELECT COUNT(*) FROM user")
        count = cursor.fetchone()[0]
        if count == 0:
            user.set_id(1)
        else:
            cursor.execute("SELECT MAX(user_id) AS maxuser_id FROM user")
            maxuser_id = cursor.fetchone()[0]
            user.set_id(maxuser_id + 1)
        command = "INSERT INTO user (user_id, surname, name, nickname, google_id) VALUES (%s, %s, %s, %s, %s)"
        data = (user.get_id(), user.get_surname(), user.get_name(), user.get_nickname(), user.get_google_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return user

    """Daten eines bestehenden Nutzers wird geupdated"""
    def update(self, user):
        cursor = self._cnx.cursor()

        command = "UPDATE user SET surname=%s, name=%s, nickname=%s, google_id=%s WHERE user_id=%s"
        data = (user.get_surname(), user.get_name(), user.get_nickname(), user.get_google_id(), user.get_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    """Nutzer wird aus der DB gelöscht"""
    def delete(self, user):
        cursor = self._cnx.cursor()
        command = "DELETE FROM user WHERE user_id='{}'".format(user)
        cursor.execute(command)
        self._cnx.commit()

    """Nutzer wird aus dem Projekt gelöscht"""
    def delete_members(self, pid, uid):
        cursor = self._cnx.cursor()
        command = "DELETE FROM members WHERE user_id='{}' and project_id='{}'".format(uid, pid)
        cursor.execute(command)
        self._cnx.commit()


if __name__ == "__main__":
    with UserMapper() as mapper:
        #user = User()
        #user.set_id(7)
        #user.set_surname("Bruan")
        #user.set_name("noah")
        #user.set_nickname("Noah3003")
        #user.set_google_id("googleid123")
        #result = mapper.insert(user)
        result = mapper.find_all()
        for f in result:
            print(f)

        #print(result)