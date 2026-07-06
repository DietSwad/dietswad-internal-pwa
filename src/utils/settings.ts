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
}

export const SHARE_CHANNELS: ChannelConfig[] = [
  { id: 'instagram', label: 'Instagram DM',      utmSource: 'instagram', utmMedium: 'dm'        },
  { id: 'facebook',  label: 'Facebook Messenger', utmSource: 'facebook',  utmMedium: 'messenger' },
  { id: 'whatsapp',  label: 'WhatsApp Chat',       utmSource: 'whatsapp',  utmMedium: 'chat'      },
  { id: 'google',    label: 'Google My Business',  utmSource: 'google',    utmMedium: 'gmb'       },
  { id: 'offline',   label: 'In-Person / Offline', utmSource: 'offline',   utmMedium: 'inperson'  },
  { id: 'direct',    label: 'Other / General',      utmSource: 'direct',    utmMedium: 'other'     },
]

export function buildShareUrl(baseUrl: string, channel: ChannelConfig): string {
  try {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', channel.utmSource)
    url.searchParams.set('utm_medium', channel.utmMedium)
    url.searchParams.set('utm_campaign', `share_${channel.id}`)
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
