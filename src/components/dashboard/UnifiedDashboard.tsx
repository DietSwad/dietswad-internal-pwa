import { LayoutDashboard } from 'lucide-react'

export default function UnifiedDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Orders', 'Revenue', 'Sessions', 'ROAS'].map((label) => (
          <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
            <p className="text-xs text-ink/40 mb-1">{label}</p>
            <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <LayoutDashboard size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Unified view</p>
        <p className="text-xs text-ink/40 text-center max-w-xs">
          Cross-channel summary combining orders, website, and Meta data into one view.
          Wired up in Phase 4 alongside <code className="font-mono">/api/github-dispatch</code>.
        </p>
      </div>
    </div>
  )
}
