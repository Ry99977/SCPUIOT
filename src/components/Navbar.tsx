import { useState, useEffect } from 'react'
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useScroll } from '@/hooks/useScroll'
import { useUIStore } from '@/store/useStore'

const navLinks = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于我们' },
  { id: 'projects', label: '协会项目' },
  { id: 'converter', label: '常用工具' },
  { id: 'login', label: '会员中心' },
  { id: 'contact', label: '联系我们' },
]

export function Navbar() {
  const { isScrolled } = useScroll()
  const { activeSection, mobileMenuOpen, toggleMobileMenu, setActiveSection } = useUIStore()

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    if (mobileMenuOpen) toggleMobileMenu()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.id))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach(section => section && observer.observe(section))
    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl bg-cyber-bg/80 dark:bg-cyber-bg/80 border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => handleNavClick('home')}
          className="text-xl font-bold flex items-center gap-2"
        >
          <img src="/logo.png" alt="物联网协会会徽" className="w-10 h-10 rounded-full object-cover" />
          <span className="gradient-text" style={{ fontFamily: "'Ma Shan Zheng', cursive", fontSize: '1.1rem' }}>四川工程职业技术大学物联网协会</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative font-medium transition-colors duration-300 ${
                activeSection === link.id
                  ? 'text-cyber-neon-cyan'
                  : 'text-cyber-muted dark:text-cyber-muted light:text-cyber-muted-light hover:text-cyber-text dark:hover:text-cyber-text light:hover:text-cyber-text-light'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-neon-cyan to-cyber-neon-purple rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:hello@example.com" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-cyber-bg/95 dark:bg-cyber-bg/95 border-b border-white/10 animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-white/10 text-cyber-neon-cyan'
                    : 'hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@example.com" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
