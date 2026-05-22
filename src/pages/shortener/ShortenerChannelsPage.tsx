import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import Nav from '../../components/Nav'
import {
  SHORTENER_CHANNELS,
  CHANNEL_GROUP_LABELS,
  type ChannelGroup,
} from '../../utils/channels'

const GROUP_ORDER: ChannelGroup[] = ['broadcast', 'share', 'order']

const GROUP_EMOJIS: Record<ChannelGroup, string> = {
  broadcast: '📣',
  share: '💬',
  order: '🛒',
}

export default function ShortenerChannelsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Channel Templates" />

      <main className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/shortener')}
          className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-5"
        >
          <ChevronLeft size={16} /> All links
        </button>

        <p className="text-sm text-ink/60 mb-6">
          Pick a channel to create a short link with UTM parameters pre-filled. Tap any tile
          to open the link creator.
        </p>

        {GROUP_ORDER.map((group) => {
          const channels = SHORTENER_CHANNELS.filter((c) => c.group === group)
          return (
            <div key={group} className="mb-6">
              <h2 className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-2 px-1">
                {GROUP_EMOJIS[group]} {CHANNEL_GROUP_LABELS[group]}
              </h2>

              <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/5 overflow-hidden">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => navigate(`/shortener/new?channel=${ch.id}`)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-linen/70 transition-colors group"
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-sm font-medium text-ink">{ch.label}</p>
                      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
                        {[ch.utm_source, ch.utm_medium, ch.default_campaign].map((v, i) => (
                          <span key={i} className="text-xs font-mono text-ink/40">{v}</span>
                        )).reduce<React.ReactNode[]>((acc, el, i) => {
                          if (i > 0) acc.push(<span key={`sep-${i}`} className="text-xs text-ink/20">/</span>)
                          acc.push(el)
                          return acc
                        }, [])}
                      </div>
                      {ch.note && (
                        <p className="text-xs text-ink/40 mt-0.5">{ch.note}</p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-ink/30 group-hover:text-espresso transition-colors flex-shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        <p className="text-xs text-ink/40 text-center mt-2">
          {SHORTENER_CHANNELS.length} channel templates · UTM standard: {'{flow}_{channel}'}
        </p>
      </main>
    </div>
  )
}
