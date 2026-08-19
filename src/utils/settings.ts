import { SHORTENER_CHANNELS } from './channels'

export interface ChannelOverride {
  websiteUrl: string
  orderFormUrl: string
}

export interface Settings {
  // §1 Default Link Configuration
  websiteUrl: string
  orderFormUrl: string
  // §2 Review & Payment
  googleReviewLink: string
  upiId: string
  upiNumber: string
  // §3 Channel-Specific Overrides (keyed by channel id)
  channelOverrides: Record<string, ChannelOverride>
  // §4 Shortener API
  shortenerApiBaseUrl: string
  // §5 Preferences
  pushEnabled: boolean
}

const SETTINGS_KEY = 'ds_settings'

export const DEFAULT_SETTINGS: Settings = {
  websiteUrl: 'https://dietswad.in',
  orderFormUrl: 'https://dietswad.in/order',
  googleReviewLink: 'https://g.page/r/CQpGhnIHTj1QEBM/review',
  upiId: 'rinkuguptarrr@okicici',
  upiNumber: '9830193006',
  channelOverrides: {
    instagram: { websiteUrl: '', orderFormUrl: '' },
    facebook:  { websiteUrl: '', orderFormUrl: '' },
    whatsapp:  { websiteUrl: '', orderFormUrl: '' },
    google:    { websiteUrl: '', orderFormUrl: '' },
    offline:   { websiteUrl: '', orderFormUrl: '' },
    direct:    { websiteUrl: '', orderFormUrl: '' },
  },
  shortenerApiBaseUrl: 'https://api.dietswad.in/api',
  pushEnabled: false,
}

function deepCloneDefaults(): Settings {
  return {
    ...DEFAULT_SETTINGS,
    channelOverrides: JSON.parse(JSON.stringify(DEFAULT_SETTINGS.channelOverrides)),
  }
}

export function getSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return deepCloneDefaults()
    const parsed = JSON.parse(stored)
    // Merge to fill any keys added after last save
    return {
      ...deepCloneDefaults(),
      ...parsed,
      channelOverrides: {
        ...deepCloneDefaults().channelOverrides,
        ...(parsed.channelOverrides ?? {}),
      },
    }
  } catch {
    return deepCloneDefaults()
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

export function resetSettings(): Settings {
  const fresh = deepCloneDefaults()
  saveSettings(fresh)
  return fresh
}

// ── Share-link helpers ────────────────────────────────────────────────────────

export interface ChannelConfig {
  id: string
  label: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

/**
 * Share Link channels.
 *
 * `utmSource` / `utmMedium` are DERIVED from SHORTENER_CHANNELS in utils/channels.ts so the two
 * screens can never drift apart — that file is the single source of truth for channel identity.
 * Only the id → channel-id mapping and the campaign name live here.
 *
 * `utmCampaign` is taken from the shortener channel's `default_campaign` so the Share Link screen
 * and the Shortener screen emit the SAME campaign name for the same channel. Two of them used to
 * disagree (Google Business `share_google` vs `gmb_google`; Offline `share_offline` vs
 * `inperson_offline`), which split each channel into two rows in the Unified dashboard's
 * campaign_attribution. Aligned to the shortener's names on 2026-08-19 by Pritam's decision —
 * those are the values `UtmSummaryPage` already documents to the team as canonical.
 *
 * To add a channel: add it to SHORTENER_CHANNELS in utils/channels.ts, then reference its id here.
 * Never hardcode a source/medium/campaign in this file.
 */
const SHARE_CHANNEL_MAP: Array<{ id: string; label: string; shortenerId: string }> = [
  { id: 'instagram', label: 'Instagram DM',        shortenerId: 'ig-dm'   },
  { id: 'facebook',  label: 'Facebook Messenger',  shortenerId: 'fb-msg'  },
  { id: 'whatsapp',  label: 'WhatsApp Chat',       shortenerId: 'wa-chat' },
  { id: 'google',    label: 'Google My Business',  shortenerId: 'gmb'     },
  { id: 'offline',   label: 'In-Person / Offline', shortenerId: 'offline' },
  { id: 'direct',    label: 'Other / General',     shortenerId: 'direct'  },
]

export const SHARE_CHANNELS: ChannelConfig[] = SHARE_CHANNEL_MAP.map((m) => {
  const src = SHORTENER_CHANNELS.find((c) => c.id === m.shortenerId)
  if (!src) throw new Error(`SHARE_CHANNELS: no shortener channel with id "${m.shortenerId}"`)
  return {
    id: m.id,
    label: m.label,
    utmSource: src.utm_source,
    utmMedium: src.utm_medium,
    utmCampaign: src.default_campaign,
  }
})

export function buildShareUrl(baseUrl: string, channel: ChannelConfig): string {
  try {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', channel.utmSource)
    url.searchParams.set('utm_medium', channel.utmMedium)
    url.searchParams.set('utm_campaign', channel.utmCampaign)
    return url.toString()
  } catch {
    return baseUrl
  }
}

export function isValidUrl(val: string): boolean {
  if (!val) return true // empty = use default, not an error
  try {
    const u = new URL(val)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
