import { useNavigate } from 'react-router-dom'
import { MessageCircle, Facebook, Phone, MapPin, UserCheck, HelpCircle } from 'lucide-react'
import Nav from '../../components/Nav'
import { SHARE_CHANNELS } from '../../utils/settings'

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  instagram: MessageCircle,
  facebook:  Facebook,
  whatsapp:  Phone,
  google:    MapPin,
  offline:   UserCheck,
  direct:    HelpCircle,
}

export default function ShareLinkChannelSelectPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Share Link" />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-ink">Select Channel</h2>
          <p className="text-sm text-ink/50 mt-0.5">
            Generates UTM-tagged links + payment details for 1:1 customer chats
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SHARE_CHANNELS.map((ch) => {
            const Icon = CHANNEL_ICONS[ch.id] ?? HelpCircle
            return (
              <button
                key={ch.id}
                onClick={() => navigate(`/share-link/${ch.id}`)}
                className="
                  group flex flex-col items-center justify-center gap-2.5
                  bg-cream rounded-2xl p-5 shadow-sm border border-surface
                  hover:shadow-md hover:border-gold/40 active:scale-[0.97]
                  transition-all duration-150
                "
              >
                <div className="w-12 h-12 bg-espresso/8 rounded-xl flex items-center justify-center group-hover:bg-espresso group-hover:text-gold transition-colors">
                  <Icon size={22} strokeWidth={1.75} className="text-espresso group-hover:text-gold transition-colors" />
                </div>
                <p className="text-sm font-semibold text-ink text-center leading-tight">{ch.label}</p>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
