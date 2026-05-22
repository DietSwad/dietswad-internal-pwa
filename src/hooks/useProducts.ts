import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60_000, // 5 min — matches backend catalog cache TTL
  })
}
