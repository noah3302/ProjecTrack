import mysql.connector as connector
from contextlib import AbstractContextManager
from abc import ABC, abstractmethod
import os


class Mapper(AbstractContextManager, ABC):

    def __init__(self):
        self._cnx = None

    def __enter__(self):
        """if: Checks if it's inside a Cloud --> enters Cloud Credentials
        else: Checks if it's a local deployment (development) and enters necessary credntials """

        if os.getenv('GAE_ENV', '').startswith('standard'):
            '''Enter Cloud Credentials'''
            self._cnx = connector.connect(user='root', password='1234',
                                          unix_socket='/cloudsql/projectrack-411710:europe-west3:projectrack',
                                          database='projectrack')
        else:
            from server.dbconnector.dbconnector import host, user, password, database
            '''Enter Credentials for Local deployment'''
            self._cnx = connector.connect(user=user, password=password,
                                          host=host, database=database)

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cnx.close()

    """ gibt alle Objekte einer Tabelle aus"""

    @abstractmethod
    def find_all(self):
        pass

    """ gibt ein bestimmtes Objekt einer Tabelle aus"""

    @abstractmethod
    def find_by_key(self, key):
        pass

    """fügt ein Objekt einer Tablle hinzu"""

    @abstractmethod
    def insert(self, object):
        pass

    """Updatet ein Objekt einer Tabelle"""

    @abstractmethod
    def update(self, object):
        pass

    """Löscht ein Objekt einer Tabelle"""

    @abstractmethod
    def delete(self, object):
        pass