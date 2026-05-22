import { Link } from 'react-router-dom'
import { type FlatOrder } from '../api/orders'
import StatusBadge from './StatusBadge'
import { formatINR, formatDate } from '../utils/format'

export default function OrderCard({ order }: { order: FlatOrder }) {
  return (
    <Link
      to={`/orders/${order.pageId}`}
      className="block bg-cream rounded-xl border border-surface p-4 hover:border-gold/40 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-ink truncate">{order.customerName || '—'}</p>
          <p className="text-xs text-ink/50 mt-0.5 font-mono">{order.orderId || order.pageId.slice(0, 12)}</p>
        </div>
        <p className="font-bold text-sm text-espresso whitespace-nowrap">{formatINR(order.amount)}</p>
      </div>
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <StatusBadge label={order.status} />
        <StatusBadge label={order.payment} />
        {order.type && (
          <span className="text-xs text-ink/40 bg-surface px-2 py-0.5 rounded-full">{order.type}</span>
        )}
      </div>
      <p className="text-xs text-ink/40 mt-2">{formatDate(order.orderDate)}</p>
    </Link>
  )
}
