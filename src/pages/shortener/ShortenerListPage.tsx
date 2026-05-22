import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Trash2, Share2, ChevronDown, ChevronUp, Grid3X3,
} from 'lucide-react'
import Nav from '../../components/Nav'
import CopyButton from '../../components/CopyButton'
import { useShortUrlsList, useDeleteShortUrl } from '../../hooks/useShortener'
import { useToast } from '../../components/ToastProvider'
import { formatDate } from '../../utils/format'
import type { ShortUrl } from '../../api/shortener'

type SortKey = 'clicks' | 'created_at' | 'last_clicked'
type SortDir = 'asc' | 'desc'

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

function SortBtn({
  label, sortKey, current, dir, onToggle,
}: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onToggle: (k: SortKey) => void }) {
  const active = current === sortKey
  return (
    <button
      onClick={() => onToggle(sortKey)}
      className={`flex items-center gap-0.5 text-xs px-2 py-1 rounded border transition-colors ${
        active ? 'border-espresso text-espresso bg-espresso/5' : 'border-ink/10 text-ink/50'
      }`}
    >
      {label}
      {active && (dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
    </button>
  )
}

export default function ShortenerListPage() {
  const navigate = useNavigate()
  const { data: urls = [], isLoading, error } = useShortUrlsList()
  const deleteMut = useDeleteShortUrl()
  const { success: toastSuccess, error: toastError } = useToast()

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return urls
      .filter(
        (u) =>
          u.short_code.toLowerCase().includes(q) ||
          u.short_url.toLowerCase().includes(q) ||
          u.original_url.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = (a[sortKey] as string | number) ?? 0
        const bv = (b[sortKey] as string | number) ?? 0
        const cmp =
          typeof av === 'number'
            ? av - (bv as number)
            : String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [urls, search, sortKey, sortDir])

  async function handleDelete(code: string) {
    try {
      await deleteMut.mutateAsync(code)
      toastSuccess('Short URL deleted')
      setConfirmDelete(null)
    } catch {
      toastError('Delete failed')
    }
  }

  async function handleShare(url: ShortUrl) {
    if (navigator.share) {
      await navigator.share({ url: url.short_url, title: 'Diet Swad link' }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url.short_url)
      toastSuccess('Link copied!')
    }
  }

  const empty = (
    <div className="text-center py-12 text-ink/40 text-sm">
      {search ? 'No results for that search.' : 'No short links yet — create your first one!'}
    </div>
  )

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="URL Shortener" />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Toolbar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes or URLs…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-espresso/30"
            />
          </div>
          <button
            onClick={() => navigate('/shortener/channels')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-ink/10 bg-white text-ink hover:bg-ink/5 whitespace-nowrap"
          >
            <Grid3X3 size={15} />
            <span className="hidden sm:inline">Channels</span>
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">Failed to load links. Try refreshing.</p>
        )}

        {/* Desktop table */}
        {!isLoading && (
          <div className="hidden sm:block bg-white rounded-xl border border-ink/10 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-espresso/5 text-ink/50 text-xs uppercase tracking-wide">
                <tr>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:text-ink"
                    onClick={() => toggleSort('created_at')}
                  >
                    Short code {sortKey === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:text-ink whitespace-nowrap"
                    onClick={() => toggleSort('clicks')}
                  >
                    Clicks {sortKey === 'clicks' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:text-ink whitespace-nowrap"
                    onClick={() => toggleSort('last_clicked')}
                  >
                    Last click {sortKey === 'last_clicked' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-ink/40 text-sm">
                      {search ? 'No results.' : 'No short links yet — create your first one!'}
                    </td>
                  </tr>
                )}
                {filtered.map((url) => (
                  <tr
                    key={url.short_code}
                    className="hover:bg-linen/60 cursor-pointer"
                    onClick={() => navigate(`/shortener/${url.short_code}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-espresso bg-espresso/10 px-1.5 py-0.5 rounded">
                        {url.short_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/60 text-xs max-w-xs">
                      {truncate(url.original_url, 65)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{url.clicks ?? 0}</td>
                    <td className="px-4 py-3 text-right text-ink/40 text-xs">
                      {url.last_clicked ? formatDate(url.last_clicked) : '—'}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <CopyButton value={url.short_url} />
                        <button
                          onClick={() => handleShare(url)}
                          className="text-ink/40 hover:text-espresso transition-colors"
                          title="Share"
                        >
                          <Share2 size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(url.short_code)}
                          className="text-ink/40 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!isLoading && (
          <div className="sm:hidden space-y-3">
            {filtered.length === 0 && empty}
            {filtered.map((url) => (
              <div key={url.short_code} className="bg-white rounded-xl border border-ink/10 p-4">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/shortener/${url.short_code}`)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold text-espresso bg-espresso/10 px-2 py-0.5 rounded">
                      {url.short_code}
                    </span>
                    <span className="text-xs text-ink/50">{url.clicks ?? 0} clicks</span>
                  </div>
                  <p className="text-xs text-ink/60 break-all leading-relaxed">
                    {truncate(url.original_url, 80)}
                  </p>
                  {url.created_at && (
                    <p className="text-xs text-ink/40 mt-1">{formatDate(url.created_at)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ink/5">
                  <CopyButton value={url.short_url} label="Copy" />
                  <button
                    onClick={() => handleShare(url)}
                    className="flex items-center gap-1 text-sm text-ink/50 hover:text-espresso"
                  >
                    <Share2 size={14} /> Share
                  </button>
                  <button
                    onClick={() => setConfirmDelete(url.short_code)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 ml-auto"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-ink/10 h-20 animate-pulse" />
            ))}
          </div>
        )}

        {/* Mobile sort */}
        {!isLoading && urls.length > 1 && (
          <div className="sm:hidden flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-ink/40">Sort:</span>
            <SortBtn label="Clicks"      sortKey="clicks"       current={sortKey} dir={sortDir} onToggle={toggleSort} />
            <SortBtn label="Date"        sortKey="created_at"   current={sortKey} dir={sortDir} onToggle={toggleSort} />
            <SortBtn label="Last click"  sortKey="last_clicked" current={sortKey} dir={sortDir} onToggle={toggleSort} />
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => navigate('/shortener/new')}
        className="fixed bottom-6 right-6 bg-espresso text-linen w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-espresso/90 active:scale-95 transition-transform z-10"
        aria-label="New short link"
      >
        <Plus size={24} />
      </button>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-ink mb-2">Delete short link?</h3>
            <p className="text-sm text-ink/60 mb-5">
              <span className="font-mono font-medium text-espresso">
                dietswad.in/{confirmDelete}
              </span>{' '}
              will stop working. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-ink/10 text-sm text-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
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
