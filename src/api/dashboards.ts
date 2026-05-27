import { apiClient } from './client'

export type DashboardType = 'orders' | 'ga4' | 'meta' | 'amplitude' | 'unified'

// --- Shape types (derived from PHASE4_ANALYTICS_REFERENCE.md lines 786–846) ---

export interface OrdersData {
  generated_at: string
  schema_version: number
  headline: {
    orders_today: number
    orders_week: number
    orders_month: number
    revenue_today: number
    revenue_week: number
    revenue_month: number
    aov_month: number
    new_customers_month: number
    repeat_customers_month: number
  }
  product_mix: Record<string, number>
  order_type_breakdown: Record<string, number>
  status_pipeline: Record<string, number>
  payment_breakdown: Record<string, number>
  daily_revenue_30d: Record<string, number>
  recent_orders: Array<{
    order_id: string
    customer_name: string
    total_amount: number
    order_date: string
    status: string
    payment_status: string
  }>
  // COD + RTO segmentation (added Phase 1 Feature Addition 2026-05-28)
  payment_split?: {
    cod:        { count: number; revenue: number }
    partial_cod: { count: number; revenue: number; online_collected: number; cod_collected: number }
    prepaid:    { count: number; revenue: number }
  }
  rto?: {
    cod_rto_count: number
    cod_shipped_count: number
    cod_rto_rate: number
    prepaid_rto_count: number
    prepaid_shipped_count: number
    prepaid_rto_rate: number
    by_reason: Record<string, number>
    by_pincode: Array<{ pincode: string; rto_count: number; rto_loss_total: number }>
  }
  rto_loss?: {
    total_loss: number
    cod_loss: number
    prepaid_loss: number
    avg_loss_per_rto: number
    loss_as_pct_of_revenue: number
  }
}

export interface MetaData {
  generated_at: string
  schema_version: number
  headline: {
    spend_30d: number
    impressions_30d: number
    clicks_30d: number
    ctr_30d: number
  }
  campaigns: Array<{
    id: string
    name: string
    spend: number
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    cpm: number
    purchase_roas: number
  }>
}

export interface GA4Data {
  generated_at: string
  schema_version: number
  traffic_by_channel: Array<Record<string, number | string>>
  top_pages: Array<Record<string, number | string>>
  device_split: Array<Record<string, number | string>>
  events: Array<Record<string, number | string>>
}

export interface UnifiedData {
  generated_at: string
  schema_version: number
  headline: {
    blended_roas: number
    revenue_30d: number
    spend_30d: number
    sessions_30d: number
    orders_30d: number
    conversion_rate: number
    cac: number
    new_customers_30d: number
  }
  funnel: {
    spend: number
    impressions: number
    clicks: number
    sessions: number
    orders_paid: number
    revenue: number
  }
  campaign_attribution: Array<{
    campaign: string
    orders: number
    revenue: number
  }>
}

// --- API functions ---

export async function getDashboard<T = unknown>(type: DashboardType): Promise<T> {
  const res = await apiClient.get<T>('/dashboard', { params: { type } })
  return res.data
}

export async function triggerRefresh(eventType: 'orders-refresh' | 'full-refresh' = 'full-refresh') {
  const res = await apiClient.post('/github-dispatch', { event_type: eventType })
  return res.data
}
