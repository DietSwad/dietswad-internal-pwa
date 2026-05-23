import { ShoppingBag } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import type { OrdersData } from '../../api/dashboards'

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function OrdersDashboard() {
  const { data, isLoading, error } = useDashboard<OrdersData>('orders')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Orders this month', 'Revenue (month)', 'Avg order value', 'New customers'].map((label) => (
            <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
              <p className="text-xs text-ink/40 mb-1">{label}</p>
              <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-ink/10 p-4">
          <div className="h-4 w-24 bg-ink/5 rounded animate-pulse mb-3" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-full bg-ink/5 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <ShoppingBag size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Not yet generated</p>
        <p className="text-xs text-ink/40 text-center">Refresh to pull the latest orders data.</p>
      </div>
    )
  }

  const h = data.headline
  const kpis = [
    { label: 'Orders (month)', value: h.orders_month.toString() },
    { label: 'Revenue (month)', value: fmt(h.revenue_month) },
    { label: 'Avg order value', value: fmt(h.aov_month) },
    { label: 'New customers', value: h.new_customers_month.toString() },
  ]

  const productEntries = Object.entries(data.product_mix).sort((a, b) => b[1] - a[1])
  const maxProduct = productEntries[0]?.[1] || 1

  const dailyEntries = Object.entries(data.daily_revenue_30d).sort((a, b) => a[0].localeCompare(b[0]))
  const maxRevenue = Math.max(...dailyEntries.map(([, v]) => v), 1)

  return (
    <div className="space-y-4">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
            <p className="text-xs text-ink/40 mb-1">{label}</p>
            <p className="text-lg font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Product mix */}
      <div className="bg-white rounded-xl border border-ink/10 p-4">
        <p className="text-xs font-medium text-ink/50 mb-3 uppercase tracking-wide">Product mix (month)</p>
        <div className="space-y-2">
          {productEntries.map(([name, count]) => (
            <div key={name} className="flex items-center gap-2">
              <p className="text-xs text-ink/70 w-40 truncate shrink-0">{name}</p>
              <div className="flex-1 bg-ink/5 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-espresso h-2 rounded-full"
                  style={{ width: `${(count / maxProduct) * 100}%` }}
                />
              </div>
              <p className="text-xs text-ink/50 w-6 text-right shrink-0">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status pipeline */}
      <div className="bg-white rounded-xl border border-ink/10 p-4">
        <p className="text-xs font-medium text-ink/50 mb-3 uppercase tracking-wide">Order pipeline</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.status_pipeline).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1.5 bg-linen rounded-lg px-3 py-1.5">
              <span className="text-xs text-ink/60">{status}</span>
              <span className="text-xs font-semibold text-espresso">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily revenue sparkline */}
      <div className="bg-white rounded-xl border border-ink/10 p-4">
        <p className="text-xs font-medium text-ink/50 mb-3 uppercase tracking-wide">Daily revenue (30d)</p>
        <div className="flex items-end gap-0.5 h-16">
          {dailyEntries.map(([date, rev]) => (
            <div
              key={date}
              title={`${date}: ${fmt(rev)}`}
              className="flex-1 bg-espresso/60 rounded-t min-h-[2px]"
              style={{ height: `${(rev / maxRevenue) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        <p className="text-xs font-medium text-ink/50 uppercase tracking-wide px-4 pt-4 pb-2">Recent orders</p>
        <div className="divide-y divide-ink/5">
          {data.recent_orders.slice(0, 10).map((o) => (
            <div key={o.order_id} className="px-4 py-2.5 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-ink">{o.customer_name}</p>
                <p className="text-xs text-ink/40">{o.order_id} · {o.order_date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-ink">{fmt(o.amount)}</p>
                <p className="text-xs text-ink/40">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
