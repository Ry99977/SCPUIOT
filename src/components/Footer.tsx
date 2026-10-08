import { Github, Linkedin, Mail, ArrowUp, Heart } from 'lucide-react'

const navLinks = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于我们' },
  { id: 'projects', label: '协会项目' },
  { id: 'converter', label: '常用工具' },
  { id: 'login', label: '会员中心' },
  { id: 'contact', label: '联系我们' },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="md:col-span-2">
            <button
              onClick={scrollToTop}
              className="text-2xl font-bold mb-4 inline-flex items-center gap-2"
            >
              <img src="/logo.png" alt="物联网协会会徽" className="w-10 h-10 rounded-full object-cover" />
              <span className="gradient-text" style={{ fontFamily: "'Ma Shan Zheng', cursive", fontSize: '1.5rem' }}>川工大物联网协会</span>
            </button>
            <p className="text-cyber-muted mb-6 max-w-md leading-relaxed">
              智联万物，技启未来，共创物联新生态。四川工程职业技术大学物联网协会，
              致力于推广物联网技术，培养学生创新实践能力。
            </p>
            <div className="flex gap-3 items-center">
              <a
                href="https://www.scpu.edu.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyber-neon-cyan/20 to-cyber-neon-purple/20 hover:from-cyber-neon-cyan/30 hover:to-cyber-neon-purple/30 transition-colors"
              >
                <img src="/SCPU-logo.png" alt="四川工程职业技术大学" className="h-8 w-auto" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:Ry99977@outlook.com"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">快速导航</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">联系方式</h3>
            <ul className="space-y-3 text-cyber-muted text-sm">
              <li>
                <span className="text-cyber-neon-cyan">邮箱：</span>
                <br />
                Ry99977@outlook.com
              </li>
              <li>
                <span className="text-cyber-neon-cyan">位置：</span>
                <br />
                四川 · 德阳
              </li>
              <li>
                <span className="text-cyber-neon-cyan">活动时间：</span>
                <br />
                每周二 12:50-13:20
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">友情链接</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://scpu.top/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
                >
                  四川工程职业技术大学计算机协会
                </a>
              </li>
              <li>
                <a
                  href="https://sso.scpu.edu.cn/login?service=https:%2F%2Fjiaowu.scetc.edu.cn%2Fsso.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
                >
                  四川工程职业技术大学教务系统
                </a>
              </li>
              <li>
                <a
                  href="https://www.scpu.edu.cn/xxzx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
                >
                  四川工程职业技术大学信息中心
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cyber-muted text-sm">
            © 2026 四川工程职业技术大学 · 物联网协会. All rights reserved.
          </p>
          <p className="text-cyber-muted text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Tailwind
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cyber-muted/60">
          <p>网站维护人：涛</p>
          <p>最终解释权归四川工程职业技术大学物联网协会所有</p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 rounded-full glass-card hover:scale-110 transition-all duration-300 z-30 group"
        aria-label="回到顶部"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  )
}
