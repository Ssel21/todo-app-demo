import { useContext, useState, useEffect, createContext } from "react";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const signup = (email, password) => {
  return createUserWithEmailAndPassword(email, password);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
