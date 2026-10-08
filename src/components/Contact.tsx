import { Mail, MapPin, MessageCircle, Copy, Check, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScroll'

export function Contact() {
  const { setRef, isVisible } = useScrollAnimation()
  const [copied, setCopied] = useState(false)

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: '邮箱', value: 'Ry99977@outlook.com' },
    { icon: <MapPin className="w-5 h-5" />, label: '位置', value: '四川 · 德阳' },
  ]

  const qqGroup = {
    number: '1104511909',
    label: '26级群',
  }

  const handleCopyQQ = () => {
    navigator.clipboard.writeText(qqGroup.number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyber-neon-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-neon-cyan/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div ref={setRef} className={`text-center mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="section-title">
            <span className="gradient-text">联系我们</span>
          </h2>
          <p className="section-subtitle">物联网协会期待你的加入</p>
        </div>

        <div className={`glass-card p-8 mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold mb-6">联系方式</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyber-neon-cyan/20 to-cyber-neon-purple/20 text-cyber-neon-cyan shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm text-cyber-muted">{info.label}</p>
                  <p className="font-medium">{info.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyber-neon-cyan/20 to-cyber-neon-purple/20 text-cyber-neon-cyan shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cyber-muted">QQ群 · {qqGroup.label}</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{qqGroup.number}</p>
                  <button
                    onClick={handleCopyQQ}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors text-cyber-muted hover:text-cyber-neon-cyan"
                    title="复制群号"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <a
              href="https://www.kdocs.cn/l/cuXBCuH22cGF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyber-neon-cyan/20 to-cyber-neon-purple/20 text-cyber-neon-cyan shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cyber-muted">新生手册</p>
                <p className="font-medium truncate group-hover:text-cyber-neon-cyan transition-colors">2026四川工程职业技术大学新生手册</p>
              </div>
            </a>
          </div>
        </div>

        <div className={`glass-card p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold mb-6 text-center">QQ群二维码</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex justify-center">
              <div className="relative group">
                <img
                  src="/qq-qrcode.jpg"
                  alt="QQ群二维码"
                  className="w-64 h-64 object-contain rounded-lg border border-white/10"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg font-semibold mb-2">川工大物联网协会 26级群</p>
              <p className="text-2xl font-bold gradient-text mb-4">{qqGroup.number}</p>
              <p className="text-cyber-muted mb-6">扫描二维码加入QQ群，与我们一起探索物联网的精彩世界！</p>
              <button
                onClick={handleCopyQQ}
                className="btn-primary inline-flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制群号' : '复制群号'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
