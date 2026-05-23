import { Globe } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import type { GA4Data } from '../../api/dashboards'

export default function WebsiteDashboard() {
  const { data, isLoading, error } = useDashboard<GA4Data>('ga4')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Sessions', 'Users', 'Bounce rate'].map((label) => (
            <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
              <p className="text-xs text-ink/40 mb-1">{label}</p>
              <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-ink/10 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-ink/5 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <Globe size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Not yet generated</p>
        <p className="text-xs text-ink/40 text-center">Refresh to pull the latest GA4 data.</p>
      </div>
    )
  }

  // Aggregate totals across channels
  const totalSessions = data.traffic_by_channel.reduce((s, r) => s + Number(r.sessions ?? 0), 0)
  const totalUsers = data.traffic_by_channel.reduce((s, r) => s + Number(r.totalUsers ?? 0), 0)
  const avgBounce = data.traffic_by_channel.length
    ? data.traffic_by_channel.reduce((s, r) => s + Number(r.bounceRate ?? 0), 0) / data.traffic_by_channel.length
    : 0

  const kpis = [
    { label: 'Sessions (30d)', value: totalSessions.toLocaleString('en-IN') },
    { label: 'Users (30d)', value: totalUsers.toLocaleString('en-IN') },
    { label: 'Avg bounce rate', value: `${(avgBounce * 100).toFixed(1)}%` },
  ]

  return (
    <div className="space-y-4">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
            <p className="text-xs text-ink/40 mb-1">{label}</p>
            <p className="text-lg font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Traffic by channel */}
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        <p className="text-xs font-medium text-ink/50 uppercase tracking-wide px-4 pt-4 pb-2">Traffic by channel</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left px-4 py-2 text-ink/40 font-medium">Channel</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">Sessions</th>
                <th className="text-right px-4 py-2 text-ink/40 font-medium">New users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {data.traffic_by_channel.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-ink/80">{String(r.sessionDefaultChannelGroup ?? '—')}</td>
                  <td className="px-4 py-2.5 text-right text-ink/70">{Number(r.sessions ?? 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 text-right text-ink/70">{Number(r.newUsers ?? 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        <p className="text-xs font-medium text-ink/50 uppercase tracking-wide px-4 pt-4 pb-2">Top pages</p>
        <div className="divide-y divide-ink/5">
          {data.top_pages.slice(0, 10).map((r, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-2">
              <p className="text-xs text-ink/70 truncate">{String(r.pagePath ?? '—')}</p>
              <p className="text-xs font-medium text-ink/50 shrink-0">{Number(r.screenPageViews ?? 0).toLocaleString('en-IN')} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
