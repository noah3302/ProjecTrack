import { createContext, useEffect, useState, useContext } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../pages/firebase';
import { apiget } from '../API/Api';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userdata, setUserdata] = useState(null);

  const googleSignIn = async () => {
    console.log(user);
    if (!user) {
      const provider = new GoogleAuthProvider();
      console.log("angemeldet", user);
      try {
        const result = await signInWithPopup(auth, provider);

        // Setze den Authentifizierungs-Token als Cookie
        const token = await result.user.getIdToken();
        document.cookie = `token=${token};path=/`;

        const { uid, displayName, photoURL } = result.user;
        var currentUser;
        try{
          const g_user = await apiget(`google_user/${uid}`)
          const userId = g_user.id ? g_user.id : false
          currentUser = {
            username: displayName,
            profilePicture : photoURL,
            surname: g_user.surname,
            name: g_user.name,
            nickname: g_user.nickname,
            userid: uid,
            id: userId
          };
        }catch{
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
    }else{
      console.log("nicht ", user);
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

    const receiveAuthState = (event) => {
      const { detail: authState } = event;
      setUser(authState);
    };

    window.addEventListener('storage', receiveAuthState);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', receiveAuthState);
    };
  }, []);

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

export const UserAuth = () => {
  return useContext(AuthContext);
};

