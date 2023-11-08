from backend.server.mapper.Mapper import Mapper
from backend.server.bo.User import User


class UserMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT user_id, nachname, vorname, nickname, google_id FROM user")
        tuples = cursor.fetchall()

        for (user_id, nachname,vorname, nickname, google_id) in tuples:
            user = User()
            user.set_id(id)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result.append(user)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT user_id, nachname, vorname, nickname, google_id FROM user WHERE user_id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (user_id, nachname,vorname, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_google_id(self, google_id):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT user_id, nachname, vorname, nickname, google_id FROM user WHERE google_id='{}'".format(google_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (user_id, nachname,vorname, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_nickname(self, nickname):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT user_id, nachname, vorname, nickname, google_id FROM user WHERE nickname='{}'".format(nickname)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (user_id, nachname,vorname, nickname, google_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_nickname(nickname)
            user.set_google_id(google_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, user):
        cursor = self._cnx.cursor()
        # Überprüfung, ob bereits Einträge vorhanden sind
        cursor.execute("SELECT COUNT(*) FROM user")
        count = cursor.fetchone()[0]
        if count == 0:
            user.set_id(1)
        else:
            cursor.execute("SELECT MAX(user_id) AS maxid FROM user")
            maxid = cursor.fetchone()[0]
            user.set_id(maxid + 1)
        command = "INSERT INTO user (user_id, nachname, vorname, nickname, google_id) VALUES (%s, %s, %s, %s, %s)"
        data = (user.get_id(), user.get_nachname(), user.get_vorname(), user.get_nickname(), user.get_google_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return user

    def update(self, user):
        cursor = self._cnx.cursor()

        command = "UPDATE user SET nachname=%s, vorname=%s, nickname=%s, google_id=%s WHERE user_id=%s"
        data = (user.get_nachname(), user.get_vorname(), user.get_nickname(), user.get_google_id(), user.get_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, user):
        cursor = self._cnx.cursor()
        command = "DELETE FROM user WHERE user_id='{}'".format(user.get_id())
        cursor.execute(command)
        self._cnx.commit()


if __name__ == "__main__":
    with UserMapper() as mapper:
        result = mapper.find_by_key(2)
        print(result)