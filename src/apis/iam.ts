export interface RegisterVariables {
  username: string
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  message?: string
}

export interface RegisterResponse {
  status: number
  message: string
  responseCode: string
  errors: unknown
  data: RegisterData | null
}

interface LoginVariables {
  username: string
  password: string
}

interface ApiResponse {
  status: number
  message: string
  responseCode: string
  errors: unknown
}

export interface DecodedJwt {
  roles?: string[]
  sub?: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '==='.slice((base64.length + 3) % 4)

  if (typeof globalThis.atob === 'function') {
    const bin = globalThis.atob(padded)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  // Node/SSR fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B: any = (globalThis as any).Buffer
  if (B?.from) {
    return B.from(padded, 'base64').toString('utf8')
  }

  throw new Error('No base64 decoder available in this environment')
}

function decodeJwt(token: string): DecodedJwt {
  const [, payload] = token.split('.')
  if (!payload) throw new Error('Invalid token format')
  const json = base64UrlDecode(payload)
  return JSON.parse(json)
}

function hasValidRoleAndExpiry(token: string): boolean {
  const decoded = decodeJwt(token)
  const nowSec = Math.floor(Date.now() / 1000)
  if (typeof decoded.exp !== 'number') return false
  if (decoded.exp <= nowSec) return false
  const roles = Array.isArray(decoded.roles) ? decoded.roles : []
  return roles.includes('ROLE_USER')
}

export async function performLogin({
  username,
  password,
}: LoginVariables): Promise<{ data: ApiResponse | null; token: string; decoded: DecodedJwt }> {
  const resp = await fetch('/api/iam/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  })

  if (!resp.ok) {
    let msg = `Login failed (${resp.status})`
    try {
      const json = await resp.json()
      if (json?.errors?.[0]?.message) {
        msg = json.errors[0].message
      } else if (json?.message) {
        msg = json.message
      }
    } catch {
      // fallback: try to get text if not JSON
      const text = await resp.text().catch(() => '')
      if (text) msg = text
    }
    throw new Error(msg)
  }

  const data = (await resp
    .clone()
    .json()
    .catch(() => null)) as ApiResponse | null
  const authHeader = resp.headers.get('Authorization') || resp.headers.get('authorization')
  if (!authHeader) throw new Error('Missing Authorization header')
  const parts = authHeader.split(' ')
  const token = parts.length === 2 ? parts[1] : authHeader

  if (!hasValidRoleAndExpiry(token)) {
    throw new Error('Token invalid: requires ROLE_USER and not expired')
  }

  return { data, token, decoded: decodeJwt(token) as DecodedJwt }
}

export async function performRegister({
  username,
  email,
  password,
}: RegisterVariables): Promise<RegisterResponse> {
  const resp = await fetch('/api/iam/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  })

  if (!resp.ok) {
    let msg = `Register failed (${resp.status})`
    try {
      const json = await resp.json()
      if (json?.errors?.[0]?.message) {
        msg = json.errors[0].message
      } else if (json?.message) {
        msg = json.message
      }
    } catch {
      // fallback: try to get text if not JSON
      const text = await resp.text().catch(() => '')
      if (text) msg = text
    }
    throw new Error(msg)
  }

  const json = (await resp
    .clone()
    .json()
    .catch(() => null)) as RegisterResponse | null
  if (!json?.data) {
    throw new Error(json?.message || 'Registration failed: empty response body')
  }

  return json
}
