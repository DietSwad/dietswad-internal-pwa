import { TrendingUp } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import type { MetaData } from '../../api/dashboards'

export default function MetaDashboard() {
  const { data, isLoading, error } = useDashboard<MetaData>('meta')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Spend (30d)', 'Impressions', 'Clicks', 'CTR'].map((label) => (
            <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
              <p className="text-xs text-ink/40 mb-1">{label}</p>
              <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-ink/10 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-ink/5 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <TrendingUp size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Not yet generated</p>
        <p className="text-xs text-ink/40 text-center">Refresh to pull the latest Meta Ads data.</p>
      </div>
    )
  }

  const h = data.headline
  const kpis = [
    { label: 'Spend (30d)', value: `₹${h.spend_30d.toLocaleString('en-IN')}` },
    { label: 'Impressions', value: h.impressions_30d.toLocaleString('en-IN') },
    { label: 'Clicks', value: h.clicks_30d.toLocaleString('en-IN') },
    { label: 'CTR', value: `${h.ctr_30d}%` },
  ]

  const sorted = [...data.campaigns].sort((a, b) => b.spend - a.spend)

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

      {/* Campaigns table */}
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        <p className="text-xs font-medium text-ink/50 uppercase tracking-wide px-4 pt-4 pb-2">Campaigns (last 30d)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left px-4 py-2 text-ink/40 font-medium">Campaign</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">Spend</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">Clicks</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">CTR</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2.5 text-ink/80 max-w-[160px] truncate">{c.name}</td>
                  <td className="px-4 py-2.5 text-right text-ink/70">₹{c.spend.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 text-right text-ink/70">{c.clicks.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 text-right text-ink/70">{c.ctr.toFixed(2)}%</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-espresso">{c.purchase_roas.toFixed(2)}x</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/30">No campaigns in last 30 days</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
