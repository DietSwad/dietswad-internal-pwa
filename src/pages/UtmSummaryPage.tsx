import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Nav from '../components/Nav'
import { SHORTENER_CHANNELS, type ChannelGroup } from '../utils/channels'

interface Channel {
  group: string
  label: string
  source: string
  medium: string
  campaign: string
  notes?: string
}

// Derived from SHORTENER_CHANNELS (utils/channels.ts) — the single source of truth for channel
// identity. This page is the team's read-only reference; when it was a hand-maintained second
// copy it could silently drift from the links the shortener actually produces, so staff would be
// documenting one thing while the tool emitted another. Now it cannot.
const GROUP_LABEL: Record<ChannelGroup, string> = {
  broadcast: 'Broadcast',
  share: '1-to-1 Share',
  order: 'Manual Order',
}

const CHANNELS: Channel[] = SHORTENER_CHANNELS.map((c) => ({
  group: GROUP_LABEL[c.group],
  label: c.label,
  source: c.utm_source,
  medium: c.utm_medium,
  campaign: c.default_campaign,
  notes: c.note,
}))

const GROUPS = ['Broadcast', '1-to-1 Share', 'Manual Order'] as const

export default function UtmSummaryPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="UTM Summary" />
      <main className="max-w-3xl mx-auto px-4 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={16} /> Settings
        </button>

        <p className="text-xs text-ink/50 mb-5">
          Read-only reference. Campaign format: <code className="font-mono bg-surface px-1 rounded">{'{flow}_{channel}'}</code>.
          Append a date suffix for time-bound campaigns (e.g. <code className="font-mono bg-surface px-1 rounded">launch_instagram_june</code>).
        </p>

        {GROUPS.map((group) => {
          const rows = CHANNELS.filter((c) => c.group === group)
          return (
            <section key={group} className="mb-5">
              <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-2">{group}</h3>
              <div className="bg-cream rounded-xl border border-surface overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-espresso text-on-dark">
                      <tr>
                        {['Channel', 'utm_source', 'utm_medium', 'utm_campaign (default)', 'Notes'].map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface">
                      {rows.map((c) => (
                        <tr key={c.label} className="bg-cream hover:bg-linen">
                          <td className="px-3 py-2 font-medium text-ink whitespace-nowrap">{c.label}</td>
                          <td className="px-3 py-2 font-mono text-ink/70">{c.source}</td>
                          <td className="px-3 py-2 font-mono text-ink/70">{c.medium}</td>
                          <td className="px-3 py-2 font-mono text-ink/70">{c.campaign}</td>
                          <td className="px-3 py-2 text-ink/40">{c.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
