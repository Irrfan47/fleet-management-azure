import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
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
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const mockUser: User = {
      id: "u1",
      name: email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()),
      email,
      role: email.includes("admin") ? "admin" : "user",
    };
    localStorage.setItem(AUTH_TOKEN_KEY, "mock-token-" + Date.now());
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
