import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  shortenUrl,
  listShortUrls,
  getShortUrlStats,
  deleteShortUrl,
  type ShortenPayload,
  type ShortUrl,
} from '../api/shortener'

export function useShortUrlsList() {
  return useQuery({
    queryKey: ['shortener', 'list'],
    queryFn: listShortUrls,
  })
}

export function useShortUrlStats(code: string) {
  return useQuery({
    queryKey: ['shortener', 'stats', code],
    queryFn: () => getShortUrlStats(code),
    enabled: !!code,
  })
}

export function useShortenUrl() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShortenPayload) => shortenUrl(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shortener', 'list'] })
    },
  })
}

export function useDeleteShortUrl() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => deleteShortUrl(code),
    onMutate: async (code) => {
      await qc.cancelQueries({ queryKey: ['shortener', 'list'] })
      const prev = qc.getQueryData<ShortUrl[]>(['shortener', 'list'])
      qc.setQueryData<ShortUrl[]>(
        ['shortener', 'list'],
        (old) => old?.filter((u) => u.short_code !== code) ?? []
      )
      return { prev }
    },
    onError: (_err, _code, ctx) => {
      if (ctx?.prev) qc.setQueryData(['shortener', 'list'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['shortener', 'list'] })
    },
  })
}
