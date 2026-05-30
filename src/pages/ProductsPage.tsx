import { useState } from 'react'
import { Plus, Edit3, X, Check } from 'lucide-react'
import Nav from '../components/Nav'
import { useProducts, useUpdateProduct, useCreateProduct } from '../hooks/useProducts'
import { useToast } from '../components/ToastProvider'
import { formatINR } from '../utils/format'
import type { Product } from '../api/products'

// ── Edit drawer ──────────────────────────────────────────────────────────────

function EditDrawer({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const toast = useToast()
  const updateProduct = useUpdateProduct()
  const [price, setPrice] = useState(String(product.price))
  const [isActive, setIsActive] = useState(product.IsActive)
  const [showOnWebsite, setShowOnWebsite] = useState(product.ShowOnWebsite)

  async function handleSave() {
    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error('Enter a valid price')
      return
    }
    try {
      await updateProduct.mutateAsync({
        name: product.name,
        price: parsedPrice,
        IsActive: isActive,
        ShowOnWebsite: showOnWebsite,
      })
      toast.success(`${product.name} updated`)
      onClose()
    } catch {
      toast.error('Failed to update product')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-cream w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border border-surface p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink text-sm truncate pr-4">{product.name}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="text-xs text-ink/50 mb-1 block">Price (₹)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <Toggle label="Active (shows in app picker)" checked={isActive} onChange={setIsActive} />
          <Toggle label="Show on website" checked={showOnWebsite} onChange={setShowOnWebsite} />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="flex-1 py-2.5 bg-espresso text-on-dark rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {updateProduct.isPending ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 bg-surface text-ink rounded-xl text-sm font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── New product form ─────────────────────────────────────────────────────────

function NewProductForm({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const createProduct = useCreateProduct()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [showOnWebsite, setShowOnWebsite] = useState(false)

  async function handleCreate() {
    if (!name.trim()) { toast.error('Product name is required'); return }
    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) { toast.error('Enter a valid price'); return }
    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        price: parsedPrice,
        display_order: displayOrder ? parseInt(displayOrder) : undefined,
        IsActive: isActive,
        ShowOnWebsite: showOnWebsite,
      })
      toast.success(`${name.trim()} added`)
      onClose()
    } catch {
      toast.error('Failed to add product')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-cream w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border border-surface p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink text-sm">New Product</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name *"
          className="input-field w-full"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Price (₹) *</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="text-xs text-ink/50 mb-1 block">Display order</label>
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="e.g. 10"
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Toggle label="Active (shows in app picker)" checked={isActive} onChange={setIsActive} />
          <Toggle label="Show on website" checked={showOnWebsite} onChange={setShowOnWebsite} />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleCreate}
            disabled={createProduct.isPending}
            className="flex-1 py-2.5 bg-espresso text-on-dark rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {createProduct.isPending ? 'Adding…' : 'Add Product'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 bg-surface text-ink rounded-xl text-sm font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toggle helper ────────────────────────────────────────────────────────────

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm text-ink/70">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-espresso' : 'bg-surface'}`}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { data: products = [], isLoading, isError } = useProducts()
  const [editing, setEditing] = useState<Product | null>(null)
  const [showNew, setShowNew] = useState(false)

  const sorted = [...products].sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Products" />

      <main className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-ink/40">{products.length} products</p>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-espresso text-on-dark rounded-lg hover:bg-espresso-light transition-colors"
          >
            <Plus size={15} /> New product
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-ink/40 text-sm py-12">Loading products…</p>
        )}
        {isError && (
          <p className="text-center text-red-600 text-sm py-12">Failed to load products.</p>
        )}

        {!isLoading && !isError && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-surface">
              <table className="w-full text-sm">
                <thead className="bg-espresso text-on-dark">
                  <tr>
                    {['#', 'Name', 'Price', 'Active', 'On Website', ''].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface">
                  {sorted.map((p) => (
                    <tr key={p.name} className="bg-cream hover:bg-linen">
                      <td className="px-3 py-2.5 text-xs text-ink/30">{p.display_order}</td>
                      <td className="px-3 py-2.5 font-medium text-ink">
                        {p.name}
                        {p.IsLegacy && (
                          <span className="ml-2 text-xs bg-surface text-ink/40 px-1.5 py-0.5 rounded">Legacy</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-espresso whitespace-nowrap">
                        {p.price > 0 ? formatINR(p.price) : <span className="text-ink/30">—</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusDot on={p.IsActive} />
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusDot on={p.ShowOnWebsite} />
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => setEditing(p)}
                          className="text-ink/40 hover:text-espresso p-1"
                        >
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden flex flex-col gap-3">
              {sorted.map((p) => (
                <div
                  key={p.name}
                  className="bg-cream rounded-xl border border-surface p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">
                      {p.name}
                      {p.IsLegacy && (
                        <span className="ml-2 text-xs bg-surface text-ink/40 px-1.5 py-0.5 rounded">Legacy</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-espresso">
                        {p.price > 0 ? formatINR(p.price) : '—'}
                      </span>
                      <span className={`text-xs ${p.IsActive ? 'text-green-600' : 'text-ink/30'}`}>
                        {p.IsActive ? 'Active' : 'Inactive'}
                      </span>
                      {p.ShowOnWebsite && (
                        <span className="text-xs text-blue-600">Web</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(p)}
                    className="text-ink/40 hover:text-espresso p-2 flex-shrink-0"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {editing && <EditDrawer product={editing} onClose={() => setEditing(null)} />}
      {showNew && <NewProductForm onClose={() => setShowNew(false)} />}
    </div>
  )
}

function StatusDot({ on }: { on: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${on ? 'text-green-600' : 'text-ink/30'}`}>
      {on ? <Check size={13} /> : <X size={13} />}
    </span>
  )
}
