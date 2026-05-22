import { type OrderFilters } from '../api/orders'

const STATUS_OPTIONS  = ['', 'New', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
const PAYMENT_OPTIONS = ['', 'Paid', 'Not Paid', 'COD']
const TYPE_OPTIONS    = ['', 'Website', 'Manual', 'Distributor', 'Offline', 'WhatsApp']

const SELECT_CLS = 'text-xs border border-surface bg-cream rounded-lg px-2 py-1.5 text-ink focus:ring-2 focus:ring-gold/40 focus:outline-none'

interface FilterBarProps {
  filters: OrderFilters
  onChange: (f: OrderFilters) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function set(key: keyof OrderFilters, value: string) {
    onChange({ ...filters, [key]: value || undefined })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select value={filters.status ?? ''} onChange={(e) => set('status', e.target.value)} className={SELECT_CLS}>
        {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o || 'All status'}</option>)}
      </select>

      <select value={filters.payment ?? ''} onChange={(e) => set('payment', e.target.value)} className={SELECT_CLS}>
        {PAYMENT_OPTIONS.map((o) => <option key={o} value={o}>{o || 'All payment'}</option>)}
      </select>

      <select value={filters.type ?? ''} onChange={(e) => set('type', e.target.value)} className={SELECT_CLS}>
        {TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o || 'All types'}</option>)}
      </select>

      <input
        type="date"
        value={filters.date_from ?? ''}
        onChange={(e) => set('date_from', e.target.value)}
        className={SELECT_CLS}
        title="From date"
      />
      <input
        type="date"
        value={filters.date_to ?? ''}
        onChange={(e) => set('date_to', e.target.value)}
        className={SELECT_CLS}
        title="To date"
      />

      <input
        type="search"
        value={filters.search ?? ''}
        onChange={(e) => set('search', e.target.value)}
        placeholder="Search name / phone"
        className={`${SELECT_CLS} flex-1 min-w-[140px]`}
      />
    </div>
  )
}
