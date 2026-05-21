import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  role: string
  iat: number
  exp: number
}

export const JWT_KEY = 'ds_jwt'

export function getStoredToken(): string | null {
  return localStorage.getItem(JWT_KEY)
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  try {
    const payload = jwtDecode<JwtPayload>(token)
    return payload.exp * 1000 > Date.now() + 30_000
  } catch {
    return false
  }
}

export function storeToken(token: string): void {
  localStorage.setItem(JWT_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(JWT_KEY)
}
