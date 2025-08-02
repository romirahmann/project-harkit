/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    try {
      // console.log("Dari AUTH: ", userData, token);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // ✅ tambahkan ini
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <>
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
