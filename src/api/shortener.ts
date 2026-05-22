import { apiClient } from './client'

export interface ShortUrl {
  short_code: string
  short_url: string
  original_url: string
  clicks?: number
  created_at?: string
  last_clicked?: string | null
}

export interface ShortUrlStats {
  short_code: string
  short_url: string
  original_url: string
  clicks: number
  created_at: string
  last_clicked: string | null
  days_active: number
  avg_daily_clicks: number
}

export interface ShortenPayload {
  long_url: string
  custom_code?: string
}

export async function shortenUrl(payload: ShortenPayload): Promise<ShortUrl> {
  const { data } = await apiClient.post<ShortUrl>('/shortener/shorten', payload)
  return data
}

export async function listShortUrls(): Promise<ShortUrl[]> {
  const { data } = await apiClient.get<ShortUrl[]>('/shortener/urls')
  return Array.isArray(data) ? data : []
}

export async function getShortUrl(code: string): Promise<ShortUrl> {
  const { data } = await apiClient.get<ShortUrl>(`/shortener/urls/${code}`)
  return data
}

export async function getShortUrlStats(code: string): Promise<ShortUrlStats> {
  const { data } = await apiClient.get<ShortUrlStats>(`/shortener/stats/${code}`)
  return data
}

export async function deleteShortUrl(code: string): Promise<void> {
  await apiClient.delete(`/shortener/delete/${code}`)
}
