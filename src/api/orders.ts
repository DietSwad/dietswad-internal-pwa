import { apiClient } from './client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderItem {
  product: string
  quantity: number
  unit_price?: number
}

export interface FlatOrder {
  pageId: string
  orderId: string
  customerName: string
  phone: string
  email: string
  amount: number
  status: string
  payment: string
  type: string
  orderDate: string
  deliveryDate: string
  address: string
  pincode: string
  notes: string
  items: string[]
  quantity: number
  paymentMethod: string
  paymentReference: string
  distributorName: string
  invoiceNumber: string
}

export interface OrderFilters {
  status?: string
  payment?: string
  type?: string
  date_from?: string
  date_to?: string
  search?: string
  limit?: number
}

// ── Notion page mapper ────────────────────────────────────────────────────────

function rt(props: Record<string, unknown>, key: string): string {
  const arr = (props[key] as { rich_text?: Array<{ plain_text: string }> })?.rich_text ?? []
  return arr[0]?.plain_text ?? ''
}

export function flattenOrder(page: Record<string, unknown>): FlatOrder {
  const props = (page.properties ?? {}) as Record<string, unknown>
  const titleArr = (props['Customer Name'] as { title?: Array<{ plain_text: string }> })?.title ?? []
  return {
    pageId: page.id as string,
    orderId: (props['Order ID'] as { formula?: { string?: string } })?.formula?.string ?? '',
    customerName: titleArr[0]?.plain_text ?? '',
    phone: ((props['Phone'] as { phone_number?: string })?.phone_number ?? '').replace('+91', ''),
    email: (props['Email Address'] as { email?: string })?.email ?? '',
    amount: (props['Total Amount'] as { number?: number })?.number ?? 0,
    status: (props['Status'] as { status?: { name: string } })?.status?.name ?? '',
    payment: (props['Payment Status'] as { status?: { name: string } })?.status?.name ?? '',
    type: (props['Order Type'] as { select?: { name: string } })?.select?.name ?? '',
    orderDate: (props['Order Date'] as { date?: { start: string } })?.date?.start ?? '',
    deliveryDate: (props['Delivery Date'] as { date?: { start: string } })?.date?.start ?? '',
    address: rt(props, 'Delivery Address'),
    pincode: rt(props, 'Pin Code'),
    notes: rt(props, 'Notes'),
    items: ((props['Order Items'] as { multi_select?: Array<{ name: string }> })?.multi_select ?? []).map(
      (x) => x.name
    ),
    quantity: (props['Quantity'] as { number?: number })?.number ?? 1,
    paymentMethod: (props['Payment Method'] as { select?: { name: string } })?.select?.name ?? '',
    paymentReference: rt(props, 'Payment Reference'),
    distributorName: rt(props, 'Distributor Name'),
    invoiceNumber: rt(props, 'Invoice Number'),
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function getOrders(filters: OrderFilters = {}): Promise<FlatOrder[]> {
  const params = new URLSearchParams()
  if (filters.status)    params.set('status',    filters.status)
  if (filters.payment)   params.set('payment',   filters.payment)
  if (filters.type)      params.set('type',      filters.type)
  if (filters.date_from) params.set('date_from', filters.date_from)
  if (filters.date_to)   params.set('date_to',   filters.date_to)
  if (filters.limit)     params.set('limit',     String(filters.limit))

  const { data } = await apiClient.get<{ results: Record<string, unknown>[]; count: number }>(
    `/orders?${params}`
  )
  return data.results.map(flattenOrder)
}

export interface UpdateOrderPayload {
  page_id: string
  updates: Record<string, string | number>
}

export async function updateOrder(payload: UpdateOrderPayload): Promise<void> {
  await apiClient.patch('/update-order', payload)
}

export interface CreateManualOrderPayload {
  customer_name: string
  phone: string
  email?: string
  address: string
  pincode: string
  items: OrderItem[]
  payment_method: string
  payment_status: string
  notes?: string
  distributor_name?: string
  order_type: 'Manual' | 'Distributor'
  total_amount?: number
}

export async function createManualOrder(
  payload: CreateManualOrderPayload
): Promise<{ order_id: string }> {
  const { data } = await apiClient.post<{ success: boolean; order_id: string }>(
    '/create-manual-order',
    payload
  )
  return { order_id: data.order_id }
}

export async function sendInvoice(pageId: string): Promise<string> {
  const { data } = await apiClient.post<{ success: boolean; invoice_number: string }>(
    '/send-invoice',
    { page_id: pageId }
  )
  return data.invoice_number
}
