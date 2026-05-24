import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronLeft, Edit3, Send, Phone } from 'lucide-react'
import Nav from '../components/Nav'
import StatusBadge from '../components/StatusBadge'
import { useOrdersList, useUpdateOrder, useSendInvoice } from '../hooks/useOrders'
import { useToast } from '../components/ToastProvider'
import { formatINR, formatDate, formatPhone } from '../utils/format'

interface EditForm {
  status: string
  payment: string
  payment_method: string
  notes: string
  delivery_date: string
  address: string
  pincode: string
  payment_reference: string
}

const STATUS_OPTIONS         = ['New', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
const PAYMENT_OPTIONS        = ['Paid', 'Partial Paid', 'Not Paid', 'COD']
const PAYMENT_METHOD_OPTIONS = ['UPI', 'Cash', 'COD', 'Partial COD', 'Payment Link', 'Bank Transfer']

export default function OrderDetailPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [editMode, setEditMode] = useState(false)

  const { data: orders = [], isLoading } = useOrdersList({})
  const order = useMemo(() => orders.find((o) => o.pageId === pageId), [orders, pageId])

  const updateOrderMut = useUpdateOrder()
  const sendInvoiceMut = useSendInvoice()

  const { register, handleSubmit, reset } = useForm<EditForm>()

  useEffect(() => {
    if (order) {
      reset({
        status:            order.status,
        payment:           order.payment,
        payment_method:    order.paymentMethod,
        notes:             order.notes,
        delivery_date:     order.deliveryDate,
        address:           order.address,
        pincode:           order.pincode,
        payment_reference: order.paymentReference,
      })
    }
  }, [order, reset])

  async function onSave(values: EditForm) {
    if (!order) return
    const updates: Record<string, string> = {}
    if (values.status            !== order.status)           updates['Status']           = values.status
    if (values.payment           !== order.payment)          updates['Payment Status']    = values.payment
    if (values.payment_method    !== order.paymentMethod)    updates['Payment Method']    = values.payment_method
    if (values.notes             !== order.notes)            updates['Notes']             = values.notes
    if (values.delivery_date     !== order.deliveryDate)     updates['Delivery Date']     = values.delivery_date
    if (values.address           !== order.address)          updates['Delivery Address']  = values.address
    if (values.pincode           !== order.pincode)          updates['Pin Code']          = values.pincode
    if (values.payment_reference !== order.paymentReference) updates['Payment Reference'] = values.payment_reference

    if (Object.keys(updates).length === 0) { setEditMode(false); return }

    try {
      await updateOrderMut.mutateAsync({ page_id: order.pageId, updates })
      toast.success('Order updated')
      setEditMode(false)
    } catch {
      toast.error('Failed to update order')
    }
  }

  async function onSendInvoice() {
    if (!order) return
    try {
      const invoiceNo = await sendInvoiceMut.mutateAsync(order.pageId)
      toast.success(`Invoice ${invoiceNo} sent to customer`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Failed to send invoice'
      toast.error(msg)
    }
  }

  const emailValid = !!order?.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(order.email)
  const invoiceAllowed =
    emailValid &&
    (order?.payment === 'Paid' ||
      order?.payment === 'COD' ||
      order?.type === 'Manual' ||
      order?.type === 'Distributor')

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Order" />
        <p className="text-center text-ink/40 text-sm py-12">Loading…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Order" />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-ink/50 text-sm">Order not found.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-espresso underline">
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title={order.orderId || 'Order'} />

      <main className="max-w-4xl mx-auto px-4 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4"
        >
          <ChevronLeft size={16} /> Orders
        </button>

        {/* Header card */}
        <div className="bg-cream rounded-xl border border-surface p-4 mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-ink/50">{order.orderId || order.pageId.slice(0, 16)}</p>
            <p className="text-2xl font-bold text-espresso mt-0.5">{formatINR(order.amount)}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <StatusBadge label={order.status} />
              <StatusBadge label={order.payment} />
              {order.type && (
                <span className="text-xs bg-surface text-ink/50 px-2 py-0.5 rounded-full">{order.type}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-espresso text-on-dark rounded-lg hover:bg-espresso-light transition-colors"
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
            <button
              onClick={onSendInvoice}
              disabled={!invoiceAllowed || sendInvoiceMut.isPending}
              title={
                !emailValid ? 'No valid email on this order'
                : !invoiceAllowed ? 'Only Paid, COD, Manual, or Distributor orders can be invoiced'
                : 'Resend invoice'
              }
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gold text-espresso rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {sendInvoiceMut.isPending ? 'Sending…' : 'Send Invoice'}
            </button>
          </div>
        </div>

        {/* Detail sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer */}
          <section className="bg-cream rounded-xl border border-surface p-4">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-3">Customer</h3>
            <p className="font-semibold text-ink">{order.customerName || '—'}</p>
            {order.phone && (
              <a
                href={`tel:+91${order.phone}`}
                className="flex items-center gap-1 text-sm text-espresso mt-1 hover:underline"
              >
                <Phone size={13} /> {formatPhone(order.phone)}
              </a>
            )}
            {order.email && <p className="text-sm text-ink/60 mt-1">{order.email}</p>}
          </section>

          {/* Delivery */}
          <section className="bg-cream rounded-xl border border-surface p-4">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-3">Delivery</h3>
            {!editMode ? (
              <>
                <p className="text-sm text-ink">{order.address || '—'}</p>
                {order.pincode && <p className="text-sm text-ink/60 mt-1">PIN: {order.pincode}</p>}
                {order.deliveryDate && (
                  <p className="text-xs text-ink/40 mt-1">Expected: {formatDate(order.deliveryDate)}</p>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <input {...register('address')} placeholder="Delivery address" className="input-field w-full" />
                <input {...register('pincode')} placeholder="Pincode" inputMode="numeric" className="input-field w-full" />
                <input type="date" {...register('delivery_date')} className="input-field w-full" />
              </div>
            )}
          </section>

          {/* Products */}
          <section className="bg-cream rounded-xl border border-surface p-4">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-3">Products</h3>
            {order.items.length > 0 ? (
              <ul className="space-y-1.5">
                {order.items.map((item) => (
                  <li key={item} className="text-sm text-ink flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink/40">—</p>
            )}
            <p className="text-xs text-ink/40 mt-2">Total qty: {order.quantity}</p>
          </section>

          {/* Payment & Status */}
          <section className="bg-cream rounded-xl border border-surface p-4">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-3">Payment & Status</h3>
            {!editMode ? (
              <>
                {order.paymentMethod && <p className="text-sm text-ink">Method: {order.paymentMethod}</p>}
                {order.onlineAmountPaid > 0 && order.codAmountDue > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-ink/60">Paid online: <span className="font-semibold text-ink">{formatINR(order.onlineAmountPaid)}</span></p>
                    <p className="text-xs text-amber-700 font-semibold">To collect: {formatINR(order.codAmountDue)}</p>
                  </div>
                )}
                {order.paymentReference && (
                  <p className="text-xs text-ink/50 mt-1 font-mono">Ref: {order.paymentReference}</p>
                )}
                {order.invoiceNumber && (
                  <p className="text-xs text-ink/50 mt-1">Invoice: {order.invoiceNumber}</p>
                )}
                <p className="text-xs text-ink/40 mt-2">Ordered: {formatDate(order.orderDate)}</p>
              </>
            ) : (
              <div className="space-y-2">
                <select {...register('status')} className="input-field w-full">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select {...register('payment')} className="input-field w-full">
                  {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select {...register('payment_method')} className="input-field w-full">
                  {PAYMENT_METHOD_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input {...register('payment_reference')} placeholder="Payment reference / UTR" className="input-field w-full" />
              </div>
            )}
          </section>

          {/* Notes */}
          <section className="bg-cream rounded-xl border border-surface p-4 sm:col-span-2">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-3">Notes</h3>
            {!editMode ? (
              <p className="text-sm text-ink whitespace-pre-wrap">{order.notes || '—'}</p>
            ) : (
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Notes"
                className="input-field w-full resize-none"
              />
            )}
          </section>
        </div>

        {/* Edit action bar */}
        {editMode && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit(onSave)}
              disabled={updateOrderMut.isPending}
              className="flex-1 py-3 bg-espresso text-on-dark rounded-xl font-semibold text-sm hover:bg-espresso-light transition-colors disabled:opacity-50"
            >
              {updateOrderMut.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={() => { setEditMode(false); reset() }}
              className="px-6 py-3 bg-surface text-ink rounded-xl font-semibold text-sm hover:bg-surface/80"
            >
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
