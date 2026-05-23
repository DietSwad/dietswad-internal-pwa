import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronLeft, Plus, Trash2, Upload } from 'lucide-react'
import Nav from '../components/Nav'
import { useCreateManualOrder } from '../hooks/useOrders'
import { sendInvoiceByOrderId } from '../api/orders'
import { useProducts } from '../hooks/useProducts'
import { useToast } from '../components/ToastProvider'
import { CsvRowSchema, type CsvRow } from '../utils/zodSchemas'
import { formatINR } from '../utils/format'

type TabId = 'single' | 'csv'

// ── Single-customer tab ──────────────────────────────────────────────────────────────────

interface SingleForm {
  customer_name: string
  phone: string
  email?: string
  address: string
  pincode: string
  distributor_name?: string
  payment_method: string
  payment_status: string
  notes?: string
  items: Array<{ product: string; quantity: number }>
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function SingleCustomerTab({ autoSendInvoice }: { autoSendInvoice: boolean }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { data: products = [] } = useProducts()
  const createOrder = useCreateManualOrder()
  const [done, setDone] = useState<string | null>(null)
  const [invoiceSent, setInvoiceSent] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SingleForm>({
    defaultValues: {
      payment_method: 'Bank Transfer',
      payment_status: 'Not Paid',
      items: [{ product: '', quantity: 1 }],
    },
  })
  const items = watch('items')

  async function onSubmit(values: SingleForm) {
    const mappedItems = values.items
      .filter((i) => i.product)
      .map((i) => {
        const p = products.find((x) => x.name === i.product)
        return { product: i.product, quantity: i.quantity, unit_price: p?.price ?? 0 }
      })
    if (!mappedItems.length) { toast.error('Add at least one product'); return }

    try {
      const total = mappedItems.reduce((s, i) => s + (i.unit_price ?? 0) * i.quantity, 0)
      const result = await createOrder.mutateAsync({
        ...values,
        order_type: 'Distributor',
        items: mappedItems,
        total_amount: total,
      })
      setDone(result.order_id)
      setInvoiceSent(false)
      if (autoSendInvoice && values.email && EMAIL_RE.test(values.email)) {
        try {
          await sendInvoiceByOrderId(result.order_id)
          setInvoiceSent(true)
        } catch {
          toast.error('Order created — invoice failed to send')
        }
      }
    } catch {
      toast.error('Failed to create order')
    }
  }

  if (done) {
    return (
      <div className="py-12 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 text-xl">✓</div>
        <p className="font-bold text-ink text-lg">Order Created</p>
        <p className="font-mono text-sm text-ink/50 bg-surface px-4 py-2 rounded-lg inline-block mt-2">{done}</p>
        {invoiceSent && (
          <p className="text-xs text-green-600 mt-2">Invoice sent</p>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => navigate('/orders')} className="px-5 py-2 bg-espresso text-on-dark rounded-xl text-sm font-semibold">View Orders</button>
          <button onClick={() => setDone(null)} className="px-5 py-2 bg-surface text-ink rounded-xl text-sm font-semibold">New Entry</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
        <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Customer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input {...register('customer_name', { required: 'Required' })} placeholder="Name *" className="input-field w-full" />
            {errors.customer_name && <p className="text-xs text-red-600 mt-1">{errors.customer_name.message}</p>}
          </div>
          <div>
            <input {...register('phone', { required: true, pattern: /^\d{10}$/ })} placeholder="Phone (10 digits) *" inputMode="numeric" className="input-field w-full" />
            {errors.phone && <p className="text-xs text-red-600 mt-1">10-digit mobile required</p>}
          </div>
          <input {...register('address', { required: true })} placeholder="Address *" className="input-field w-full sm:col-span-2" />
          <input {...register('pincode', { required: true, pattern: /^\d{6}$/ })} placeholder="Pincode *" inputMode="numeric" className="input-field w-full" />
          <input {...register('email')} placeholder="Email (for invoice)" type="email" className="input-field w-full" />
          <input {...register('distributor_name')} placeholder="Distributor name (optional)" className="input-field w-full" />
        </div>
      </section>

      <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
        <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Products</h3>
        {items.map((_, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <select {...register(`items.${idx}.product`)} className="input-field flex-1 min-w-0">
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.name} value={p.name}>{p.name} — {formatINR(p.price)}</option>
              ))}
            </select>
            <input
              {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
              type="number" min={1}
              className="input-field w-16 text-center"
              placeholder="Qty"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => setValue('items', items.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-1.5">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setValue('items', [...items, { product: '', quantity: 1 }])} className="flex items-center gap-1 text-sm text-espresso font-medium hover:underline">
          <Plus size={14} /> Add product
        </button>
      </section>

      <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
        <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Payment</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Method</label>
            <select {...register('payment_method')} className="input-field w-full">
              {['UPI', 'Cash', 'COD', 'Payment Link', 'Bank Transfer'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Status</label>
            <select {...register('payment_status')} className="input-field w-full">
              {['Paid', 'Not Paid', 'COD'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <textarea {...register('notes')} placeholder="Notes (optional)" rows={2} className="input-field w-full resize-none" />
      </section>

      <button type="submit" disabled={createOrder.isPending} className="w-full py-3.5 bg-espresso text-on-dark rounded-xl font-semibold text-sm disabled:opacity-50">
        {createOrder.isPending ? 'Creating…' : 'Create Distributor Order'}
      </button>
    </form>
  )
}

// ── CSV Batch tab ─────────────────────────────────────────────────────────────────────────

interface BatchResult {
  row: CsvRow
  success: boolean
  orderId?: string
  error?: string
}

function CsvBatchTab() {
  const toast = useToast()
  const createOrder = useCreateManualOrder()
  const [csvText, setCsvText] = useState('')
  const [parsed, setParsed] = useState<CsvRow[] | null>(null)
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [results, setResults] = useState<BatchResult[] | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCsvText(ev.target?.result as string)
    reader.readAsText(file)
  }

  function parseCsv() {
    const lines = csvText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('name,') && !l.startsWith('#'))

    const rows: CsvRow[] = []
    const errs: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim())
      if (parts.length < 7) { errs.push(`Row ${i + 1}: not enough columns`); continue }
      const raw = { name: parts[0], phone: parts[1], product: parts[2], qty: parts[3], address: parts[4], pincode: parts[5], amount: parts[6] }
      const result = CsvRowSchema.safeParse(raw)
      if (result.success) {
        rows.push(result.data)
      } else {
        errs.push(`Row ${i + 1}: ${result.error.issues.map((e) => e.message).join(', ')}`)
      }
    }

    setParsed(rows.length > 0 ? rows : null)
    setParseErrors(errs)
    setResults(null)
  }

  async function submitAll() {
    if (!parsed?.length) return
    setSubmitting(true)
    const batchResults: BatchResult[] = []
    for (const row of parsed) {
      await new Promise((r) => setTimeout(r, 400)) // Notion 3 req/s safety margin
      try {
        const res = await createOrder.mutateAsync({
          customer_name: row.name,
          phone: row.phone,
          address: row.address,
          pincode: row.pincode,
          items: [{ product: row.product, quantity: row.qty, unit_price: row.amount / row.qty }],
          total_amount: row.amount,
          order_type: 'Distributor',
          payment_method: 'Bank Transfer',
          payment_status: 'Not Paid',
        })
        batchResults.push({ row, success: true, orderId: res.order_id })
      } catch {
        batchResults.push({ row, success: false, error: 'API error' })
      }
    }
    setSubmitting(false)
    setResults(batchResults)
    const ok = batchResults.filter((r) => r.success).length
    const fail = batchResults.length - ok
    if (fail === 0) toast.success(`${ok} orders created`)
    else toast.error(`${ok} created, ${fail} failed`)
  }

  return (
    <div className="space-y-4">
      <div className="bg-cream rounded-xl border border-surface p-4 space-y-3">
        <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">CSV Format</h3>
        <p className="text-xs text-ink/50 font-mono bg-linen border border-surface rounded-lg p-2">
          name,phone,product,qty,address,pincode,amount
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs border border-surface px-3 py-1.5 rounded-lg text-ink/70 hover:border-gold/50"
          >
            <Upload size={13} /> Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
        </div>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste CSV rows here (one order per line)…"
          rows={6}
          className="input-field w-full resize-none font-mono text-xs"
        />
        <button
          type="button"
          onClick={parseCsv}
          disabled={!csvText.trim()}
          className="px-4 py-2 bg-espresso text-on-dark rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Parse & Preview
        </button>
      </div>

      {parseErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-700 mb-2">Parse errors ({parseErrors.length})</p>
          <ul className="space-y-1">
            {parseErrors.map((e, i) => (
              <li key={i} className="text-xs text-red-600">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {parsed && parsed.length > 0 && !results && (
        <div className="bg-cream rounded-xl border border-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-espresso text-on-dark">
                <tr>
                  {['Name', 'Phone', 'Product', 'Qty', 'Pincode', 'Amount'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {parsed.map((row, i) => (
                  <tr key={i} className="bg-cream">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2 font-mono">{row.phone}</td>
                    <td className="px-3 py-2">{row.product}</td>
                    <td className="px-3 py-2 text-center">{row.qty}</td>
                    <td className="px-3 py-2">{row.pincode}</td>
                    <td className="px-3 py-2 font-semibold text-espresso">{formatINR(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-surface flex items-center justify-between">
            <p className="text-xs text-ink/50">{parsed.length} orders ready to submit</p>
            <button
              type="button"
              onClick={submitAll}
              disabled={submitting}
              className="px-5 py-2 bg-espresso text-on-dark rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? `Submitting…` : `Submit All (${parsed.length})`}
            </button>
          </div>
        </div>
      )}

      {results && (
        <div className="bg-cream rounded-xl border border-surface overflow-hidden">
          <div className="p-4 border-b border-surface">
            <p className="text-sm font-semibold text-ink">
              ✓ {results.filter((r) => r.success).length} created
              {results.filter((r) => !r.success).length > 0 && (
                <span className="text-red-600 ml-2">
                  ✗ {results.filter((r) => !r.success).length} failed
                </span>
              )}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-espresso text-on-dark">
                <tr>
                  {['Name', 'Phone', 'Result', 'Order ID'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {results.map((r, i) => (
                  <tr key={i} className="bg-cream">
                    <td className="px-3 py-2">{r.row.name}</td>
                    <td className="px-3 py-2 font-mono">{r.row.phone}</td>
                    <td className="px-3 py-2">
                      <span className={r.success ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {r.success ? '✓ OK' : `✗ ${r.error}`}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-ink/60">{r.orderId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-surface">
            <button onClick={() => { setParsed(null); setResults(null); setCsvText('') }} className="text-sm text-espresso underline">
              Start new batch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────────────────

export default function BulkEntryPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabId>('single')
  const [autoSendInvoice, setAutoSendInvoice] = useState(true)

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Bulk Entry" />
      <main className="max-w-3xl mx-auto px-4 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-1 bg-surface p-1 rounded-xl w-fit">
            {(['single', 'csv'] as TabId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? 'bg-cream text-ink shadow-sm' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {t === 'single' ? 'Single Customer' : 'CSV Batch'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSendInvoice}
              onChange={(e) => setAutoSendInvoice(e.target.checked)}
              className="w-4 h-4 accent-espresso"
            />
            <span className="text-xs text-ink/60">Auto-send invoice when email provided</span>
          </label>
        </div>

        {tab === 'single' ? <SingleCustomerTab autoSendInvoice={autoSendInvoice} /> : <CsvBatchTab />}
      </main>
    </div>
  )
}
