import axios from 'axios'

const AUTH_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://dietswad-api.azurewebsites.net/api'

export async function apiLogin(password: string): Promise<string> {
  const res = await axios.post<{ token: string; expires_in: number }>(
    `${AUTH_BASE}/login`,
    { password }
  )
  return res.data.token
}
