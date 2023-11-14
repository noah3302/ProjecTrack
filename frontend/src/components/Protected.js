import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { apiget } from "../API/Api";

export default function Protected({ children }) {
  const { user } = UserAuth();

  useEffect(() => {
    async function checkUserInDatabase() {
      if (user) {
        try {
          // Führe eine API-Anfrage aus, um den Benutzer in der Datenbank zu überprüfen
          const fetchedUser = await apiget(`existusers/${user.googleId}`);
          if (!fetchedUser.exist) {
            // Wenn der Benutzer nicht in der Datenbank existiert, führe entsprechende Aktionen durch
            // Zum Beispiel: Abmelden, auf eine andere Seite umleiten usw.
            // Hier: Logge den Benutzer aus
            // logOut();
          }
        } catch (error) {
          console.error("Fehler beim Überprüfen des Benutzers:", error);
        }
      }
    }

    checkUserInDatabase();
  }, [user]);

  // Überprüfen, ob der Benutzer angemeldet ist und ein Benutzer in der Datenbank existiert
  if (!user) {
    // Benutzer ist nicht angemeldet, leite zur Anmeldeseite weiter
    return <Navigate to="/" />;
  }

  // Hier kannst du weitere Logik für den eingeloggten Benutzer hinzufügen, wenn benötigt

  return children;
}
