import { useState } from 'react'
import { Github, ExternalLink, X, CheckCircle2 } from 'lucide-react'
import { projects, categories, type Project } from '@/data/projects'
import { useScrollAnimation } from '@/hooks/useScroll'
import { useUIStore } from '@/store/useStore'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { setRef, isVisible } = useScrollAnimation()
  const { setSelectedProject } = useUIStore()

  return (
    <div
      ref={setRef}
      className={`group ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="glass-card overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl neon-border"
        onClick={() => setSelectedProject(project.id)}
      >
        <div className="relative overflow-hidden aspect-video">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono bg-cyber-neon-cyan/20 text-cyber-neon-cyan backdrop-blur-sm">
            {project.category}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-cyber-muted text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-md bg-white/5 text-cyber-muted border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-cyber-bg/90 backdrop-blur-md" />
      
      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-card animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-cyber-bg/80 hover:bg-cyber-bg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-video">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-surface via-transparent to-transparent" />
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyber-neon-cyan/20 text-cyber-neon-cyan mb-3">
                {project.category}
              </span>
              <h2 className="text-3xl font-bold gradient-text">{project.title}</h2>
            </div>
          </div>

          <p className="text-lg text-cyber-muted mb-8">{project.longDescription}</p>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">核心功能</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyber-neon-green flex-shrink-0" />
                  <span className="text-cyber-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Github className="w-5 h-5" />
              查看源码
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg btn-primary"
            >
              <ExternalLink className="w-5 h-5" />
              在线预览
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const { setRef, isVisible } = useScrollAnimation()
  const { selectedProject, setSelectedProject } = useUIStore()

  const selected = projects.find((p) => p.id === selectedProject)

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={setRef} className={`text-center mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="section-title">
            <span className="gradient-text">协会项目</span>
          </h2>
          <p className="section-subtitle">项目组筹建中，欢迎有兴趣的同学加入</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className={`glass-card p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="space-y-4 text-cyber-muted leading-relaxed">
            <p>
              <span className="text-cyber-neon-cyan font-medium">说明：</span>
              目前处于项目组筹建阶段，相关技术方案已初步梳理，难度可控，具备机械、电控或算法基础的会员均可参与。
            </p>
            <p>
              此外，如有其他项目构想，也欢迎随时私聊沟通，协会将给予支持。
            </p>
          </div>
        </div>
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}
