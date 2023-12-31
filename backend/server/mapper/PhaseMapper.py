from server.mapper.Mapper import Mapper
from server.bo.Phase import Phase


class PhaseMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT phases_id, phasename, project_id FROM phases")
        tuples = cursor.fetchall()

        for (phases_id, phasename, project_id) in tuples:
            phases = Phase()
            phases.set_id(phases_id)
            phases.set_phasename(phasename)
            phases.set_project_id(project_id)
            result.append(phases)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = ("SELECT phases_id, phasename, project_id FROM phases WHERE phases_id='{}'").format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (phases_id, phasename, project_id) = tuples[0]
            phases = Phase()
            phases.set_id(phases_id)
            phases.set_phasename(phasename)
            phases.set_project_id(project_id)
            result = phases

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    def get_phases_by_project_id(self, project_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT phases_id, phasename, indx FROM phases WHERE project_id = '{}'").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (phases_id, phasename, indx) in tuples:
            phases = Phase()
            phases.set_id(phases_id)
            phases.set_phasename(phasename)
            phases.set_indx(indx)
            phases.set_project_id(project_id)
            result.append(phases)

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, phases):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM phases")
        count = cursor.fetchone()[0]
        if count == 0:
            phases.set_id(1)
        else:
            cursor.execute("SELECT MAX(phases_id) AS maxid FROM phases")
            maxid = cursor.fetchone()[0]
            phases.set_id(maxid + 1)
        command = "INSERT INTO phases (phases_id, phasename, indx, project_id) VALUES (%s, %s, %s, %s)"
        data = (phases.get_id(), phases.get_phasename(), phases.get_indx(), phases.get_project_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return phases

    def update(self, phases):
        cursor = self._cnx.cursor()

        command = "UPDATE phases SET phasename=%s,indx=%s, project_id=%s WHERE phases_id=%s"
        data = (phases.get_phasename(), phases.get_indx(), phases.get_project_id(), phases.get_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, phases_id):
        cursor = self._cnx.cursor()
        command = "DELETE FROM phases WHERE phases_id='{}'".format(phases_id)
        cursor.execute(command)
        self._cnx.commit()
        cursor.close()




if __name__ == "__main__":
    with PhaseMapper() as mapper:
        result = mapper.get_phases_by_project_id(1)
        for f in result:
            print(f)
