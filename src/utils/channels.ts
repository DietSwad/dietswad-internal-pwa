export type ChannelGroup = 'broadcast' | 'share' | 'order'

export interface ShortenerChannel {
  id: string
  label: string
  group: ChannelGroup
  utm_source: string
  utm_medium: string
  default_campaign: string
  note: string
}

export const SHORTENER_CHANNELS: ShortenerChannel[] = [
  // Broadcast / public post (8)
  { id: 'ig-bio',    label: 'Instagram Bio',              group: 'broadcast', utm_source: 'instagram', utm_medium: 'bio',         default_campaign: 'bio_instagram',     note: 'Goes on @dietswad bio' },
  { id: 'ig-story',  label: 'Instagram Story',            group: 'broadcast', utm_source: 'instagram', utm_medium: 'story',       default_campaign: 'story_instagram',   note: 'Default campaign; override per story' },
  { id: 'gmb',       label: 'Google Business Profile',    group: 'broadcast', utm_source: 'google',    utm_medium: 'gmb',         default_campaign: 'gmb_google',        note: 'Website link on GMB listing' },
  { id: 'wa-menu',   label: 'WhatsApp Menu / Broadcast',  group: 'broadcast', utm_source: 'whatsapp',  utm_medium: 'menu',        default_campaign: 'menu_whatsapp',     note: 'WhatsApp Business catalog link' },
  { id: 'fb-page',   label: 'Facebook Page',              group: 'broadcast', utm_source: 'facebook',  utm_medium: 'page',        default_campaign: 'page_facebook',     note: 'Page bio / about-section link' },
  { id: 'email-sig', label: 'Email Signature',            group: 'broadcast', utm_source: 'email',     utm_medium: 'signature',   default_campaign: 'signature_email',   note: "Team's email signature" },
  { id: 'youtube',   label: 'YouTube Description',        group: 'broadcast', utm_source: 'youtube',   utm_medium: 'description', default_campaign: 'description_youtube', note: 'Under-video links' },
  { id: 'offline',   label: 'Offline / In-Person',        group: 'broadcast', utm_source: 'offline',   utm_medium: 'inperson',    default_campaign: 'inperson_offline',  note: 'Printed QR, business cards' },

  // 1-to-1 share (4)
  { id: 'ig-dm',   label: 'Instagram DM',       group: 'share', utm_source: 'instagram', utm_medium: 'dm',       default_campaign: 'share_instagram', note: 'Personal DM shares' },
  { id: 'fb-msg',  label: 'Facebook Messenger', group: 'share', utm_source: 'facebook',  utm_medium: 'messenger', default_campaign: 'share_facebook',  note: 'Messenger shares' },
  { id: 'wa-chat', label: 'WhatsApp Chat',       group: 'share', utm_source: 'whatsapp',  utm_medium: 'chat',     default_campaign: 'share_whatsapp',  note: 'Personal WhatsApp shares' },
  { id: 'direct',  label: 'Direct / Other',      group: 'share', utm_source: 'direct',    utm_medium: 'other',    default_campaign: 'share_direct',    note: 'Fallback' },

  // Manual order flows (2)
  { id: 'order-ig', label: 'Manual Order — Instagram', group: 'order', utm_source: 'instagram', utm_medium: 'dm',   default_campaign: 'order_instagram', note: 'Order form link via Instagram DM' },
  { id: 'order-wa', label: 'Manual Order — WhatsApp',  group: 'order', utm_source: 'whatsapp',  utm_medium: 'chat', default_campaign: 'order_whatsapp',  note: 'Order form link via WhatsApp' },
]

export function buildUtmUrl(
  baseUrl: string,
  utm: { source: string; medium: string; campaign: string }
): string {
  const url = new URL(baseUrl)
  if (utm.source)   url.searchParams.set('utm_source', utm.source)
  if (utm.medium)   url.searchParams.set('utm_medium', utm.medium)
  if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign)
  return url.toString()
}

export const CHANNEL_GROUP_LABELS: Record<ChannelGroup, string> = {
  broadcast: 'Broadcast / Public',
  share: 'One-to-One Share',
  order: 'Manual Order Flows',
}
