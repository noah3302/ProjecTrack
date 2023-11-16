from backend.server.mapper.Mapper import Mapper
from backend.server.bo.Phase import Phase


class PhaseMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT phasen_id, phasenname, projekt_id FROM phasen")
        tuples = cursor.fetchall()

        for (phasen_id, phasenname, projekt_id) in tuples:
            phasen = Phase()
            phasen.set_id(phasen_id)
            phasen.set_phasenname(phasenname)
            phasen.set_projekt_id(projekt_id)
            result.append(phasen)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = ("SELECT phasen_id, phasenname, projekt_id FROM phasen WHERE phasen_id='{}'").format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (phasen_id, phasenname, projekt_id) = tuples[0]
            phasen = Phase()
            phasen.set_id(phasen_id)
            phasen.set_phasenname(phasenname)
            phasen.set_projekt_id(projekt_id)
            result = phasen

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def get_phasen_by_project_id(self, project_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT phasen_id, phasenname, indx FROM phasen WHERE project_id = '{}'").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (phasen_id, phasenname, indx) in tuples:
            phasen = Phase()
            phasen.set_id(phasen_id)
            phasen.set_phasenname(phasenname)
            phasen.set_indx(indx)
            result.append(phasen)

        self._cnx.commit()
        cursor.close()
        return result



    def insert(self, phasen):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM phasen")
        count = cursor.fetchone()[0]
        if count == 0:
            phasen.set_id(1)
        else:
            cursor.execute("SELECT MAX(phasen_id) AS maxid FROM phasen")
            maxid = cursor.fetchone()[0]
            phasen.set_id(maxid + 1)
        command = "INSERT INTO phasen (phasen_id, phasenname, projekt_id) VALUES (%s, %s, %s)"
        data = (phasen.get_phasen_id(), phasen.get_phasenname(), phasen.get_projekt_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return phasen

    def update(self, phasen):
        cursor = self._cnx.cursor()

        command = "UPDATE phasen SET phasen_id=%s, phasenname=%s, projekt_id=%s WHERE phasen_id=%s"
        data = (phasen.get_phasen_id(), phasen.get_phasenname(), phasen.get_projekt_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, phasen):
        cursor = self._cnx.cursor()
        command = "DELETE FROM phasen WHERE phasen_id='{}'".format(phasen.get_id())
        cursor.execute(command)
        self._cnx.commit()


if __name__ == "__main__":
    with PhaseMapper() as mapper:
        result = mapper.get_phasen_by_project_id(1)
        print(result)
