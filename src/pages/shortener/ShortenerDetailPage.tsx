import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Trash2, Share2, Download } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import Nav from '../../components/Nav'
import CopyButton from '../../components/CopyButton'
import { useShortUrlStats, useDeleteShortUrl } from '../../hooks/useShortener'
import { useToast } from '../../components/ToastProvider'
import { formatDate } from '../../utils/format'

function parseUtm(url: string): Record<string, string> {
  try {
    const params = new URL(url).searchParams
    const out: Record<string, string> = {}
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = params.get(key)
      if (v) out[key] = v
    }
    return out
  } catch {
    return {}
  }
}

function downloadQr(code: string) {
  const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null
  if (!canvas) return
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `dietswad-${code}.png`
  link.click()
}

function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 px-4 py-3">
      <p className="text-xs text-ink/40 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-ink">{value ?? '—'}</p>
    </div>
  )
}

export default function ShortenerDetailPage() {
  const { code = '' } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const { data: stats, isLoading, error } = useShortUrlStats(code)
  const deleteMut = useDeleteShortUrl()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const shortUrl = stats?.short_url ?? `https://dietswad.in/${code}`

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(code)
      toastSuccess('Short URL deleted')
      navigate('/shortener', { replace: true })
    } catch {
      toastError('Delete failed')
    }
  }

  async function handleShare() {
    if (typeof navigator.share === 'function') {
      await navigator.share({ url: shortUrl }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(shortUrl)
      toastSuccess('Link copied!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Link Details" />
        <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-ink/10" />
          ))}
        </main>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Link Details" />
        <main className="max-w-lg mx-auto px-4 py-8 text-center">
          <p className="text-sm text-ink/50">
            Could not load details for{' '}
            <span className="font-mono text-espresso">{code}</span>.
          </p>
          <button
            onClick={() => navigate('/shortener')}
            className="mt-4 text-sm text-espresso underline"
          >
            Back to all links
          </button>
        </main>
      </div>
    )
  }

  const utm = parseUtm(stats.original_url)

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Link Details" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-10">
        <button
          onClick={() => navigate('/shortener')}
          className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink"
        >
          <ChevronLeft size={16} /> All links
        </button>

        {/* Short URL + actions */}
        <div className="bg-white rounded-2xl border border-ink/10 p-5">
          <p className="text-xs text-ink/40 mb-1">Short link</p>
          <p className="font-mono text-xl font-bold text-espresso break-all mb-4">{shortUrl}</p>

          <div className="flex gap-2 mb-5">
            <CopyButton
              value={shortUrl}
              label="Copy"
              className="flex-1 justify-center border border-espresso/30 rounded-xl py-2.5 text-espresso"
            />
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-ink/10 text-sm text-ink hover:bg-ink/5"
            >
              <Share2 size={15} /> Share
            </button>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-ink/5">
            <div className="p-4 bg-linen rounded-xl">
              <QRCodeCanvas
                id="qr-canvas"
                value={shortUrl}
                size={180}
                bgColor="#F5EDE0"
                fgColor="#2C1A0A"
              />
            </div>
            <button
              onClick={() => downloadQr(code)}
              className="flex items-center gap-1.5 text-sm text-espresso font-medium hover:text-espresso/70"
            >
              <Download size={15} /> Download QR PNG
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total clicks" value={stats.clicks} />
          <StatCard label="Days active" value={stats.days_active} />
          <StatCard
            label="Avg clicks / day"
            value={typeof stats.avg_daily_clicks === 'number' ? stats.avg_daily_clicks.toFixed(1) : '—'}
          />
          <StatCard
            label="Last clicked"
            value={stats.last_clicked ? formatDate(stats.last_clicked) : 'Never'}
          />
        </div>

        {/* Original URL + UTM breakdown */}
        <div className="bg-white rounded-xl border border-ink/10 px-4 py-3">
          <p className="text-xs text-ink/40 mb-1">Destination URL</p>
          <p className="text-xs text-ink/70 break-all leading-relaxed">{stats.original_url}</p>

          {Object.keys(utm).length > 0 && (
            <div className="mt-3 pt-3 border-t border-ink/5">
              <p className="text-xs font-medium text-ink/50 mb-2">UTM Parameters</p>
              <div className="space-y-1">
                {Object.entries(utm).map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-xs">
                    <span className="font-mono text-ink/40 min-w-[110px]">{k}</span>
                    <span className="text-ink/70">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-xl border border-ink/10 px-4 py-3 text-xs text-ink/50 space-y-1.5">
          <div className="flex justify-between">
            <span>Created</span>
            <span>{stats.created_at ? formatDate(stats.created_at) : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Last clicked</span>
            <span>{stats.last_clicked ? formatDate(stats.last_clicked) : 'Never'}</span>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 size={16} /> Delete this link
        </button>
      </main>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-ink mb-2">Delete short link?</h3>
            <p className="text-sm text-ink/60 mb-5">
              <span className="font-mono font-medium text-espresso">dietswad.in/{code}</span> will
              stop working. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-ink/10 text-sm text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMut.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
