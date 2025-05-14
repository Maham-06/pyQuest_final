"use client"
import { useTheme } from "../context/ThemeContext"

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <span className="text-xl">
        {theme === "light" && "☀️"}
        {theme === "dark" && "🌙"}
        {theme === "system" && "⚙️"}
      </span>
    </div>
  )
}

export default ThemeSwitcher
