import { useState, useRef } from 'react'
import { User, Lock, Eye, EyeOff, LogOut, Download, Upload, Users, Shield, Crown, Database } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useScrollAnimation } from '@/hooks/useScroll'

export function Login() {
  const { setRef, isVisible } = useScrollAnimation()
  const { users, currentUser, register, login, logout, exportUsers, importUsers, isAdmin } = useUserStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const publicFileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!studentId.trim() || !password.trim()) {
      setMessage('请填写完整信息')
      setMessageType('error')
      return
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setMessage('密码至少6位')
        setMessageType('error')
        return
      }
      const result = await register(studentId.trim(), password)
      setMessage(result.message)
      setMessageType(result.success ? 'success' : 'error')
      if (result.success) {
        setPassword('')
      }
    } else {
      const result = await login(studentId.trim(), password)
      setMessage(result.message)
      setMessageType(result.success ? 'success' : 'error')
      if (result.success) {
        setPassword('')
      }
    }
  }

  const handleLogout = () => {
    logout()
    setStudentId('')
    setPassword('')
    setMessage('已退出登录')
    setMessageType('success')
  }

  const handleExport = async () => {
    const result = await exportUsers()
    setMessage(result.message)
    setMessageType(result.success ? 'success' : 'error')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const jsonData = event.target?.result as string
      const result = await importUsers(jsonData)
      setMessage(result.message)
      setMessageType(result.success ? 'success' : 'error')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setMessage('')
    setMessageType('')
    setPassword('')
  }

  return (
    <section
      id="login"
      ref={setRef}
      className="py-20 px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neon-purple/5 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`text-center mb-8 ${
            isVisible ? 'animate-fade-in-down' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            会员中心
          </h2>
          <p className="text-cyber-muted">注册学号，开启你的物联网之旅</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* 左侧：登录/注册表单 */}
          <div
            className={`glass-card p-8 transition-all duration-700 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            {currentUser ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-neon-cyan to-cyber-neon-purple flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  欢迎回来
                  {isAdmin() && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      <Crown className="w-3 h-3" />
                      管理员
                    </span>
                  )}
                </h3>
                <p className="text-xl text-cyber-neon-cyan font-mono mb-1">
                  {currentUser.studentId}
                </p>
                <p className="text-sm text-cyber-muted mb-2">
                  学号：{currentUser.studentId}
                </p>
                <p className="text-sm text-cyber-muted mb-6">
                  注册时间：{new Date(currentUser.createdAt).toLocaleString('zh-CN')}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={handleExport}
                    className={`btn-outline flex items-center gap-2 ${!isAdmin() ? 'opacity-60' : ''}`}
                    title={!isAdmin() ? '仅管理员可导出' : '导出用户数据'}
                  >
                    <Download className="w-4 h-4" />
                    导出用户数据
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-primary flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => mode !== 'login' && switchMode()}
                    className={`flex-1 py-2 rounded-md transition-all duration-300 ${
                      mode === 'login'
                        ? 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan shadow-lg shadow-cyber-neon-cyan/20'
                        : 'text-cyber-muted hover:text-white'
                    }`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => mode !== 'register' && switchMode()}
                    className={`flex-1 py-2 rounded-md transition-all duration-300 ${
                      mode === 'register'
                        ? 'bg-cyber-neon-purple/20 text-cyber-neon-purple shadow-lg shadow-cyber-neon-purple/20'
                        : 'text-cyber-muted hover:text-white'
                    }`}
                  >
                    注册
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-cyber-muted mb-2">
                      学号
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted" />
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="请输入学号"
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-neon-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyber-muted mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码（至少6位）"
                        className="w-full pl-11 pr-11 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-neon-cyan transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded-lg text-sm text-center ${
                        messageType === 'success'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-cyber-neon-cyan to-cyber-neon-purple text-white hover:shadow-lg hover:shadow-cyber-neon-cyan/30'
                        : 'bg-gradient-to-r from-cyber-neon-purple to-cyber-neon-cyan text-white hover:shadow-lg hover:shadow-cyber-neon-purple/30'
                    }`}
                  >
                    {mode === 'login' ? '登录' : '注册'}
                  </button>

                  <p className="text-center text-sm text-cyber-muted">
                    {mode === 'login' ? '还没有账号？' : '已有账号？'}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="ml-1 text-cyber-neon-cyan hover:underline"
                    >
                      {mode === 'login' ? '立即注册' : '去登录'}
                    </button>
                  </p>

                  {users.length === 0 && (
                    <>
                      <div className="my-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-cyber-muted">或</span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                      <input
                        ref={publicFileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => publicFileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-lg border border-cyber-neon-cyan/50 text-cyber-neon-cyan text-sm hover:bg-cyber-neon-cyan/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Database className="w-4 h-4" />
                        导入账号数据（JSON）
                      </button>
                      <p className="text-center text-xs text-cyber-muted mt-2">
                        新浏览器首次使用？导入之前导出的账号数据
                      </p>
                    </>
                  )}
                </form>
              </>
            )}
          </div>

          {/* 右侧：统计信息 */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'
            }`}
          >
            {isAdmin() && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyber-neon-cyan/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyber-neon-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    用户统计
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      <Crown className="w-3 h-3" />
                      管理员专属
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyber-neon-cyan">
                      {users.length}
                    </div>
                    <div className="text-sm text-cyber-muted mt-1">注册用户</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyber-neon-purple">
                      {currentUser ? '在线' : '离线'}
                    </div>
                    <div className="text-sm text-cyber-muted mt-1">当前状态</div>
                  </div>
                </div>
              </div>
            )}

            {isAdmin() && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyber-neon-purple/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyber-neon-purple" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    数据管理
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      <Crown className="w-3 h-3" />
                      管理员专属
                    </span>
                  </h3>
                </div>
                <p className="text-sm text-cyber-muted mb-4">
                  所有用户数据存储在本地浏览器（localStorage），可导出/导入 JSON 文件备份。
                </p>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleExport}
                    className="w-full btn-outline flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    导出全部用户数据
                  </button>
                  <button
                    onClick={handleImportClick}
                    className="w-full btn-outline flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    导入用户数据（JSON）
                  </button>
                </div>
              </div>
            )}

            </div>
        </div>
      </div>
    </section>
  )
}
