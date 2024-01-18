import { createContext, useEffect, useState, useContext } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../pages/firebase';
import { apiget } from '../API/Api';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userdata, setUserdata] = useState(null);

  const googleSignIn = async () => {
    if (!user) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);

        //Setze den Authentifizierungs-Token als Cookie
        const token = await result.user.getIdToken();
        document.cookie = `token=${token};path=/`;

        //Die Daten des aktuellen angemeldeten Benutzer werden destrukturiert 
        const { uid, displayName, photoURL } = result.user;
        //Variable initialisiert
        var currentUser;
        //Informationen über den Benutzer aus der API abgerufen
        try{
          const g_user = await apiget(`google_user/${uid}`)
          const userId = g_user.id ? g_user.id : false
          //bei vorhandenen Daten, werden diese gepseichert in 'CurrentUser'
          currentUser = {
            username: displayName,
            profilePicture : photoURL,
            surname: g_user.surname,
            name: g_user.name,
            nickname: g_user.nickname,
            userid: uid,
            id: g_user.id
          };
        }catch{
          //Bei nicht vorhandenen Daten, wird ein minimales Benutzerobjekt erstellt
          currentUser = {
            username: displayName,
            profilePicture : photoURL,
            userid: uid,
          };
        }
        


        setUser(currentUser);
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("user", JSON.stringify(currentUser));
        broadcastAuthState(currentUser);
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (googleUser) => {
      if (googleUser) {
        try {
          const { uid, displayName, photoURL } = googleUser;
          const g_user = await apiget(`google_user/${uid}`)
  
          const userId = g_user.id ? g_user.id : false
  
          const currentUser = {
            username: displayName,
            profilePicture : photoURL,
            surname: g_user.surname,
            name: g_user.name,
            nickname: g_user.nickname,
            userid: uid,
            id: userId
          };
  
          setUser(currentUser);
          setUserdata(true);
          broadcastAuthState(currentUser);

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserdata(false);
        broadcastAuthState(null);
      }
    });

    //Aktualisierung des Authentifizierungsstatus
    const receiveAuthState = (event) => {
      const { detail: authState } = event;
      setUser(authState);
    };

    window.addEventListener('storage', receiveAuthState);

    //Aufräumfunktion
    return () => {
      unsubscribe();
      window.removeEventListener('storage', receiveAuthState);
    };
  }, []);

  //Abmeldung des Benutzers
  const logOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //Funktion schickt anderen Teile der Anwendung den Authentifizierungsstatus
  const broadcastAuthState = (authState) => {
    const event = new CustomEvent('authStateChanged', { detail: authState });
    window.dispatchEvent(event);
  };

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user, setUser, userdata, setUserdata }}>
      {children}
    </AuthContext.Provider>
  );
};

//aktuellen Authentifizierungsstatus und die zugehörigen Funktionen abrufen
export const UserAuth = () => {
  return useContext(AuthContext);
};

