from server.mapper.Mapper import Mapper
from server.bo.Membership import Membership

class MembershipMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM membership")
        tuples = cursor.fetchall()

        for (user_id, project_id) in tuples:
            membership = Membership()
            membership.set_user_id(user_id)
            membership.set_project_id(project_id)
            result.append(membership)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        pass

    def insert(self, membership):
        cursor = self._cnx.cursor()
        command = "INSERT INTO membership (user_id, project_id) VALUES (%s, %s)"
        data = (membership.get_user_id(), membership.get_project_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()
        return membership

    def update(self, membership):
        pass

    def delete(self, membership):
        cursor = self._cnx.cursor()
        command = "DELETE FROM membership WHERE user_id='{}' AND project_id='{}'" .format(
            membership.get_user_id(), membership.get_project_id())
        cursor.execute(command)
        self._cnx.commit()
        cursor.close()

if __name__ == "__main__":
    with MembershipMapper() as mapper:
        result = mapper.find_all()
        print(result)
