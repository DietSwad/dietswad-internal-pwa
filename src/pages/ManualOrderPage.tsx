import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, ChevronLeft } from 'lucide-react'
import Nav from '../components/Nav'
import { useCreateManualOrder } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import { useToast } from '../components/ToastProvider'
import { ManualOrderSchema, type ManualOrderFormValues } from '../utils/zodSchemas'
import { formatINR } from '../utils/format'

const PAYMENT_METHODS = ['UPI', 'Cash', 'COD', 'Payment Link', 'Bank Transfer'] as const
const PAYMENT_STATUSES = ['Paid', 'Not Paid', 'COD'] as const

export default function ManualOrderPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null)

  const { data: products = [] } = useProducts()
  const createOrder = useCreateManualOrder()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualOrderFormValues>({
    resolver: zodResolver(ManualOrderSchema),
    defaultValues: {
      payment_method: 'UPI',
      payment_status: 'Not Paid',
      items: [{ product: '', quantity: 1, unit_price: 0 }],
    },
  })

  const items = watch('items')

  const CUSTOM_PRODUCTS = new Set(['Custom Order', 'Gift Hampers'])

  function addItem() {
    setValue('items', [...items, { product: '', quantity: 1, unit_price: 0 }])
  }
  function removeItem(idx: number) {
    setValue('items', items.filter((_, i) => i !== idx))
  }

  async function onSubmit(values: ManualOrderFormValues) {
    try {
      const total = values.items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
      const result = await createOrder.mutateAsync({
        ...values,
        order_type: 'Manual',
        total_amount: total,
      })
      setConfirmedOrderId(result.order_id)
    } catch {
      toast.error('Failed to create order — please retry')
    }
  }

  // ── Confirmation screen ───────────────────────────────────────────────────────────
  if (confirmedOrderId) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Manual Order" />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Order Created</h2>
          <p className="font-mono text-sm text-ink/60 bg-surface px-4 py-2 rounded-lg inline-block mb-8">
            {confirmedOrderId}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-2.5 bg-espresso text-on-dark rounded-xl text-sm font-semibold"
            >
              View Orders
            </button>
            <button
              onClick={() => setConfirmedOrderId(null)}
              className="px-6 py-2.5 bg-surface text-ink rounded-xl text-sm font-semibold"
            >
              New Order
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Manual Order" />
      <main className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={16} /> Back
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Customer */}
          <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Customer</h3>
            <div>
              <input {...register('customer_name')} placeholder="Full name *" className="input-field w-full" />
              {errors.customer_name && <p className="text-xs text-red-600 mt-1">{errors.customer_name.message}</p>}
            </div>
            <div>
              <input
                {...register('phone')}
                placeholder="Mobile number (10 digits) *"
                inputMode="numeric"
                className="input-field w-full"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
            <input {...register('email')} placeholder="Email (optional)" type="email" className="input-field w-full" />
          </section>

          {/* Delivery */}
          <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Delivery</h3>
            <div>
              <input {...register('address')} placeholder="Delivery address *" className="input-field w-full" />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <input
                {...register('pincode')}
                placeholder="Pincode *"
                inputMode="numeric"
                className="input-field w-full"
              />
              {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode.message}</p>}
            </div>
          </section>

          {/* Products */}
          <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Products</h3>
            {items.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <select
                      {...register(`items.${idx}.product`)}
                      className="input-field w-full"
                      onChange={(e) => {
                        const name = e.target.value
                        setValue(`items.${idx}.product`, name)
                        const catalog = products.find((p) => p.name === name)
                        setValue(`items.${idx}.unit_price`, catalog?.price ?? 0)
                        if (!CUSTOM_PRODUCTS.has(name)) setValue(`items.${idx}.custom_name`, '')
                      }}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}{p.price > 0 ? ` — ${formatINR(p.price)}` : ''}
                        </option>
                      ))}
                    </select>
                    {(errors.items as { [k: number]: { product?: { message?: string } } })?.[idx]?.product && (
                      <p className="text-xs text-red-600 mt-0.5">
                        {(errors.items as { [k: number]: { product?: { message?: string } } })[idx].product?.message}
                      </p>
                    )}
                  </div>
                  <input
                    {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
                    type="number"
                    min={1}
                    className="input-field w-16 text-center"
                    placeholder="Qty"
                  />
                  <div className="flex-shrink-0 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-ink/40 text-sm">₹</span>
                    <input
                      {...register(`items.${idx}.unit_price`, { valueAsNumber: true })}
                      type="number"
                      min={0}
                      className="input-field w-24 pl-5"
                      placeholder="Price"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-400 hover:text-red-600 p-2 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {CUSTOM_PRODUCTS.has(item.product) && (
                  <div>
                    <input
                      {...register(`items.${idx}.custom_name`)}
                      placeholder="Custom product name *"
                      className="input-field w-full"
                    />
                    {(errors.items as { [k: number]: { custom_name?: { message?: string } } })?.[idx]?.custom_name && (
                      <p className="text-xs text-red-600 mt-0.5">
                        {(errors.items as { [k: number]: { custom_name?: { message?: string } } })[idx].custom_name?.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {errors.items?.message && (
              <p className="text-xs text-red-600">{errors.items.message}</p>
            )}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-sm text-espresso font-medium hover:underline"
            >
              <Plus size={15} /> Add product
            </button>
          </section>

          {/* Payment */}
          <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
            <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Payment</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink/50 mb-1 block">Method</label>
                <select {...register('payment_method')} className="input-field w-full">
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-ink/50 mb-1 block">Status</label>
                <select {...register('payment_status')} className="input-field w-full">
                  {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <textarea
              {...register('notes')}
              placeholder="Notes (optional)"
              rows={2}
              className="input-field w-full resize-none"
            />
          </section>

          <button
            type="submit"
            disabled={createOrder.isPending}
            className="w-full py-3.5 bg-espresso text-on-dark rounded-xl font-semibold text-sm hover:bg-espresso-light transition-colors disabled:opacity-50"
          >
            {createOrder.isPending ? 'Creating…' : 'Create Order'}
          </button>
        </form>
      </main>
    </div>
  )
}
