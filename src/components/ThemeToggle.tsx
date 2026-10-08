import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/10"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-cyber-neon-cyan" />
      ) : (
        <Moon className="w-5 h-5 text-cyber-neon-purple" />
      )}
    </button>
  )
}
