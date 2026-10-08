import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { experiences } from '@/data/experience'
import { useScrollAnimation } from '@/hooks/useScroll'

function ExperienceItem({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0)
  const { setRef, isVisible } = useScrollAnimation()

  return (
    <div
      ref={setRef}
      className={`relative pl-8 pb-12 last:pb-0 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-neon-cyan via-cyber-neon-purple to-transparent" />
      
      <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-cyber-neon-cyan ring-4 ring-cyber-neon-cyan/20" />

      <div
        className="glass-card p-6 cursor-pointer hover:scale-[1.01] transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold gradient-text">{exp.position}</h3>
            <p className="text-lg font-medium mt-1">{exp.company}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-cyber-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {exp.period}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {exp.location}
            </span>
          </div>
        </div>

        <p className="text-cyber-muted mb-4">{exp.description}</p>

        <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-bold text-cyber-neon-cyan mb-3">主要成就</h4>
            <ul className="space-y-2 mb-6">
              {exp.achievements.map((achievement) => (
                <li key={achievement} className="flex items-start gap-2 text-cyber-muted text-sm">
                  <span className="text-cyber-neon-green mt-1">▸</span>
                  {achievement}
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-bold text-cyber-neon-cyan mb-3">技术栈</h4>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-md bg-white/5 text-cyber-muted border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 text-cyber-muted">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
    </div>
  )
}

export function Experience() {
  const { setRef, isVisible } = useScrollAnimation()

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div ref={setRef} className={`text-center mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="section-title">
            <span className="gradient-text">发展历程</span>
          </h2>
          <p className="section-subtitle">物联网协会的成长足迹</p>
        </div>

        <div className="relative">
          {experiences.map((exp, index) => (
            <ExperienceItem key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
