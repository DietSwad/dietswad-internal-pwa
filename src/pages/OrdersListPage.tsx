import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Nav from '../components/Nav'
import FilterBar from '../components/FilterBar'
import OrderCard from '../components/OrderCard'
import StatusBadge from '../components/StatusBadge'
import { useOrdersList } from '../hooks/useOrders'
import { formatINR, formatDate } from '../utils/format'
import { type OrderFilters } from '../api/orders'

export default function OrdersListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<OrderFilters>({})

  // Strip client-only `search` before sending to backend
  const apiFilters = useMemo(() => {
    const { search: _s, ...rest } = filters
    return rest
  }, [filters])

  const { data: orders = [], isLoading, isError } = useOrdersList(apiFilters)

  // Client-side search filter (name, phone, orderId)
  const displayed = useMemo(() => {
    const q = (filters.search ?? '').toLowerCase().trim()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.orderId.toLowerCase().includes(q)
    )
  }, [orders, filters.search])

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Orders" />

      <main className="max-w-4xl mx-auto px-4 py-5">
        <FilterBar filters={filters} onChange={setFilters} />

        {isLoading && (
          <p className="text-center text-ink/40 text-sm py-12">Loading orders…</p>
        )}
        {isError && (
          <p className="text-center text-red-600 text-sm py-12">
            Failed to load orders. Check your connection.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-surface">
              <table className="w-full text-sm">
                <thead className="bg-espresso text-on-dark">
                  <tr>
                    {['Date', 'Order ID', 'Customer', 'Amount', 'Status', 'Payment', 'Type'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface">
                  {displayed.map((o) => (
                    <tr
                      key={o.pageId}
                      className="bg-cream hover:bg-linen cursor-pointer"
                      onClick={() => navigate(`/orders/${o.pageId}`)}
                    >
                      <td className="px-3 py-2.5 text-xs text-ink/60 whitespace-nowrap">
                        {formatDate(o.orderDate)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-ink/70 whitespace-nowrap">
                        {o.orderId || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-ink max-w-[160px] truncate">
                        {o.customerName || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-espresso whitespace-nowrap">
                        {formatINR(o.amount)}
                      </td>
                      <td className="px-3 py-2.5"><StatusBadge label={o.status} /></td>
                      <td className="px-3 py-2.5"><StatusBadge label={o.payment} /></td>
                      <td className="px-3 py-2.5 text-xs text-ink/50">{o.type || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {displayed.length === 0 && (
                <p className="text-center text-ink/40 text-sm py-10">
                  No orders match the current filters.
                </p>
              )}
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden flex flex-col gap-3">
              {displayed.map((o) => (
                <OrderCard key={o.pageId} order={o} />
              ))}
              {displayed.length === 0 && (
                <p className="text-center text-ink/40 text-sm py-10">No orders found.</p>
              )}
            </div>

            <p className="text-xs text-ink/30 mt-3 text-right">{displayed.length} order{displayed.length !== 1 ? 's' : ''}</p>
          </>
        )}
      </main>

      {/* FAB — new order */}
      <Link
        to="/orders/new"
        className="fixed bottom-6 right-6 w-14 h-14 bg-espresso text-gold rounded-full shadow-lg flex items-center justify-center hover:bg-espresso-light transition-colors"
        aria-label="New manual order"
      >
        <Plus size={24} />
      </Link>
    </div>
  )
}
