import { useState, useEffect } from 'react'
import { Lock, LogIn, RotateCcw, Sparkles, SortAsc, SortDesc, User, Hash } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { incrementUsage, getRemainingUses, isLimitReached, getDailyLimit } from '@/utils/usageLimit'

const FEATURE_NAME = 'draw'

interface Person {
  name: string
  studentId: string
  display: string
}

function parseItems(input: string): Person[] {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const people: Person[] = []

  for (const line of lines) {
    // 尝试匹配学号（纯数字或带字母的学号）
    const numMatch = line.match(/(\d{6,}[A-Za-z0-9]*)/)
    let studentId = ''
    let name = ''

    if (numMatch) {
      studentId = numMatch[1]
      // 名字是去掉学号后的内容
      name = line.replace(studentId, '').replace(/[、，,\s\t;:：;]+/g, '').trim()
    } else {
      name = line
    }

    if (name || studentId) {
      let display = ''
      if (name && studentId) {
        display = `${name}（${studentId}）`
      } else {
        display = name || studentId
      }
      people.push({ name, studentId, display })
    }
  }

  return people
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function Draw() {
  const { currentUser } = useUserStore()
  const [itemsInput, setItemsInput] = useState('')
  const [drawCount, setDrawCount] = useState(1)
  const [allowRepeat, setAllowRepeat] = useState(false)
  const [sortByStudentId, setSortByStudentId] = useState(false)
  const [sortAsc, setSortAsc] = useState(true)
  const [results, setResults] = useState<Person[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [remainingUses, setRemainingUses] = useState(getRemainingUses(FEATURE_NAME))
  const [reachedLimit, setReachedLimit] = useState(isLimitReached(FEATURE_NAME))
  const [animationPerson, setAnimationPerson] = useState<Person | null>(null)

  useEffect(() => {
    if (currentUser) {
      setReachedLimit(false)
    } else {
      setReachedLimit(isLimitReached(FEATURE_NAME))
      setRemainingUses(getRemainingUses(FEATURE_NAME))
    }
  }, [currentUser])

  const allPeople = parseItems(itemsInput)

  const handleDraw = () => {
    if (allPeople.length === 0) return

    if (!currentUser) {
      if (isLimitReached(FEATURE_NAME)) {
        setShowLoginModal(true)
        return
      }
      incrementUsage(FEATURE_NAME)
      setRemainingUses(getRemainingUses(FEATURE_NAME))
      setReachedLimit(isLimitReached(FEATURE_NAME))
    }

    const count = Math.min(drawCount, allowRepeat ? 100 : allPeople.length)

    setIsDrawing(true)
    setResults([])

    let frame = 0
    const maxFrames = 20
    const interval = setInterval(() => {
      frame++
      if (frame < maxFrames) {
        const randomPerson = allPeople[Math.floor(Math.random() * allPeople.length)]
        setAnimationPerson(randomPerson)
      } else {
        clearInterval(interval)
        let finalResults: Person[]
        if (allowRepeat) {
          finalResults = Array.from({ length: count }, () =>
            allPeople[Math.floor(Math.random() * allPeople.length)]
          )
        } else {
          finalResults = shuffleArray(allPeople).slice(0, count)
        }

        // 按学号排序（如果开启）
        if (sortByStudentId) {
          finalResults.sort((a, b) => {
            if (!a.studentId && !b.studentId) return 0
            if (!a.studentId) return sortAsc ? 1 : -1
            if (!b.studentId) return sortAsc ? -1 : 1
            const cmp = a.studentId.localeCompare(b.studentId, undefined, { numeric: true })
            return sortAsc ? cmp : -cmp
          })
        }

        setResults(finalResults)
        setAnimationPerson(null)
        setIsDrawing(false)
      }
    }, 60)
  }

  const handleReset = () => {
    setResults([])
    setAnimationPerson(null)
  }

  const handleQuickFill = () => {
    setItemsInput('2025001 张三\n2025002 李四\n2025003 王五\n2025004 赵六\n2025005 钱七\n2025006 孙八\n2025007 周九\n2025008 吴十')
  }

  const handleSortAll = () => {
    if (allPeople.length === 0) return
    const sorted = [...allPeople].sort((a, b) => {
      if (!a.studentId && !b.studentId) return 0
      if (!a.studentId) return sortAsc ? 1 : -1
      if (!b.studentId) return sortAsc ? -1 : 1
      const cmp = a.studentId.localeCompare(b.studentId, undefined, { numeric: true })
      return sortAsc ? cmp : -cmp
    })
    setItemsInput(sorted.map(p => p.studentId && p.name ? `${p.studentId} ${p.name}` : p.display).join('\n'))
  }

  return (
    <section id="draw" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyber-neon-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyber-neon-cyan/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="section-title">
            <span className="gradient-text">随机抽签</span>
          </h2>
          <p className="section-subtitle">公平随机抽取，支持学号+姓名</p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up relative" style={{ animationDelay: '0.2s' }}>
          {!currentUser && !reachedLimit && (
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-cyber-muted">今日剩余免费使用次数：</span>
              <span className={`font-mono font-bold ${remainingUses <= 10 ? 'text-yellow-400' : 'text-cyber-neon-cyan'}`}>
                {remainingUses} / {getDailyLimit()}
              </span>
            </div>
          )}

          <div className={reachedLimit ? 'opacity-30 pointer-events-none' : ''}>
            {/* 输入区域 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-cyber-text">
                  抽签名单
                </label>
                <div className="flex gap-2">
                  {allPeople.some(p => p.studentId) && (
                    <button
                      onClick={handleSortAll}
                      className="text-xs text-cyber-neon-cyan hover:text-cyber-neon-cyan/80 transition-colors flex items-center gap-1"
                      title="按学号排序所有名单"
                    >
                      {sortAsc ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                      排序
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-cyber-muted mb-2">
                每行一条，支持 <span className="text-cyber-neon-cyan">学号 姓名</span>、
                <span className="text-cyber-neon-cyan">姓名 学号</span> 或仅姓名/学号
              </p>
              <textarea
                value={itemsInput}
                onChange={(e) => setItemsInput(e.target.value)}
                placeholder={`2025001 张三\n2025002 李四\n2025003 王五\n2025004 赵六`}
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-neon-cyan transition-colors resize-none font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-cyber-muted flex gap-4">
                  <span>
                    共 <span className="text-cyber-neon-cyan font-bold">{allPeople.length}</span> 人
                  </span>
                  <span>
                    有学号 <span className="text-cyber-neon-purple font-bold">{allPeople.filter(p => p.studentId).length}</span> 人
                  </span>
                </div>
                <button
                  onClick={handleQuickFill}
                  className="text-xs text-cyber-neon-cyan hover:text-cyber-neon-cyan/80 transition-colors"
                >
                  填充示例
                </button>
              </div>
            </div>

            {/* 设置区域 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">
                  抽签个数
                </label>
                <input
                  type="number"
                  min={1}
                  max={allowRepeat ? 100 : Math.max(1, allPeople.length)}
                  value={drawCount}
                  onChange={(e) => setDrawCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyber-neon-cyan transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">
                  是否允许重复
                </label>
                <div className="flex items-center gap-2 h-[46px]">
                  <button
                    onClick={() => setAllowRepeat(false)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      !allowRepeat
                        ? 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan border border-cyber-neon-cyan/50'
                        : 'bg-white/5 text-cyber-muted border border-white/10 hover:text-cyber-text'
                    }`}
                  >
                    不重复
                  </button>
                  <button
                    onClick={() => setAllowRepeat(true)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      allowRepeat
                        ? 'bg-cyber-neon-purple/20 text-cyber-neon-purple border border-cyber-neon-purple/50'
                        : 'bg-white/5 text-cyber-muted border border-white/10 hover:text-cyber-text'
                    }`}
                  >
                    可重复
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">
                  按学号排序结果
                </label>
                <div className="flex items-center gap-2 h-[46px]">
                  <button
                    onClick={() => setSortByStudentId(!sortByStudentId)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-1 ${
                      sortByStudentId
                        ? 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan border border-cyber-neon-cyan/50'
                        : 'bg-white/5 text-cyber-muted border border-white/10 hover:text-cyber-text'
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    {sortByStudentId ? '已开启' : '开启'}
                  </button>
                  {sortByStudentId && (
                    <button
                      onClick={() => setSortAsc(!sortAsc)}
                      className="px-3 py-2 rounded-lg bg-white/5 text-cyber-muted border border-white/10 hover:text-cyber-text transition-colors text-sm flex items-center gap-1"
                      title={sortAsc ? '升序' : '降序'}
                    >
                      {sortAsc ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                      {sortAsc ? '升序' : '降序'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 抽签按钮 */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handleDraw}
                disabled={isDrawing || allPeople.length === 0}
                className="btn-primary flex items-center gap-2 px-8 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                {isDrawing ? '抽签中...' : '开始抽签'}
              </button>
              <button
                onClick={handleReset}
                disabled={isDrawing}
                className="btn-outline flex items-center gap-2 disabled:opacity-30"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </div>

            {/* 结果显示 */}
            {(results.length > 0 || animationPerson) && (
              <div className="mt-6 p-6 rounded-lg bg-gradient-to-br from-cyber-neon-cyan/10 to-cyber-neon-purple/10 border border-white/10">
                <h3 className="text-sm font-medium text-cyber-muted mb-4 text-center">抽签结果</h3>
                {isDrawing && animationPerson && (
                  <div className="text-center">
                    <span className="text-3xl font-bold gradient-text animate-pulse">
                      {animationPerson.display}
                    </span>
                  </div>
                )}
                {!isDrawing && results.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {results.map((person, index) => (
                      <div
                        key={index}
                        className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyber-neon-cyan/20 to-cyber-neon-purple/20 border border-white/10 animate-fade-in-up flex items-center gap-4"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-cyber-neon-cyan shrink-0">
                          {index + 1}
                        </span>
                        {person.studentId && (
                          <span className="font-mono text-sm text-cyber-neon-purple shrink-0">
                            {person.studentId}
                          </span>
                        )}
                        {person.name && (
                          <span className="text-white font-bold text-lg">{person.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {reachedLimit && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm rounded-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">今日免费次数已用完</h3>
                <p className="text-cyber-muted mb-6">请登录后继续使用随机抽签</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  前往登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
            <p className="text-cyber-muted mb-6">免费使用次数已用完，请登录后继续使用</p>
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
