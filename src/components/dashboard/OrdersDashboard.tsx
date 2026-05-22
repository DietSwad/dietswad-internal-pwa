import { ShoppingBag } from 'lucide-react'

export default function OrdersDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Total orders', 'Revenue', 'Avg order value', 'Pending'].map((label) => (
          <div key={label} className="bg-white rounded-xl border border-ink/10 px-4 py-3">
            <p className="text-xs text-ink/40 mb-1">{label}</p>
            <div className="h-6 w-16 bg-ink/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 bg-espresso/10 rounded-xl flex items-center justify-center">
          <ShoppingBag size={22} className="text-espresso/40" />
        </div>
        <p className="text-sm font-medium text-ink/60">Orders analytics</p>
        <p className="text-xs text-ink/40 text-center max-w-xs">
          Revenue trends, daily order counts, and product breakdown arrive with Phase 4
          (<code className="font-mono">/api/dashboard</code>).
        </p>
      </div>
    </div>
  )
}
