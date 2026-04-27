import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { THEME_KEY } from "@/utils/constants";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; toggle: () => void; }
const Ctx = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(THEME_KEY) as Theme | null) : null;
    if (saved) return saved;
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
