import type { Context } from "@netlify/edge-functions"

const ADMIN_ID = "202522051052"
const ADMIN_PWD = "SCPU2025"

interface User {
  studentId: string
  password: string
  createdAt: string
}

// ===== GitHub API 工具函数 =====
interface GitHubConfig {
  token: string
  repo: string // 格式: owner/repo
  file: string // 文件路径，如 data/users.json
}

function getConfig(context: Context): GitHubConfig | null {
  // 从环境变量读取
  const token = context.env.GITHUB_TOKEN as string | undefined
  const repo = context.env.GITHUB_REPO as string | undefined
  const file = (context.env.GITHUB_FILE as string | undefined) || "data/users.json"
  
  if (!token || !repo) return null
  return { token, repo, file }
}

// Edge 环境安全的 base64 编解码
function base64Decode(b64: string): string {
  const clean = b64.replace(/\n/g, "")
  const binary = atob(clean)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function githubGet(cfg: GitHubConfig): Promise<{ content: string; sha: string } | null> {
  const url = `https://api.github.com/repos/${cfg.repo}/contents/${cfg.file}`
  const res = await fetch(url, {
    headers: {
      "Authorization": `token ${cfg.token}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "SCPUIOT-EdgeFunction"
    }
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const data = await res.json()
  const content = base64Decode(data.content)
  return { content, sha: data.sha }
}

async function githubPut(cfg: GitHubConfig, content: string, sha?: string): Promise<void> {
  const url = `https://api.github.com/repos/${cfg.repo}/contents/${cfg.file}`
  const body: any = {
    message: "update users",
    content: base64Encode(content)
  }
  if (sha) body.sha = sha
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${cfg.token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "SCPUIOT-EdgeFunction"
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub API ${res.status}: ${errText}`)
  }
}

// ===== 用户数据操作 =====
const INITIAL_USERS: User[] = [{
  studentId: ADMIN_ID,
  password: ADMIN_PWD,
  createdAt: "2026-08-19T00:00:00.000Z"
}]

async function getAllUsers(cfg: GitHubConfig): Promise<User[]> {
  const result = await githubGet(cfg)
  if (!result) {
    // 文件不存在，创建并写入初始数据
    await githubPut(cfg, JSON.stringify(INITIAL_USERS, null, 2))
    return INITIAL_USERS
  }
  try {
    const parsed = JSON.parse(result.content)
    if (Array.isArray(parsed)) return parsed
    return INITIAL_USERS
  } catch {
    return INITIAL_USERS
  }
}

async function saveAllUsers(cfg: GitHubConfig, users: User[]): Promise<void> {
  // 先获取当前 sha
  const result = await githubGet(cfg)
  await githubPut(cfg, JSON.stringify(users, null, 2), result?.sha)
}

// ===== 硬编码管理员检查 =====
const isAdminLogin = (sid: string, pwd: string) =>
  sid === ADMIN_ID && pwd === ADMIN_PWD

// ===== 主处理函数 =====
export default async function handler(req: Request, context: Context) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get("action") || "login"
    const cfg = getConfig(context)

    // 如果 GitHub 未配置，返回友好提示
    if (!cfg) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "服务器未配置。请在 Netlify 设置环境变量 GITHUB_TOKEN 和 GITHUB_REPO" 
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      })
    }

    if (req.method === "POST") {
      const body = await req.json()
      const { studentId, password } = body

      if (action === "register") {
        const users = await getAllUsers(cfg)
        if (users.find(u => u.studentId === studentId)) {
          return new Response(JSON.stringify({ success: false, message: "该学号已注册" }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }
        if (password.length < 6) {
          return new Response(JSON.stringify({ success: false, message: "密码至少6位" }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }
        const newUser: User = {
          studentId,
          password,
          createdAt: new Date().toISOString()
        }
        users.push(newUser)
        await saveAllUsers(cfg, users)
        return new Response(JSON.stringify({ success: true, message: "注册成功", user: newUser }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }

      if (action === "login") {
        const users = await getAllUsers(cfg)
        const user = users.find(u => u.studentId === studentId && u.password === password)
        if (!user && !isAdminLogin(studentId, password)) {
          return new Response(JSON.stringify({ success: false, message: "学号或密码错误" }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }
        const resultUser = user || {
          studentId: ADMIN_ID,
          password: ADMIN_PWD,
          createdAt: "2026-08-19T00:00:00.000Z"
        }
        return new Response(JSON.stringify({ success: true, message: "登录成功", user: resultUser }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }

      if (action === "import" && isAdminLogin(studentId, password)) {
        const { users: importedUsers } = body
        if (!Array.isArray(importedUsers)) {
          return new Response(JSON.stringify({ success: false, message: "数据格式错误" }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }
        const users = await getAllUsers(cfg)
        const existingIds = new Set(users.map(u => u.studentId))
        let added = 0
        for (const u of importedUsers) {
          if (u.studentId && u.password && !existingIds.has(u.studentId)) {
            users.push({
              studentId: u.studentId,
              password: u.password,
              createdAt: u.createdAt || new Date().toISOString()
            })
            added++
          }
        }
        await saveAllUsers(cfg, users)
        return new Response(JSON.stringify({ success: true, message: `导入成功：新增 ${added} 个账号`, total: users.length }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }
    }

    if (req.method === "GET") {
      if (action === "check" && isAdminLogin(
        url.searchParams.get("studentId") || "",
        url.searchParams.get("password") || ""
      )) {
        const users = await getAllUsers(cfg)
        return new Response(JSON.stringify({ success: true, users }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }

      if (action === "login") {
        const studentId = url.searchParams.get("studentId") || ""
        const password = url.searchParams.get("password") || ""
        
        if (isAdminLogin(studentId, password)) {
          return new Response(JSON.stringify({
            success: true,
            message: "登录成功",
            user: { studentId: ADMIN_ID, password: ADMIN_PWD, createdAt: "2026-08-19T00:00:00.000Z" }
          }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }

        const users = await getAllUsers(cfg)
        const user = users.find(u => u.studentId === studentId && u.password === password)
        if (!user) {
          return new Response(JSON.stringify({ success: false, message: "学号或密码错误" }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          })
        }
        return new Response(JSON.stringify({ success: true, message: "登录成功", user }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, message: "服务器错误: " + e.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 500
    })
  }

  return new Response(JSON.stringify({ success: false, message: "无效请求" }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  })
}
