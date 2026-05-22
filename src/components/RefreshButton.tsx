import { RefreshCw } from 'lucide-react'

export default function RefreshButton() {
  return (
    <button
      disabled
      title="Analytics refresh available in Phase 4"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink/10 text-xs text-ink/30 bg-white cursor-not-allowed"
    >
      <RefreshCw size={13} />
      Refresh
    </button>
  )
}
