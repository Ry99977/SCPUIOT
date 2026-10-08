import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Shuffle, FastForward, Rewind, Lock, LogIn } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { incrementUsage, getRemainingUses, isLimitReached, getDailyLimit } from '@/utils/usageLimit'

const ARRAY_SIZE = 10
const MIN_VALUE = 5
const MAX_VALUE = 100
const FEATURE_NAME = 'bubble_sort'

function generateRandomArray(): number[] {
  const arr: number[] = []
  for (let i = 0; i < ARRAY_SIZE; i++) {
    arr.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE)
  }
  return arr
}

interface SortStep {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  sorted: number[]
}

function generateSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sorted: number[] = []

  steps.push({ array: [...arr], comparing: null, swapping: null, sorted: [] })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: null, sorted: [...sorted] })

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({ array: [...arr], comparing: null, swapping: [j, j + 1], sorted: [...sorted] })
      }
    }
    sorted.unshift(n - i - 1)
    steps.push({ array: [...arr], comparing: null, swapping: null, sorted: [...sorted] })
  }

  sorted.unshift(0)
  steps.push({ array: [...arr], comparing: null, swapping: null, sorted: Array.from({ length: n }, (_, i) => i) })

  return steps
}

export function BubbleSort() {
  const { currentUser } = useUserStore()
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [remainingUses, setRemainingUses] = useState(getDailyLimit())
  const [showLoginModal, setShowLoginModal] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!currentUser) {
      setRemainingUses(getRemainingUses(FEATURE_NAME))
    }
  }, [currentUser])

  const reachedLimit = !currentUser && isLimitReached(FEATURE_NAME)

  const initArray = useCallback(() => {
    if (!currentUser && reachedLimit) {
      setShowLoginModal(true)
      return
    }

    if (!currentUser) {
      const result = incrementUsage(FEATURE_NAME)
      setRemainingUses(result.remaining)
    }

    const arr = generateRandomArray()
    const newSteps = generateSortSteps(arr)
    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [currentUser, reachedLimit])

  useEffect(() => {
    initArray()
  }, [])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, speed)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, currentStep, steps.length, speed])

  const togglePlay = () => {
    if (reachedLimit) {
      setShowLoginModal(true)
      return
    }
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const stepForward = () => {
    if (reachedLimit) {
      setShowLoginModal(true)
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const stepBackward = () => {
    if (reachedLimit) {
      setShowLoginModal(true)
      return
    }
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const reset = () => {
    if (reachedLimit) {
      setShowLoginModal(true)
      return
    }
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const currentData = steps[currentStep] || { array: [], comparing: null, swapping: null, sorted: [] }

  const maxValue = Math.max(...currentData.array, 1)

  return (
    <section id="bubble-sort" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyber-neon-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyber-neon-cyan/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="section-title">
            <span className="gradient-text">冒泡排序演示</span>
          </h2>
          <p className="section-subtitle">可视化展示冒泡排序算法的执行过程</p>
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
            <div className="relative h-80 flex items-end justify-center gap-2 mb-8">
              {currentData.array.map((value, index) => {
                const isComparing = currentData.comparing?.includes(index)
                const isSwapping = currentData.swapping?.includes(index)
                const isSorted = currentData.sorted.includes(index)

                let barColor = 'bg-gradient-to-t from-cyber-neon-cyan to-cyber-neon-cyan/60'
                if (isComparing) {
                  barColor = 'bg-gradient-to-t from-yellow-400 to-yellow-400/60'
                }
                if (isSwapping) {
                  barColor = 'bg-gradient-to-t from-red-400 to-red-400/60'
                }
                if (isSorted) {
                  barColor = 'bg-gradient-to-t from-green-400 to-green-400/60'
                }

                return (
                  <div key={index} className="flex flex-col items-center" style={{ width: `${100 / ARRAY_SIZE}%`, maxWidth: '60px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${barColor} ${isSwapping ? 'scale-110' : ''}`}
                      style={{ height: `${(value / maxValue) * 220}px`, minHeight: '20px' }}
                    />
                    <div className="mt-2 text-xs font-mono text-cyber-muted">{value}</div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-cyber-neon-cyan to-cyber-neon-cyan/60" />
                <span className="text-cyber-muted">未排序</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-yellow-400 to-yellow-400/60" />
                <span className="text-cyber-muted">比较中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-red-400 to-red-400/60" />
                <span className="text-cyber-muted">交换中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-green-400 to-green-400/60" />
                <span className="text-cyber-muted">已排序</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={initArray}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-cyber-text transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                生成随机数
              </button>
              <button
                onClick={stepBackward}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-cyber-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Rewind className="w-4 h-4" />
                上一步
              </button>
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-6 py-2 rounded-lg btn-primary"
              >
                {isPlaying ? (
                  <><Pause className="w-4 h-4" /> 暂停</>
                ) : (
                  <><Play className="w-4 h-4" /> {currentStep >= steps.length - 1 ? '重新播放' : '播放'}</>
                )}
              </button>
              <button
                onClick={stepForward}
                disabled={currentStep >= steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-cyber-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FastForward className="w-4 h-4" />
                下一步
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-cyber-text transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 items-center">
              <span className="text-cyber-muted text-sm">速度：</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={1100 - speed}
                onChange={(e) => setSpeed(1100 - Number(e.target.value))}
                className="w-48 accent-cyber-neon-cyan"
              />
              <span className="text-cyber-muted text-sm font-mono w-16">{speed}ms</span>
            </div>

            <div className="text-center mt-6 text-cyber-muted text-sm">
              步骤：{currentStep + 1} / {steps.length}
            </div>
          </div>

          {reachedLimit && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm rounded-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">今日免费次数已用完</h3>
                <p className="text-cyber-muted mb-6">请登录后继续使用冒泡排序演示</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowLoginModal(true)
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    前往登录
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-bold text-cyber-neon-cyan mb-4">算法说明</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-cyber-muted">
            <div>
              <p className="font-bold text-cyber-text mb-2">时间复杂度</p>
              <p>最好：O(n)</p>
              <p>平均：O(n²)</p>
              <p>最坏：O(n²)</p>
            </div>
            <div>
              <p className="font-bold text-cyber-text mb-2">空间复杂度</p>
              <p>O(1) - 原地排序</p>
            </div>
            <div>
              <p className="font-bold text-cyber-text mb-2">特点</p>
              <p>稳定排序</p>
              <p>实现简单</p>
              <p>适用于小规模数据</p>
            </div>
          </div>
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
