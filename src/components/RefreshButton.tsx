import { RefreshCw } from 'lucide-react'
import { useTriggerRefresh } from '../hooks/useDashboard'
import { useToast } from './ToastProvider'

export default function RefreshButton() {
  const { mutate, isPending } = useTriggerRefresh()
  const toast = useToast()

  function handleClick() {
    mutate(undefined, {
      onSuccess: () => toast.success('Refresh started — blobs update in ~3 min'),
      onError: () => toast.error('Refresh failed — check your connection'),
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink/10 text-xs text-ink/60 bg-white hover:bg-ink/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
      {isPending ? 'Refreshing…' : 'Refresh'}
    </button>
  )
}
