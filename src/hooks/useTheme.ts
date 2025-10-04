
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove from both html and body
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    // Add to both html and body
    root.classList.add(theme);
    body.classList.add(theme);
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggleTheme };
}
