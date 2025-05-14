"use client"

import { createContext, useState, useContext, useEffect } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage("theme", "system")
  const [theme, setTheme] = useState(storedTheme)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old theme class
    root.classList.remove("light", "dark")

    // Determine if we should use dark mode
    let darkMode = false

    if (theme === "dark") {
      darkMode = true
    } else if (theme === "system") {
      darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    // Add the right class
    root.classList.add(darkMode ? "dark" : "light")
    setIsDark(darkMode)

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
        setIsDark(mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const setThemePreference = (newTheme) => {
    setTheme(newTheme)
    setStoredTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme: setThemePreference }}>{children}</ThemeContext.Provider>
  )
}
