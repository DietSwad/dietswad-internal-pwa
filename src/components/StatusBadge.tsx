const COLOR_MAP: Record<string, string> = {
  New:               'bg-blue-100 text-blue-800',
  Preparing:         'bg-yellow-100 text-yellow-800',
  'Out for Delivery':'bg-orange-100 text-orange-800',
  Delivered:         'bg-green-100 text-green-800',
  Cancelled:         'bg-red-100 text-red-800',
  Paid:              'bg-green-100 text-green-800',
  'Not Paid':        'bg-red-100 text-red-800',
  COD:               'bg-yellow-100 text-yellow-800',
  'Partial Paid':    'bg-amber-100 text-amber-800',
  'Partial COD':     'bg-amber-100 text-amber-800',
}

export default function StatusBadge({ label }: { label: string }) {
  const color = COLOR_MAP[label] ?? 'bg-surface text-ink/60'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label || '—'}
    </span>
  )
}
