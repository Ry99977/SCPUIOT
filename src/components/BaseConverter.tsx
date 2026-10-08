import { useState, useEffect } from 'react'
import { Copy, Check, ArrowRight, RotateCcw, Lock, LogIn } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { incrementUsage, getRemainingUses, isLimitReached, getDailyLimit } from '@/utils/usageLimit'

type BaseType = 'binary' | 'octal' | 'decimal' | 'hex'

const baseConfig: Record<BaseType, { label: string; prefix: string; radix: number; chars: RegExp }> = {
  binary: { label: '二进制', prefix: '0b', radix: 2, chars: /^[01]*(\.[01]*)?$/ },
  octal: { label: '八进制', prefix: '0o', radix: 8, chars: /^[0-7]*(\.[0-7]*)?$/ },
  decimal: { label: '十进制', prefix: '', radix: 10, chars: /^[0-9]*(\.[0-9]*)?$/ },
  hex: { label: '十六进制', prefix: '0x', radix: 16, chars: /^[0-9a-fA-F]*(\.[0-9a-fA-F]*)?$/ },
}

const FRACTION_PRECISION = 3
const FEATURE_NAME = 'base_converter'
const hexDigits = '0123456789ABCDEF'

function intPartToDecimal(intStr: string, radix: number): number {
  let result = 0
  for (let i = 0; i < intStr.length; i++) {
    const digit = hexDigits.indexOf(intStr[i].toUpperCase())
    result = result * radix + digit
  }
  return result
}

function fracPartToDecimal(fracStr: string, radix: number): number {
  let result = 0
  let divisor = radix
  for (let i = 0; i < fracStr.length; i++) {
    const digit = hexDigits.indexOf(fracStr[i].toUpperCase())
    result += digit / divisor
    divisor *= radix
  }
  return result
}

function intDecimalToBase(num: number, radix: number): string {
  if (num === 0) return '0'
  let result = ''
  while (num > 0) {
    result = hexDigits[num % radix] + result
    num = Math.floor(num / radix)
  }
  return result
}

function fracDecimalToBase(frac: number, radix: number): string {
  if (frac === 0) return ''
  let result = ''
  let value = frac
  for (let i = 0; i < FRACTION_PRECISION; i++) {
    value *= radix
    const digit = Math.floor(value)
    result += hexDigits[digit]
    value -= digit
    if (value === 0) break
  }
  return result
}

function formatDecimal(intStr: string, fracStr: string): string {
  if (!fracStr) return intStr
  return `${intStr}.${fracStr}`
}

export function BaseConverter() {
  const { currentUser } = useUserStore()
  const [values, setValues] = useState<Record<BaseType, string>>({
    binary: '',
    octal: '',
    decimal: '',
    hex: '',
  })
  const [error, setError] = useState<string>('')
  const [copiedField, setCopiedField] = useState<BaseType | null>(null)
  const [remainingUses, setRemainingUses] = useState(getDailyLimit())
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setRemainingUses(getRemainingUses(FEATURE_NAME))
    }
  }, [currentUser])

  const reachedLimit = !currentUser && isLimitReached(FEATURE_NAME)

  const handleInputChange = (base: BaseType, inputValue: string) => {
    if (reachedLimit) {
      setShowLoginModal(true)
      return
    }

    const value = inputValue.trim()

    if (value === '') {
      setValues({ binary: '', octal: '', decimal: '', hex: '' })
      setError('')
      return
    }

    const config = baseConfig[base]

    if (value.endsWith('..')) {
      setError('请输入有效的数字格式')
      return
    }

    if (!config.chars.test(value)) {
      setError(`请输入有效的${config.label}数字`)
      return
    }

    const [inputIntPart, inputFracPart = ''] = value.split('.')

    if (inputFracPart.length > FRACTION_PRECISION) {
      setError(`小数最多支持 ${FRACTION_PRECISION} 位`)
      return
    }

    if (value.endsWith('.')) {
      setValues((prev) => ({ ...prev, [base]: value }))
      setError('')
      return
    }

    setError('')

    const intDecimal = intPartToDecimal(inputIntPart || '0', config.radix)
    const fracDecimal = fracPartToDecimal(inputFracPart, config.radix)
    const totalDecimal = intDecimal + fracDecimal

    if (isNaN(totalDecimal)) {
      setError('无效的输入')
      return
    }

    const intResult = Math.floor(totalDecimal)
    const fracResult = totalDecimal - intResult

    const newValues: Record<BaseType, string> = {
      binary: formatDecimal(
        intDecimalToBase(intResult, 2),
        fracDecimalToBase(fracResult, 2)
      ),
      octal: formatDecimal(
        intDecimalToBase(intResult, 8),
        fracDecimalToBase(fracResult, 8)
      ),
      decimal: formatDecimal(
        intDecimalToBase(intResult, 10),
        fracDecimalToBase(fracResult, 10)
      ),
      hex: formatDecimal(
        intDecimalToBase(intResult, 16),
        fracDecimalToBase(fracResult, 16)
      ),
    }

    if (base === 'decimal') {
      newValues.decimal = formatDecimal(inputIntPart || '0', inputFracPart)
    }

    setValues(newValues)

    if (!currentUser) {
      const result = incrementUsage(FEATURE_NAME)
      setRemainingUses(result.remaining)
    }
  }

  const handleCopy = async (base: BaseType) => {
    if (values[base]) {
      await navigator.clipboard.writeText(values[base])
      setCopiedField(base)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleReset = () => {
    setValues({ binary: '', octal: '', decimal: '', hex: '' })
    setError('')
  }

  const baseOrder: BaseType[] = ['decimal', 'binary', 'octal', 'hex']

  return (
    <section id="converter" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyber-neon-cyan/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyber-neon-purple/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="section-title">
            <span className="gradient-text">进制转换计算器</span>
          </h2>
          <p className="section-subtitle">二进制、八进制、十进制、十六进制相互转换（支持 {FRACTION_PRECISION} 位小数）</p>
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

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className={reachedLimit ? 'opacity-30 pointer-events-none' : ''}>
            <div className="space-y-6">
              {baseOrder.map((base, index) => {
                const config = baseConfig[base]
                return (
                  <div key={base}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-cyber-neon-cyan font-mono text-sm font-medium">
                        {config.label}
                      </span>
                      {config.prefix && (
                        <span className="text-xs px-2 py-0.5 rounded bg-cyber-neon-cyan/10 text-cyber-neon-cyan font-mono">
                          {config.prefix}
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        value={values[base]}
                        onChange={(e) => handleInputChange(base, e.target.value)}
                        placeholder={`请输入${config.label}数字...`}
                        className="w-full px-4 py-4 pr-24 rounded-lg bg-white/5 border border-white/10 font-mono text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon-cyan/50 focus:border-cyber-neon-cyan/50"
                      />
                      <button
                        onClick={() => handleCopy(base)}
                        disabled={!values[base]}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="复制"
                      >
                        {copiedField === base ? (
                          <Check className="w-5 h-5 text-cyber-neon-green" />
                        ) : (
                          <Copy className="w-5 h-5 text-cyber-muted" />
                        )}
                      </button>
                    </div>
                    {index < baseOrder.length - 1 && (
                      <div className="flex justify-center my-2">
                        <ArrowRight className="w-5 h-5 text-cyber-muted rotate-90" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-3 flex-wrap">
                {['255', '1024', '3.142', '0.625'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleInputChange('decimal', num)}
                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-sm font-mono text-cyber-muted hover:text-cyber-text transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-cyber-text transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                清空
              </button>
            </div>
          </div>

          {reachedLimit && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm rounded-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">今日免费次数已用完</h3>
                <p className="text-cyber-muted mb-6">请登录后继续使用进制转换功能</p>
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

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {Object.entries(baseConfig).map(([key, config]) => (
            <div key={key} className="glass-card p-4 text-center">
              <p className="text-cyber-neon-cyan font-mono text-2xl font-bold">{config.radix}</p>
              <p className="text-cyber-muted text-sm mt-1">{config.label}</p>
            </div>
          ))}
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
