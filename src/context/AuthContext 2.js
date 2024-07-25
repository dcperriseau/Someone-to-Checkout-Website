import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseApp } from '../firebaseConfig'; // Ensure this points to your Firebase config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);

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
    const auth = getAuth(getFirebaseApp());
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
