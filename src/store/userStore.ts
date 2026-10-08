import { create } from 'zustand'

interface User {
  studentId: string
  password: string
  createdAt: string
}

interface UserState {
  users: User[]
  currentUser: User | null
  serverAvailable: boolean
  register: (studentId: string, password: string) => Promise<{ success: boolean; message: string }>
  login: (studentId: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  exportUsers: () => Promise<{ success: boolean; message: string }>
  importUsers: (jsonData: string) => Promise<{ success: boolean; message: string }>
  isAdmin: () => boolean
  initUsers: () => Promise<void>
}

const LOCAL_KEY = 'iot_users_local'
const CURRENT_USER_KEY = 'iot_current_user'
const ADMIN_STUDENT_ID = '202522051052'
const ADMIN_PASSWORD = 'SCPU2025'
const API_BASE = '/api/users'

// ===== 本地存储 fallback =====
const loadLocalUsers = (): User[] => {
  try {
    const data = localStorage.getItem(LOCAL_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}
const saveLocalUsers = (users: User[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(users))
}
const loadCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

// 硬编码管理员（永远可用）
const adminUser: User = {
  studentId: ADMIN_STUDENT_ID,
  password: ADMIN_PASSWORD,
  createdAt: '2026-08-19T00:00:00.000Z'
}

// ===== API 调用 =====
async function apiPost(action: string, body: any) {
  try {
    const res = await fetch(`${API_BASE}?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return await res.json()
  } catch {
    return null
  }
}

async function apiGet(action: string, params: Record<string, string>) {
  try {
    const qs = new URLSearchParams(params)
    const res = await fetch(`${API_BASE}?action=${action}&${qs}`)
    return await res.json()
  } catch {
    return null
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: loadCurrentUser(),
  serverAvailable: false,

  initUsers: async () => {
    // 先尝试从服务器获取用户列表
    const res = await apiGet('check', {
      studentId: ADMIN_STUDENT_ID,
      password: ADMIN_PASSWORD
    })
    if (res && res.success && Array.isArray(res.users)) {
      set({ users: res.users, serverAvailable: true })
      // 同步到本地
      saveLocalUsers(res.users)
      return
    }
    // 服务器不可用，用本地 fallback
    const local = loadLocalUsers()
    const existingIds = new Set(local.map(u => u.studentId))
    if (!existingIds.has(ADMIN_STUDENT_ID)) local.unshift(adminUser)
    set({ users: local, serverAvailable: false })
    saveLocalUsers(local)
  },

  register: async (studentId, password) => {
    if (!studentId.trim() || !password.trim()) {
      return { success: false, message: '请填写完整信息' }
    }
    if (password.length < 6) {
      return { success: false, message: '密码至少6位' }
    }

    const state = get()
    const newUser: User = {
      studentId: studentId.trim(),
      password,
      createdAt: new Date().toISOString()
    }

    // 先尝试服务器
    if (state.serverAvailable) {
      const res = await apiPost('register', newUser)
      if (res && res.success) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
        set({ currentUser: newUser })
        // 刷新用户列表
        await get().initUsers()
        return { success: true, message: '注册成功' }
      }
      if (res) return { success: false, message: res.message }
    }

    // 本地 fallback
    const users = state.users
    if (users.find(u => u.studentId === newUser.studentId)) {
      return { success: false, message: '该学号已注册' }
    }
    const updated = [...users, newUser]
    saveLocalUsers(updated)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
    set({ users: updated, currentUser: newUser })
    return { success: true, message: '注册成功' }
  },

  login: async (studentId, password) => {
    if (!studentId.trim() || !password.trim()) {
      return { success: false, message: '请填写完整信息' }
    }

    const sid = studentId.trim()

    // 管理员硬编码验证（永远可用）
    if (sid === ADMIN_STUDENT_ID && password === ADMIN_PASSWORD) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser))
      set({ currentUser: adminUser })
      return { success: true, message: '登录成功' }
    }

    const state = get()

    // 先尝试服务器
    if (state.serverAvailable) {
      const res = await apiGet('login', { studentId: sid, password })
      if (res && res.success && res.user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user))
        set({ currentUser: res.user })
        return { success: true, message: '登录成功' }
      }
      if (res) return { success: false, message: res.message }
    }

    // 本地 fallback
    const user = state.users.find(u => u.studentId === sid && u.password === password)
    if (!user) {
      return { success: false, message: '学号或密码错误' }
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    set({ currentUser: user })
    return { success: true, message: '登录成功' }
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    set({ currentUser: null })
  },

  isAdmin: () => {
    const currentUser = get().currentUser
    return currentUser?.studentId === ADMIN_STUDENT_ID && currentUser?.password === ADMIN_PASSWORD
  },

  exportUsers: async () => {
    const { currentUser, users } = get()
    if (!currentUser || currentUser.studentId !== ADMIN_STUDENT_ID || currentUser.password !== ADMIN_PASSWORD) {
      return { success: false, message: '权限不足，仅管理员账号可导出数据' }
    }
    if (users.length === 0) {
      return { success: false, message: '暂无用户数据可导出' }
    }
    const data = JSON.stringify(users, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return { success: true, message: `已导出 ${users.length} 条用户数据` }
  },

  importUsers: async (jsonData) => {
    try {
      const imported = JSON.parse(jsonData)
      if (!Array.isArray(imported)) {
        return { success: false, message: '数据格式错误' }
      }
      const validUsers = imported.filter(
        (u) => u && typeof u.studentId === 'string' && typeof u.password === 'string'
      )
      if (validUsers.length === 0) {
        return { success: false, message: '未找到有效的用户数据' }
      }

      const state = get()

      // 服务器可用则上传到服务器
      if (state.serverAvailable && state.currentUser && get().isAdmin()) {
        const res = await apiPost('import', {
          studentId: state.currentUser.studentId,
          password: state.currentUser.password,
          users: validUsers
        })
        if (res && res.success) {
          await get().initUsers()
          return { success: true, message: res.message }
        }
      }

      // 本地 fallback
      const users = state.users
      const existingIds = new Set(users.map(u => u.studentId))
      const merged = [...users]
      let added = 0
      for (const user of validUsers) {
        if (!existingIds.has(user.studentId)) {
          merged.push({
            studentId: user.studentId,
            password: user.password,
            createdAt: user.createdAt || new Date().toISOString()
          })
          added++
        }
      }
      saveLocalUsers(merged)
      set({ users: merged })
      return { success: true, message: `导入成功：新增 ${added} 个账号` }
    } catch {
      return { success: false, message: '数据解析失败' }
    }
  },
}))
