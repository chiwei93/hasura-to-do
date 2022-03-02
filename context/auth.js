import { createContext, useState, useContext } from "react";

const AuthContext = createContext({
  isSignedIn: false,
});

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const login = () => {
    setIsSignedIn(true);
  };

  const logout = () => {
    setIsSignedIn(false);
  };

  const context = { isSignedIn, login, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
