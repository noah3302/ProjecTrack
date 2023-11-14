from flask import request
from google.auth.transport import requests
import google.oauth2.id_token
from server.admin import ProjectrackAdministration

""" Quelle Pythonbankbeispiel1.2"""


def secured(function):
    """
    dieser Decorator soll eine allgemeine Authentifikation vom User im System realisieren. Der Zugriff auf ausgewählte
    Inhalte soll mit dieser Wrapperfunktion geschütz werden. Im Kern überprüft dieser Decorator, ob der User über
    Google in unserem System angemeldet ist. Ist dies der Fall so wird der Zugriff freigegeben und gleichzeitig wird
    der Name und sicherheitshalber die Email des Users aktualisiert.
    """
    firebase_request_adapter = requests.Request()

    def wrapper(*args, **kwargs):
        # hier wird auf den im Browser von uns angelegten Cookie zugegriffen, der den Token des Users beinhaltet
        id_token = request.cookies.get(key='token')
        if id_token:
            try:
                # mit dem firebase_request_adapter werden dann die User-Informationen, insbesondere die uid (GoogleId),
                # des Users aufgerufen und für den weiteren Prozess gespeichert
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter, clock_skew_in_seconds=2)

                # sofern die Anfrage ein Ergebnis liefern konnte, bedeutet dies, dass sich der User über Google erfolg-
                # reich angemeldet hat. Ansonstend erfüllt der User nicht die Anforderungen, um vollständigen Zugriff
                # auf unsere Website zu erlangen
                if claims is not None:

                    objects = function(*args, **kwargs)
                    return objects

                # falls die Anfrage des request-adapters kein Ergebnis liefert, wird die Statusmeldung 401 (nicht
                # autorisiert) zurückgegeben
                else:
                    print('claims is none')
                    return '', 401  # UNAUTHORIZED !!!

            # ValueError können auftreten, wenn die Zuweisung von *args und **kwargs:
            # --  objects = function(*args, **kwargs)
            # zur Weitergabe der übergebenen Funktion fehlerhaft ist, beispielsweise zu wenig oder zu viele Parameter
            # werden in die wrapped function übergeben (too many values to unpack -Error /
            #                                           not enough values to unpack -Error)
            except ValueError as exc:
                print(f'error with Securitydecorator: {str(exc)}')
                return str(exc), 401  # UNAUTHOZED !!!

        # wenn kein ID-Token gefunden bzw. überprüft werden konnte, wird ebenfalls die Statusmeldung 401
        # zurückgegeben

        else:
            print('id-token is none')
            return '', 401  # UNAURIZED !!!

    return wrapper