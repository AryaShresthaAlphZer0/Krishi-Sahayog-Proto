import { useCallback, useEffect, useState } from "react";

import { ThemeContext } from "./themeContextInstance";


const STORAGE_KEY = "krishi_theme";


function getInitialTheme() {

  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  return stored === "dark" ? "dark" : "light";
}


export function ThemeProvider({ children }) {

  const [theme, setThemeState] = useState(getInitialTheme);


  // Apply the theme to <html> and persist it whenever it changes
  useEffect(() => {

    document.documentElement.setAttribute("data-theme", theme);

    window.localStorage.setItem(STORAGE_KEY, theme);

  }, [theme]);


  const setTheme = useCallback((next) => {

    setThemeState(next === "dark" ? "dark" : "light");

  }, []);


  const toggleTheme = useCallback(() => {

    setThemeState((current) =>
      current === "dark" ? "light" : "dark"
    );

  }, []);


  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}