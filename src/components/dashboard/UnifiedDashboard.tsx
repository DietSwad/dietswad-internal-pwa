import { BarChart3 } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import type { UnifiedData } from '../../api/dashboards'

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function UnifiedDashboard() {
  const { data, isLoading, error } = useDashboard<UnifiedData>('unified')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Blended ROAS', 'Revenue (30d)', 'CAC', 'Conv. rate'].map((label) => (
            <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
              <p className="text-xs text-ink/40 mb-1">{label}</p>
              <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-ink/10 p-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-6 bg-ink/5 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <BarChart3 size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Not yet generated</p>
        <p className="text-xs text-ink/40 text-center">Refresh to pull the latest unified data.</p>
      </div>
    )
  }

  const h = data.headline
  const kpis = [
    { label: 'Blended ROAS', value: `${h.blended_roas}x` },
    { label: 'Revenue (30d)', value: fmt(h.revenue_30d) },
    { label: 'CAC', value: fmt(h.cac) },
    { label: 'Conv. rate', value: `${h.conversion_rate}%` },
  ]

  // Funnel: compute widths as % of max
  const f = data.funnel
  const funnelSteps = [
    { label: 'Spend', value: fmt(f.spend), raw: f.spend },
    { label: 'Impressions', value: f.impressions.toLocaleString('en-IN'), raw: f.impressions },
    { label: 'Clicks', value: f.clicks.toLocaleString('en-IN'), raw: f.clicks },
    { label: 'Sessions', value: f.sessions.toLocaleString('en-IN'), raw: f.sessions },
    { label: 'Orders paid', value: f.orders_paid.toLocaleString('en-IN'), raw: f.orders_paid },
    { label: 'Revenue', value: fmt(f.revenue), raw: f.revenue },
  ]
  const maxRaw = Math.max(...funnelSteps.map((s) => s.raw), 1)

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

      {/* Funnel visualization */}
      <div className="bg-white rounded-xl border border-ink/10 p-4">
        <p className="text-xs font-medium text-ink/50 uppercase tracking-wide mb-3">Full-funnel (30d)</p>
        <div className="space-y-2">
          {funnelSteps.map(({ label, value, raw }) => (
            <div key={label} className="flex items-center gap-2">
              <p className="text-xs text-ink/60 w-24 shrink-0">{label}</p>
              <div className="flex-1 bg-ink/5 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-espresso/70 h-4 rounded-full"
                  style={{ width: `${Math.max((raw / maxRaw) * 100, 2)}%` }}
                />
              </div>
              <p className="text-xs text-ink/60 w-28 text-right shrink-0">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign attribution */}
      {data.campaign_attribution.length > 0 && (
        <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
          <p className="text-xs font-medium text-ink/50 uppercase tracking-wide px-4 pt-4 pb-2">Campaign attribution</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink/5">
                  <th className="text-left px-4 py-2 text-ink/40 font-medium">Campaign</th>
                  <th className="text-right px-4 py-2 text-ink/40 font-medium">Orders</th>
                  <th className="text-right px-4 py-2 text-ink/40 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {data.campaign_attribution.map((c) => (
                  <tr key={c.campaign}>
                    <td className="px-4 py-2.5 text-ink/80 max-w-[160px] truncate">{c.campaign}</td>
                    <td className="px-4 py-2.5 text-right text-ink/70">{c.orders}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-espresso">{fmt(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
