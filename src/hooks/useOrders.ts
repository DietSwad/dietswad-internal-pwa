import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrder,
  updateOrder,
  createManualOrder,
  sendInvoice,
  downloadInvoice,
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

/** Single order. Key sits under ['orders'] so every existing invalidateQueries(['orders'])
 *  after an edit / delivery / RTO also refreshes the detail screen. Seeded from any list
 *  already in cache so recent orders still open instantly. */
export function useOrder(pageId: string | undefined) {
  const qc = useQueryClient()
  return useQuery({
    queryKey: ['orders', 'detail', pageId],
    queryFn: () => getOrder(pageId as string),
    enabled: !!pageId,
    initialData: () => {
      for (const [, list] of qc.getQueriesData<FlatOrder[]>({ queryKey: ['orders'] })) {
        const hit = Array.isArray(list) ? list.find((o) => o.pageId === pageId) : undefined
        if (hit) return hit
      }
      return undefined
    },
  })
}

export function useUpdateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateOrder,
    onMutate: async (payload: UpdateOrderPayload) => {
      await qc.cancelQueries({ queryKey: ['orders'] })
      const snapshots = qc.getQueriesData<FlatOrder[] | FlatOrder>({ queryKey: ['orders'] })

      const applyUpdates = (o: FlatOrder): FlatOrder => {
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
      }

      // ['orders'] holds both lists (FlatOrder[]) and single-order detail entries (FlatOrder),
      // so patch either shape. The list-only version called .map() on the detail object and threw.
      qc.setQueriesData<FlatOrder[] | FlatOrder>({ queryKey: ['orders'] }, (old) => {
        if (!old) return old
        if (!Array.isArray(old)) return old.pageId === payload.page_id ? applyUpdates(old) : old
        return old.map((o) => (o.pageId === payload.page_id ? applyUpdates(o) : o))
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

export function useDownloadInvoice() {
  return useMutation({ mutationFn: downloadInvoice })
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
