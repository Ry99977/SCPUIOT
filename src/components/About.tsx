import { Users, Calendar, Hash, Building2, FileText, UserCheck, LayoutDashboard, ExternalLink } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScroll'

const ADMIN_DASHBOARD_URL = 'https://tkn0dbg51y.jiandaoyun.com/dash/6a884e4495480436a45da2c9'
const ADMIN_DASHBOARD_QR = '/qrcode_tkn0dbg51y.jiandaoyun.com.png'

const clubInfoItems = [
  { icon: <UserCheck className="w-5 h-5" />, label: '指导老师', value: '何晓龙' },
  { icon: <Calendar className="w-5 h-5" />, label: '成立时间', value: '2026年4月' },
  { icon: <FileText className="w-5 h-5" />, label: '社团类型', value: '学术科技类' },
  { icon: <Hash className="w-5 h-5" />, label: '社团代码', value: 'X102' },
  { icon: <Building2 className="w-5 h-5" />, label: '业务指导单位', value: '软件工程学院' },
  { icon: <Users className="w-5 h-5" />, label: '会员人数', value: '61' },
]

export function About() {
  const { setRef, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div ref={setRef} className={`text-center mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="section-title">
            <span className="gradient-text">关于我们</span>
          </h2>
          <p className="section-subtitle">了解物联网协会的发展历程与技术方向</p>
        </div>

        <div className="glass-card p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-cyber-neon-cyan" />
            协会简介
          </h3>
          <div className="space-y-4 text-cyber-muted dark:text-cyber-muted light:text-cyber-muted-light leading-relaxed">
            <p>
              物联网协会成立于 2026 年 4 月，是学校最具活力的技术类社团之一。
              协会致力于为对物联网技术感兴趣的同学提供学习、实践与交流的平台，
              培养创新型物联网技术人才。
            </p>
            <p>
              在这里，你可以从零基础开始学习嵌入式开发、物联网通信、传感器应用等技术，
              参与真实的物联网项目开发，接触完整的产品研发流程，
              也可以结识志同道合的朋友，共同探索万物互联的科技世界。
            </p>
            <p>
              协会拥有完善的物联网实验室，配备 STM32、ESP32、Raspberry Pi 等开发套件，
              以及各类传感器模块。与多家物联网企业建立合作关系，
              为成员提供企业参观、实习推荐、联合项目等机会。
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyber-neon-cyan" />
            社团信息
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {clubInfoItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="p-2 rounded-lg bg-gradient-to-br from-cyber-neon-cyan/20 to-cyber-neon-purple/20 text-cyber-neon-cyan shrink-0">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-cyber-muted">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 mt-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyber-neon-cyan" />
            社团公告
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <a
              href={ADMIN_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="relative">
                <img
                  src={ADMIN_DASHBOARD_QR}
                  alt="社团公告系统二维码"
                  className="w-40 h-40 rounded-lg border border-white/10 group-hover:border-cyber-neon-cyan/50 transition-colors"
                />
                <div className="absolute inset-0 rounded-lg bg-cyber-neon-cyan/0 group-hover:bg-cyber-neon-cyan/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ExternalLink className="w-8 h-8 text-cyber-neon-cyan" />
                </div>
              </div>
            </a>
            <div className="flex-1 text-center md:text-left">
              <p className="text-base font-semibold mb-2">社团公告系统</p>
              <p className="text-sm text-cyber-muted mb-4">
                点击下方链接或扫描左侧二维码，访问社团公告系统进行文件预览及下载等操作。
              </p>
              <a
                href={ADMIN_DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                访问公告系统
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
