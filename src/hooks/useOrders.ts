import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  updateOrder,
  createManualOrder,
  sendInvoice,
  markDelivered,
  markRto,
  type OrderFilters,
  type FlatOrder,
  type UpdateOrderPayload,
  type CreateManualOrderPayload,
  type MarkRtoPayload,
} from '../api/orders'

export function useOrdersList(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
  })
}

export function useUpdateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateOrder,
    onMutate: async (payload: UpdateOrderPayload) => {
      await qc.cancelQueries({ queryKey: ['orders'] })
      const snapshots = qc.getQueriesData<FlatOrder[]>({ queryKey: ['orders'] })

      qc.setQueriesData<FlatOrder[]>({ queryKey: ['orders'] }, (old) => {
        if (!old) return old
        return old.map((o) => {
          if (o.pageId !== payload.page_id) return o
          const u = payload.updates
          return {
            ...o,
            ...('Status' in u          ? { status: String(u['Status']) }                 : {}),
            ...('Payment Status' in u  ? { payment: String(u['Payment Status']) }         : {}),
            ...('Payment Method' in u  ? { paymentMethod: String(u['Payment Method']) }   : {}),
            ...('Notes' in u           ? { notes: String(u['Notes']) }                    : {}),
            ...('Delivery Date' in u   ? { deliveryDate: String(u['Delivery Date']) }     : {}),
            ...('Delivery Address' in u? { address: String(u['Delivery Address']) }       : {}),
            ...('Pin Code' in u        ? { pincode: String(u['Pin Code']) }               : {}),
            ...('Payment Reference' in u? { paymentReference: String(u['Payment Reference']) } : {}),
            ...('Total Amount' in u    ? { amount: Number(u['Total Amount']) }            : {}),
          }
        })
      })
      return { snapshots }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshots) {
        for (const [queryKey, data] of ctx.snapshots) {
          qc.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCreateManualOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateManualOrderPayload) => createManualOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useSendInvoice() {
  return useMutation({ mutationFn: sendInvoice })
}

export function useMarkDelivered() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, paymentReference }: { orderId: string; paymentReference?: string }) =>
      markDelivered(orderId, paymentReference),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useMarkRto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MarkRtoPayload) => markRto(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
