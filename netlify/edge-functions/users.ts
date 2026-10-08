import type { Context } from "@netlify/edge-functions"

const ADMIN_ID = "202522051052"
const ADMIN_PWD = "SCPU2025"

interface User {
  studentId: string
  password: string
  createdAt: string
}

const ALL_USERS_KEY = "all_users"

async function getAllUsers(kv: KVNamespace): Promise<User[]> {
  const data = await kv.get(ALL_USERS_KEY)
  if (!data) {
    // 初始化：包含管理员
    const initial: User[] = [{
      studentId: ADMIN_ID,
      password: ADMIN_PWD,
      createdAt: "2026-08-19T00:00:00.000Z"
    }]
    await kv.put(ALL_USERS_KEY, JSON.stringify(initial))
    return initial
  }
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveAllUsers(kv: KVNamespace, users: User[]) {
  await kv.put(ALL_USERS_KEY, JSON.stringify(users))
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url)
  const action = url.searchParams.get("action") || "login"
  const kv = context.env.IOT_USERS as KVNamespace

  // 管理员账号（硬编码，保证始终可用）
  const isAdminLogin = (sid: string, pwd: string) =>
    sid === ADMIN_ID && pwd === ADMIN_PWD

  if (req.method === "POST") {
    try {
      const body = await req.json()
      const { studentId, password } = body

      if (action === "register") {
        const users = await getAllUsers(kv)
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
        await saveAllUsers(kv, users)
        return new Response(JSON.stringify({ success: true, message: "注册成功", user: newUser }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }

      if (action === "login") {
        const users = await getAllUsers(kv)
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
        const users = await getAllUsers(kv)
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
        await saveAllUsers(kv, users)
        return new Response(JSON.stringify({ success: true, message: `导入成功：新增 ${added} 个账号`, total: users.length }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, message: "服务器错误: " + e.message }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        status: 500
      })
    }
  }

  if (req.method === "GET") {
    if (action === "check" && isAdminLogin(
      url.searchParams.get("studentId") || "",
      url.searchParams.get("password") || ""
    )) {
      const users = await getAllUsers(kv)
      return new Response(JSON.stringify({ success: true, users }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      })
    }

    if (action === "login") {
      const studentId = url.searchParams.get("studentId") || ""
      const password = url.searchParams.get("password") || ""
      
      // 管理员快速验证
      if (isAdminLogin(studentId, password)) {
        return new Response(JSON.stringify({
          success: true,
          message: "登录成功",
          user: { studentId: ADMIN_ID, password: ADMIN_PWD, createdAt: "2026-08-19T00:00:00.000Z" }
        }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        })
      }

      const users = await getAllUsers(kv)
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

  return new Response(JSON.stringify({ success: false, message: "无效请求" }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  })
}
