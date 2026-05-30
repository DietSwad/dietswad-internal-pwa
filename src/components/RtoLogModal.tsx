import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import {
  RtoLogSchema,
  type RtoLogFormValues,
  DELIVERY_OUTCOME_OPTIONS,
  RTO_REASON_OPTIONS,
} from '../utils/zodSchemas'

interface RtoLogModalProps {
  orderId: string
  isOpen: boolean
  isPending: boolean
  onClose: () => void
  onSubmit: (values: RtoLogFormValues) => void
}

export default function RtoLogModal({ orderId, isOpen, isPending, onClose, onSubmit }: RtoLogModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RtoLogFormValues>({
    resolver: zodResolver(RtoLogSchema),
    defaultValues: { rto_shipping_cost: 0 },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-cream rounded-2xl border border-surface w-full max-w-md max-h-[90dvh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-surface">
          <h2 className="font-semibold text-ink">Log RTO / Failed Delivery</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          <p className="text-xs text-ink/50 font-mono">{orderId}</p>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Outcome *</label>
            <select {...register('outcome')} className="input-field w-full">
              <option value="">Select outcome</option>
              {DELIVERY_OUTCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.outcome && <p className="text-red-600 text-xs mt-1">{errors.outcome.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Reason *</label>
            <select {...register('reason')} className="input-field w-full">
              <option value="">Select reason</option>
              {RTO_REASON_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.reason && <p className="text-red-600 text-xs mt-1">{errors.reason.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">
              RTO Shipping Cost (₹) *
              <span className="text-ink/40 font-normal ml-1">— what we pay to get the parcel back</span>
            </label>
            <input
              {...register('rto_shipping_cost')}
              type="number"
              min={0}
              placeholder="e.g. 100"
              className="input-field w-full"
              inputMode="numeric"
            />
            {errors.rto_shipping_cost && <p className="text-red-600 text-xs mt-1">{errors.rto_shipping_cost.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Carrier Return Tracking ID</label>
            <input {...register('rto_tracking_id')} placeholder="AWB / tracking number" className="input-field w-full" />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">RTO Date</label>
            <input type="date" {...register('rto_date')} className="input-field w-full" />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Notes</label>
            <textarea {...register('notes')} rows={2} placeholder="Any additional details…" className="input-field w-full resize-none" />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? 'Logging…' : 'Log RTO'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-surface text-ink rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
