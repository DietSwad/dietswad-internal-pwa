import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Copy, Check, Share2, Phone as PhoneIcon } from 'lucide-react'
import Nav from '../../components/Nav'
import {
  SHARE_CHANNELS,
  getSettings,
  buildShareUrl,
  type ChannelConfig,
} from '../../utils/settings'

// ── Copy-to-clipboard card ─────────────────────────────────────────────────────

function CopyCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text via execCommand
      const el = document.createElement('textarea')
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-cream rounded-xl border border-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-sm text-ink break-all">{value}</p>
          {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
        </div>
        <button
          onClick={copy}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-espresso/8 text-espresso hover:bg-espresso hover:text-on-dark'
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ShareLinkDisplayPage() {
  const { channelId } = useParams<{ channelId: string }>()
  const navigate = useNavigate()

  const channel = SHARE_CHANNELS.find((c) => c.id === channelId) as ChannelConfig | undefined
  if (!channel) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Share Link" />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-ink/50 text-sm">Channel not found.</p>
          <button onClick={() => navigate('/share-link')} className="mt-4 text-sm text-espresso underline">
            Back to channels
          </button>
        </div>
      </div>
    )
  }

  const settings = getSettings()
  const ov = settings.channelOverrides[channel.id] ?? { websiteUrl: '', orderFormUrl: '' }

  const websiteBase   = ov.websiteUrl   || settings.websiteUrl
  const orderFormBase = ov.orderFormUrl || settings.orderFormUrl

  const websiteUrl   = buildShareUrl(websiteBase,   channel)
  const orderFormUrl = buildShareUrl(orderFormBase,  channel)

  // Build Web Share bundle (all links + UPI)
  const shareBundle = [
    `🌐 Website: ${websiteUrl}`,
    `📦 Order Form: ${orderFormUrl}`,
    `⭐ Google Review: ${settings.googleReviewLink}`,
    `💳 UPI ID: ${settings.upiId}`,
    `📱 UPI Number: ${settings.upiNumber}`,
  ].join('\n')

  async function onNativeShare() {
    try {
      await navigator.share({ text: shareBundle, title: 'Diet Swad — Links' })
    } catch {
      // user cancelled or unsupported — silently ignore
    }
  }

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title={channel.label} />
      <main className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={16} /> Channels
        </button>

        <div className="mb-4 bg-espresso/5 border border-espresso/10 rounded-xl px-4 py-3">
          <p className="text-xs text-ink/60">
            UTMs applied: <code className="font-mono">utm_source={channel.utmSource}</code>,{' '}
            <code className="font-mono">utm_medium={channel.utmMedium}</code>,{' '}
            <code className="font-mono">utm_campaign={channel.utmCampaign}</code>
          </p>
        </div>

        <div className="space-y-3">
          <CopyCard
            label="Website"
            value={websiteUrl}
            hint="With UTM tracking"
          />
          <CopyCard
            label="Order Form"
            value={orderFormUrl}
            hint="With UTM tracking"
          />
          <CopyCard
            label="Google Review"
            value={settings.googleReviewLink}
            hint="No UTM — Google doesn't support query params on review URLs"
          />
          <CopyCard
            label="UPI ID"
            value={settings.upiId}
          />
          <div className="bg-cream rounded-xl border border-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">UPI Number</p>
                <p className="text-sm text-ink">{settings.upiNumber}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a
                  href={`tel:${settings.upiNumber}`}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-espresso/8 text-espresso hover:bg-espresso hover:text-on-dark transition-colors"
                >
                  <PhoneIcon size={13} /> Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {'share' in navigator && (
          <button
            onClick={onNativeShare}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-gold text-espresso rounded-xl font-semibold text-sm hover:bg-gold-dark transition-colors"
          >
            <Share2 size={16} />
            Share All Links
          </button>
        )}
      </main>
    </div>
  )
}
