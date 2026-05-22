import { TrendingUp } from 'lucide-react'

export default function MetaDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Reach', 'Impressions', 'Engagement', 'Link clicks'].map((label) => (
          <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
            <p className="text-xs text-ink/40 mb-1">{label}</p>
            <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <TrendingUp size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Meta ads analytics</p>
        <p className="text-xs text-ink/40 text-center max-w-xs">
          Instagram and Facebook campaign performance, ROAS, and creative breakdowns
          arrive with Phase 4 (<code className="font-mono">/api/dashboard</code>).
        </p>
      </div>
    </div>
  )
}
