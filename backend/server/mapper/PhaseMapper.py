from server.mapper.Mapper import Mapper
from server.bo.Phase import Phase


class PhaseMapper(Mapper):
    def __init__(self):
        super().__init__()


    """Abstracte Methode find all"""


    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT phase_id, phasename, project_id FROM phase")
        tuples = cursor.fetchall()

        for (phase_id, phasename, project_id) in tuples:
            phases = Phase()
            phases.set_id(phase_id)
            phases.set_phasename(phasename)
            phases.set_project_id(project_id)
            result.append(phases)

        self._cnx.commit()
        cursor.close()
        return result


    """Liste an Projektphasen die einer ID zugewiesen wurden"""

    def find_by_key(self, key):
        result = None

        cursor = self._cnx.cursor()
        command = ("SELECT * FROM phase WHERE phase_id='{}'").format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (phases_id, phasename, ranking, project_id) = tuples[0]
            phases = Phase()
            phases.set_id(phases_id)
            phases.set_phasename(phasename)
            phases.set_ranking(ranking)
            phases.set_project_id(project_id)
            result = phases

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

    """Liste an Projektphasen die einer ID zugewiesen wurden"""
    def get_phases_by_project_id(self, project_id):
        result = []
        cursor = self._cnx.cursor()
        command = ("SELECT phase_id, phasename, ranking FROM phase WHERE project_id = '{}'").format(project_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (phase_id, phasename, ranking) in tuples:
            phases = Phase()
            phases.set_id(phase_id)
            phases.set_phasename(phasename)
            phases.set_ranking(ranking)
            phases.set_project_id(project_id)
            result.append(phases)

        self._cnx.commit()
        cursor.close()
        return result

    """ Neue Projektphase wird hinzugefügt"""
    def insert(self, phase):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT COUNT(*) FROM phase")
        count = cursor.fetchone()[0]
        if count == 0:
            phase.set_id(1)
        else:
            cursor.execute("SELECT MAX(phase_id) AS maxid FROM phase")
            maxid = cursor.fetchone()[0]
            phase.set_id(maxid + 1)
        command = "INSERT INTO phase (phase_id, phasename, ranking, project_id) VALUES (%s, %s, %s, %s)"
        data = (phase.get_id(), phase.get_phasename(), phase.get_ranking(), phase.get_project_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return phase

    """Phase wird geupdatet"""
    def update(self, phase):
        cursor = self._cnx.cursor()

        command = "UPDATE phase SET phasename=%s,ranking=%s, project_id=%s WHERE phase_id=%s"
        data = (phase.get_phasename(), phase.get_ranking(), phase.get_project_id(), phase.get_id())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    """Phase wird gelöscht"""
    def delete(self, phase_id):
        cursor = self._cnx.cursor()
        command = "DELETE FROM phase WHERE phase_id='{}'".format(phase_id)
        cursor.execute(command)
        self._cnx.commit()
        cursor.close()




if __name__ == "__main__":
    with PhaseMapper() as mapper:
        result = mapper.get_phases_by_project_id(1)
        for f in result:
            print(f)
