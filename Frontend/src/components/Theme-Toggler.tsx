import React from "react"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const ThemeToggler: React.FC = () => {
    const { theme, setTheme } = useTheme()
  return (
    <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full w-9 h-9 cursor-pointer"
        aria-label="Toggle theme"
    >
        {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        )}
    </Button>
  )
}

export default ThemeToggler