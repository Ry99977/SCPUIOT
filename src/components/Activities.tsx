import { useState, useEffect } from 'react'
import { Calendar, MapPin, Tag, Download, X, FileText, CheckCircle, Eye, Loader2, Lock, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { activities, Activity } from '@/data/activities'
import { useScrollAnimation } from '@/hooks/useScroll'
import { useUserStore } from '@/store/userStore'

export function Activities() {
  const { setRef, isVisible } = useScrollAnimation()
  const { currentUser } = useUserStore()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const [loadingMd, setLoadingMd] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')

  const handleDownload = async (activity: Activity) => {
    if (!currentUser) {
      setLoginMessage('请先登录后再下载新闻稿')
      setShowLoginModal(true)
      return
    }

    let content = activity.pressRelease
    try {
      const response = await fetch(activity.mdFile)
      if (response.ok) {
        content = await response.text()
      }
    } catch (e) {
      // 如果加载 MD 文件失败，使用 pressRelease 内容
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `物联网协会-${activity.title}-新闻稿.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const loadMarkdown = async (activity: Activity) => {
    if (markdownContent) return
    setLoadingMd(true)
    try {
      const response = await fetch(activity.mdFile)
      const text = await response.text()
      setMarkdownContent(text)
    } catch (e) {
      setMarkdownContent(activity.pressRelease)
    } finally {
      setLoadingMd(false)
    }
  }

  const handleOpenActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowPreview(false)
    setMarkdownContent('')
  }

  const handleTogglePreview = () => {
    if (!showPreview && selectedActivity) {
      loadMarkdown(selectedActivity)
    }
    setShowPreview(!showPreview)
  }

  return (
    <section id="activities" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={setRef} className={`text-center mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="section-title">
            <span className="gradient-text">活动详情</span>
          </h2>
          <p className="section-subtitle">了解协会举办的精彩活动</p>
        </div>

        {downloadSuccess && (
          <div className="fixed top-24 right-6 z-50 glass-card p-4 flex items-center gap-3 border-cyber-neon-green/50 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-cyber-neon-green" />
            <span className="text-sm">新闻稿下载成功！</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleOpenActivity(activity)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/80 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-cyber-neon-cyan/20 text-cyber-neon-cyan border border-cyber-neon-cyan/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyber-neon-cyan transition-colors">
                  {activity.title}
                </h3>

                <div className="space-y-2 text-sm text-cyber-muted mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyber-neon-cyan" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyber-neon-cyan" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                <p className="text-cyber-muted text-sm line-clamp-3 mb-4">
                  {activity.description}
                </p>

                <button
                  className="w-full btn-outline text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(activity)
                  }}
                >
                  {!currentUser && <Lock className="w-4 h-4" />}
                  <Download className="w-4 h-4" />
                  {currentUser ? '下载新闻稿' : '登录后下载'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="glass-card max-w-3xl w-full max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedActivity.image}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent" />
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">{selectedActivity.title}</h3>

              <div className="flex flex-wrap gap-4 mb-4 text-sm text-cyber-muted">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyber-neon-cyan" />
                  {selectedActivity.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyber-neon-cyan" />
                  {selectedActivity.location}
                </span>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyber-neon-cyan" />
                  {selectedActivity.tags.join(', ')}
                </span>
              </div>

              <p className="text-cyber-muted mb-6 leading-relaxed">
                {selectedActivity.description}
              </p>

              {selectedActivity.photos && selectedActivity.photos.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-4 text-cyber-neon-cyan">活动照片</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedActivity.photos.map((photo, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`${selectedActivity.title} 照片 ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => {
                            const img = new Image()
                            img.src = photo
                            const w = window.open('', '_blank')
                            if (w) {
                              w.document.write(`<img src="${photo}" style="max-width:100%;max-height:100vh;margin:auto;display:block;" />`)
                              w.document.body.style.margin = '0'
                              w.document.body.style.background = '#000'
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  onClick={handleTogglePreview}
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? '收起预览' : '预览新闻稿'}
                </button>
                <button
                  className="flex-1 btn-outline flex items-center justify-center gap-2"
                  onClick={() => handleDownload(selectedActivity)}
                >
                  {!currentUser && <Lock className="w-4 h-4" />}
                  <Download className="w-4 h-4" />
                  <FileText className="w-4 h-4" />
                  {currentUser ? '下载全文' : '登录后下载'}
                </button>
              </div>

              {showPreview && (
                <div className="mt-6 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-cyber-neon-cyan/5">
                    <h4 className="text-lg font-bold text-cyber-neon-cyan flex items-center gap-2">
                      📄 新闻稿预览
                    </h4>
                    {loadingMd && (
                      <Loader2 className="w-4 h-4 animate-spin text-cyber-neon-cyan" />
                    )}
                  </div>
                  <div className="p-6 max-h-96 overflow-auto prose prose-invert prose-sm max-w-none
                    prose-headings:text-cyber-neon-cyan prose-headings:font-bold
                    prose-p:text-cyber-muted prose-p:leading-relaxed
                    prose-strong:text-white
                    prose-ul:text-cyber-muted prose-ul:list-disc prose-ul:pl-6
                    prose-li:my-1
                    prose-blockquote:border-cyber-neon-cyan/50 prose-blockquote:text-cyber-muted prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-em:text-cyber-neon-cyan
                    prose-a:text-cyber-neon-cyan prose-a:hover:text-cyber-neon-purple">
                    {loadingMd ? (
                      <div className="flex items-center justify-center py-12 text-cyber-muted">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        加载中...
                      </div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdownContent || selectedActivity.pressRelease}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <button
                  className="text-cyber-muted hover:text-cyber-neon-cyan transition-colors"
                  onClick={() => setSelectedActivity(null)}
                >
                  关闭弹窗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="glass-card max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">需要登录</h3>
            <p className="text-cyber-muted mb-6">{loginMessage}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowLoginModal(false)
                  const loginSection = document.getElementById('login')
                  if (loginSection) {
                    loginSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="btn-primary"
              >
                前往登录/注册
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="btn-outline"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
