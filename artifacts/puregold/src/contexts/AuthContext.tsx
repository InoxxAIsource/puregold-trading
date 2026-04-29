import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  isLoggedIn: boolean;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pg_auth");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const login = (data: any) => {
    setUser(data);
    localStorage.setItem("pg_auth", JSON.stringify(data));
    window.dispatchEvent(new Event("authLogin"));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pg_auth");
    window.dispatchEvent(new Event("authLogout"));
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
