import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getFirebaseApp } from '../firebaseConfig.js'; 

const AuthContext = createContext();
//export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  console.log('ID Token:', idToken);

  useEffect(() => {
    const auth = getAuth(getFirebaseApp());
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true); // force refresh the token
        setUser(user);
        setIdToken(token);
      } else {
        setUser(null);
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setIdToken(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, idToken, setIdToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
