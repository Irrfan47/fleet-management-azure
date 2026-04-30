import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import api from "@/services/api";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
const USER_KEY = "fleetiq_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/login", { email, password });
    
    // Store token in localStorage (api.ts interceptor will pick it up)
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    }
  };

  return <Ctx.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
