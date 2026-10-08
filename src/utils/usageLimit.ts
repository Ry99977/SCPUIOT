const CLIENT_ID_KEY = 'iot_client_id'
const USAGE_PREFIX = 'iot_usage_'
const DAILY_LIMIT = 64

function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = 'client_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function getTodayKey(feature: string): string {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  return `${USAGE_PREFIX}${feature}_${dateStr}`
}

export function getUsageCount(feature: string): number {
  const key = getTodayKey(feature)
  const data = localStorage.getItem(key)
  if (!data) return 0
  try {
    const parsed = JSON.parse(data)
    const clientId = getClientId()
    return parsed[clientId] || 0
  } catch {
    return 0
  }
}

export function incrementUsage(feature: string): { remaining: number; reachedLimit: boolean } {
  const key = getTodayKey(feature)
  const data = localStorage.getItem(key)
  let parsed: Record<string, number> = {}
  if (data) {
    try {
      parsed = JSON.parse(data)
    } catch {
      parsed = {}
    }
  }
  const clientId = getClientId()
  const current = parsed[clientId] || 0
  const next = current + 1
  parsed[clientId] = next
  localStorage.setItem(key, JSON.stringify(parsed))
  const remaining = Math.max(0, DAILY_LIMIT - next)
  return { remaining, reachedLimit: next >= DAILY_LIMIT }
}

export function getRemainingUses(feature: string): number {
  const used = getUsageCount(feature)
  return Math.max(0, DAILY_LIMIT - used)
}

export function isLimitReached(feature: string): boolean {
  return getUsageCount(feature) >= DAILY_LIMIT
}

export function getDailyLimit(): number {
  return DAILY_LIMIT
}
