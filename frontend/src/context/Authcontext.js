import { createContext, useEffect, useState, useContext } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../pages/firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    if (!user) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const { uid, displayName, photoURL } = result.user;
        const currentUser = {
          username: displayName,
          profilePicture: photoURL,
          userid: uid,
        };

        setUser(currentUser);
        broadcastAuthState(currentUser);

        // Setze den Authentifizierungs-Token als Cookie
        const token = await result.user.getIdToken();
        document.cookie = `token=${token};path=/`;
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
          const currentUser = {
            username: displayName,
            profilePicture: photoURL,
            userid: uid,
          };
          setUser(currentUser);
          broadcastAuthState(currentUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
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
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

