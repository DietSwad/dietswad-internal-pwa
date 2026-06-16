import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFees, updateFees } from '../api/products'
import type { Fees } from '../api/products'

export function useFees() {
  return useQuery({
    queryKey: ['fees'],
    queryFn: getFees,
    staleTime: 5 * 60_000, // 5 min — matches backend fees cache TTL
  })
}

export function useUpdateFees() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Fees>) => updateFees(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] })
    },
  })
}
