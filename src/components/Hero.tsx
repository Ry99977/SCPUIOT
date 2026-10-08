import { useState, useEffect } from 'react'
import { Github, Cpu, Radio, Wifi } from 'lucide-react'

const roles = [
  '嵌入式开发',
  '物联网通信',
  '智能家居',
  '智慧农业',
  '工业物联网',
  'AIoT 应用',
]

export function Hero() {
  const [displayText, setDisplayText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentRole.length) {
            setDisplayText(currentRole.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setRoleIndex((prev) => (prev + 1) % roles.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 grid-bg" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-neon-cyan/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Cpu className="w-4 h-4 text-cyber-neon-cyan" />
            <span className="text-sm font-mono text-cyber-muted">
              智联万物，技启未来，共创物联新生态
            </span>
          </div>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.3s', fontFamily: "'Ma Shan Zheng', cursive" }}
        >
          <span className="block text-cyber-text dark:text-cyber-text light:text-cyber-text-light">
            四川工程职业技术大学
          </span>
          <span className="block gradient-text mt-2">
            物联网协会
          </span>
        </h1>

        <div
          className="text-2xl md:text-3xl mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <span className="text-cyber-muted dark:text-cyber-muted light:text-cyber-muted-light">
            专注于{' '}
          </span>
          <span className="gradient-text font-mono typing-cursor">
            {displayText}
          </span>
        </div>

        <p
          className="text-lg md:text-xl text-cyber-muted dark:text-cyber-muted light:text-cyber-muted-light max-w-2xl mx-auto mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.7s' }}
        >
          成立于 2026 年 4 月，致力于推广物联网技术，培养学生创新实践能力。
          在这里，你可以学习嵌入式开发、参与真实物联网项目、接触前沿技术，
          结识志同道合的朋友，共同探索万物互联的世界。
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.9s' }}
        >
          <button
            onClick={() => scrollToSection('projects')}
            className="btn-primary w-full sm:w-auto"
          >
            查看协会项目
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-outline w-full sm:w-auto"
          >
            加入我们
          </button>
        </div>

        <div
          className="flex items-center justify-center gap-6 animate-fade-in-up"
          style={{ animationDelay: '1.1s' }}
        >
          <div className="flex flex-col items-center gap-2 p-3 rounded-full glass-card">
            <Wifi className="w-5 h-5 text-cyber-neon-cyan" />
            <span className="text-xs text-cyber-muted">感知层</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-full glass-card">
            <Radio className="w-5 h-5 text-cyber-neon-purple" />
            <span className="text-xs text-cyber-muted">网络层</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-full glass-card">
            <Cpu className="w-5 h-5 text-cyber-neon-green" />
            <span className="text-xs text-cyber-muted">应用层</span>
          </div>
        </div>
      </div>

      </section>
  )
}
