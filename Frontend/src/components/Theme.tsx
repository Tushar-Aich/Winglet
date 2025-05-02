import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Theme = () => {
    const {theme, setTheme} = useTheme()
    const [mounted, setMounted] = useState<Boolean>(false)

    useEffect(() => setMounted(true), [])
    if(!mounted) return null;
  return (
    <div>
        {theme === 'light' ? (
            <Sun className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" onClick={() => setTheme('dark')}/>
        ) : (
            <Moon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" onClick={() => setTheme('light')}/>
        )}
    </div>
  )
}

export default Theme