import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, getAdminProducts, updateProduct, createProduct } from '../api/products'
import type { UpdateProductPayload, CreateProductPayload } from '../api/products'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60_000, // 5 min — matches backend catalog cache TTL
  })
}

/** Products screen: every product incl. inactive, with editable flags. Shares the ['products']
 *  prefix so the mutations below refresh it along with the pickers' list. */
export function useAdminProducts() {
  return useQuery({
    queryKey: ['products', 'admin'],
    queryFn: getAdminProducts,
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => updateProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
