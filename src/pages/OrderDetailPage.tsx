import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Edit3, Send, Download, Phone, CheckCircle, AlertTriangle } from 'lucide-react'
import Nav from '../components/Nav'
import StatusBadge from '../components/StatusBadge'
import RtoLogModal from '../components/RtoLogModal'
import { useOrdersList, useUpdateOrder, useSendInvoice, useDownloadInvoice, useMarkDelivered, useMarkRto } from '../hooks/useOrders'
import { useToast } from '../components/ToastProvider'
import { formatINR, formatDate, formatPhone } from '../utils/format'
import type { RtoLogFormValues } from '../utils/zodSchemas'

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
  const toast = useToast()
  const [editMode, setEditMode] = useState(false)
  const [rtoModalOpen, setRtoModalOpen] = useState(false)

  const { data: orders = [], isLoading } = useOrdersList({})
  const order = useMemo(() => orders.find((o) => o.pageId === pageId), [orders, pageId])

  const updateOrderMut  = useUpdateOrder()
  const sendInvoiceMut  = useSendInvoice()
  const downloadInvoiceMut = useDownloadInvoice()
  const markDeliveredMut = useMarkDelivered()
  const markRtoMut      = useMarkRto()

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
      toast.success(`Invoice ${invoiceNo} sent · Order ${order.orderId || order.pageId.slice(0, 8)}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Failed to send invoice'
      toast.error(msg)
    }
  }

  async function onDownloadInvoice() {
    if (!order) return
    try {
      const { blob, filename } = await downloadInvoiceMut.mutateAsync(order.pageId)
      const file = new File([blob], filename, { type: 'application/pdf' })

      // Mobile: open the native share sheet with the PDF attached (pick WhatsApp → chat).
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: filename,
            text: `Diet Swad invoice for ${order.customerName || 'your order'}`,
          })
          return
        } catch (err) {
          // User cancelled the share sheet — not an error.
          if ((err as { name?: string })?.name === 'AbortError') return
          // Any other share failure → fall through to download.
        }
      }

      // Desktop / no file-share support: download the PDF.
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success(`Invoice ${filename} ready`)
    } catch {
      toast.error('Failed to generate invoice')
    }
  }

  async function onMarkDelivered() {
    if (!order) return
    try {
      await markDeliveredMut.mutateAsync({ orderId: order.orderId || order.pageId })
      toast.success('Marked as Delivered' + (order.payment === 'COD' ? ' · COD collected' : ''))
    } catch {
      toast.error('Failed to mark delivered')
    }
  }

  async function onMarkRto(values: RtoLogFormValues) {
    if (!order) return
    try {
      await markRtoMut.mutateAsync({
        order_id:          order.orderId || order.pageId,
        outcome:           values.outcome,
        reason:            values.reason,
        rto_shipping_cost: values.rto_shipping_cost,
        rto_tracking_id:   values.rto_tracking_id || undefined,
        rto_date:          values.rto_date || undefined,
        notes:             values.notes || undefined,
      })
      toast.success('RTO logged')
      setRtoModalOpen(false)
    } catch {
      toast.error('Failed to log RTO')
    }
  }

  const emailValid = !!order?.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(order.email)
  const invoiceAllowed = emailValid
  const showDeliveryActions = order?.status === 'Out for Delivery'
  const isRto = order?.status === 'RTO' || order?.status === 'Lost'

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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title={order.orderId || 'Order'} />

      <main className="max-w-4xl mx-auto px-4 py-5">
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
              title={!emailValid ? 'No valid email on this order' : 'Send invoice'}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gold text-espresso rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {sendInvoiceMut.isPending ? 'Sending…' : 'Send Invoice'}
            </button>
            <button
              onClick={onDownloadInvoice}
              disabled={downloadInvoiceMut.isPending}
              title="Download invoice PDF to share on WhatsApp"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-espresso/10 text-espresso rounded-lg hover:bg-espresso/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={14} />
              {downloadInvoiceMut.isPending ? 'Preparing…' : 'Download Invoice'}
            </button>
          </div>
        </div>

        {/* Delivery action buttons — shown when order is Out for Delivery */}
        {showDeliveryActions && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={onMarkDelivered}
              disabled={markDeliveredMut.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle size={15} />
              {markDeliveredMut.isPending ? 'Updating…' : (order?.payment === 'COD' ? 'Mark Delivered · COD Collected' : 'Mark Delivered')}
            </button>
            <button
              onClick={() => setRtoModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200"
            >
              <AlertTriangle size={15} /> Log RTO
            </button>
          </div>
        )}

        {/* RTO summary card */}
        {isRto && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Return to Origin</p>
            {order?.deliveryOutcome && <p className="text-sm text-ink">Outcome: <span className="font-medium">{order.deliveryOutcome}</span></p>}
            {order?.rtoReason      && <p className="text-sm text-ink">Reason: <span className="font-medium">{order.rtoReason}</span></p>}
            {order?.rtoShippingCost !== undefined && order.rtoShippingCost > 0 && (
              <p className="text-sm text-red-700 font-semibold">Loss absorbed: {formatINR(order.rtoShippingCost)}</p>
            )}
            {order?.rtoTrackingId && <p className="text-xs text-ink/50 font-mono mt-1">Return AWB: {order.rtoTrackingId}</p>}
          </div>
        )}

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
                {order.customerSource && (
                  <p className="text-xs text-ink/40 mt-1">
                    Source: {order.customerSource}
                    {order.customerMedium && ` · ${order.customerMedium}`}
                    {order.customerCampaign && ` · ${order.customerCampaign}`}
                  </p>
                )}
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

      <RtoLogModal
        orderId={order?.orderId || order?.pageId || ''}
        isOpen={rtoModalOpen}
        isPending={markRtoMut.isPending}
        onClose={() => setRtoModalOpen(false)}
        onSubmit={onMarkRto}
      />
    </div>
  )
}
