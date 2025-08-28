const AUTH_KEY = 'auth'
const TOKEN_KEY = 'token'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined' || !('localStorage' in window)) return false
  try {
    return window.localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

export function login(): void {
  if (typeof window === 'undefined' || !('localStorage' in window)) return
  try {
    window.localStorage.setItem(AUTH_KEY, 'true')
  } catch {
    // no-op: storage might be blocked or full
  }
}

export function logout(): void {
  if (typeof window === 'undefined' || !('localStorage' in window)) return
  try {
    window.localStorage.removeItem(AUTH_KEY)
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // no-op
  }
}
