import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Nav from '../components/Nav'

interface Channel {
  group: string
  label: string
  source: string
  medium: string
  campaign: string
  notes?: string
}

const CHANNELS: Channel[] = [
  // Broadcast / public post
  { group: 'Broadcast', label: 'Instagram Bio',           source: 'instagram', medium: 'bio',         campaign: 'bio_instagram',         notes: '@dietswad bio link' },
  { group: 'Broadcast', label: 'Instagram Story',         source: 'instagram', medium: 'story',       campaign: 'story_instagram'        },
  { group: 'Broadcast', label: 'Google Business Profile', source: 'google',    medium: 'gmb',         campaign: 'gmb_google',            notes: 'GMB listing website link' },
  { group: 'Broadcast', label: 'WhatsApp (menu/broadcast)',source: 'whatsapp', medium: 'menu',        campaign: 'menu_whatsapp',         notes: 'WA Business catalog link' },
  { group: 'Broadcast', label: 'Facebook Page',           source: 'facebook',  medium: 'page',        campaign: 'page_facebook'          },
  { group: 'Broadcast', label: 'Email Signature',         source: 'email',     medium: 'signature',   campaign: 'signature_email'        },
  { group: 'Broadcast', label: 'YouTube Description',     source: 'youtube',   medium: 'description', campaign: 'description_youtube'    },
  { group: 'Broadcast', label: 'Offline / In-Person',     source: 'offline',   medium: 'inperson',    campaign: 'inperson_offline',      notes: 'Printed QR, business cards' },
  // 1-to-1 share
  { group: '1-to-1 Share', label: 'Instagram DM',         source: 'instagram', medium: 'dm',          campaign: 'share_instagram'        },
  { group: '1-to-1 Share', label: 'Facebook Messenger',   source: 'facebook',  medium: 'messenger',   campaign: 'share_facebook'         },
  { group: '1-to-1 Share', label: 'WhatsApp Chat',         source: 'whatsapp',  medium: 'chat',        campaign: 'share_whatsapp'         },
  { group: '1-to-1 Share', label: 'Direct / Other',        source: 'direct',    medium: 'other',       campaign: 'share_direct'           },
  // Manual order flows
  { group: 'Manual Order', label: 'Manual Order — Instagram', source: 'instagram', medium: 'dm',    campaign: 'order_instagram' },
  { group: 'Manual Order', label: 'Manual Order — WhatsApp',  source: 'whatsapp',  medium: 'chat',  campaign: 'order_whatsapp'  },
]

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
