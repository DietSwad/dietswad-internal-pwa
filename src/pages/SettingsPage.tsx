import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, BookOpen } from 'lucide-react'
import Nav from '../components/Nav'
import { useToast } from '../components/ToastProvider'
import { usePush } from '../hooks/usePush'
import {
  getSettings,
  saveSettings,
  resetSettings,
  isValidUrl,
  SHARE_CHANNELS,
  type Settings,
} from '../utils/settings'

const APP_VERSION = '2.0.0'

export default function SettingsPage() {
  const toast = useToast()
  const { subscription, isSupported: pushSupported, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePush()
  const [settings, setSettings] = useState<Settings>(getSettings)
  const [urlErrors, setUrlErrors] = useState<Record<string, boolean>>({})

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function updateChannel(id: string, field: 'websiteUrl' | 'orderFormUrl', value: string) {
    setSettings((prev) => ({
      ...prev,
      channelOverrides: {
        ...prev.channelOverrides,
        [id]: { ...prev.channelOverrides[id], [field]: value },
      },
    }))
  }

  function validateUrls(): boolean {
    const errs: Record<string, boolean> = {}
    const urlFields: Array<[string, string]> = [
      ['websiteUrl', settings.websiteUrl],
      ['orderFormUrl', settings.orderFormUrl],
      ['googleReviewLink', settings.googleReviewLink],
      ['shortenerApiBaseUrl', settings.shortenerApiBaseUrl],
    ]
    for (const [key, val] of urlFields) {
      if (val && !isValidUrl(val)) errs[key] = true
    }
    for (const ch of SHARE_CHANNELS) {
      const ov = settings.channelOverrides[ch.id]
      if (ov?.websiteUrl  && !isValidUrl(ov.websiteUrl))  errs[`${ch.id}_web`]   = true
      if (ov?.orderFormUrl && !isValidUrl(ov.orderFormUrl)) errs[`${ch.id}_order`] = true
    }
    setUrlErrors(errs)
    return Object.keys(errs).length === 0
  }

  function onSave() {
    if (!validateUrls()) { toast.error('Fix invalid URLs before saving'); return }
    saveSettings(settings)
    toast.success('Settings saved')
  }

  function onReset() {
    const fresh = resetSettings()
    setSettings(fresh)
    setUrlErrors({})
    toast.success('Settings reset to defaults')
  }

  const fieldCls = (errKey: string) =>
    `input-field w-full ${urlErrors[errKey] ? 'border-red-400 ring-2 ring-red-200' : ''}`

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Settings" />
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
          <h3 className="text-sm font-bold text-ink">§1 Default Links</h3>
          <div>
            <label className="text-xs text-ink/50 block mb-1">Website URL</label>
            <input value={settings.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className={fieldCls('websiteUrl')} placeholder="https://dietswad.in" />
          </div>
          <div>
            <label className="text-xs text-ink/50 block mb-1">Order Form URL</label>
            <input value={settings.orderFormUrl} onChange={(e) => update('orderFormUrl', e.target.value)} className={fieldCls('orderFormUrl')} placeholder="https://dietswad.in/order" />
          </div>
        </section>

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
          <h3 className="text-sm font-bold text-ink">§2 Review & Payment</h3>
          <div>
            <label className="text-xs text-ink/50 block mb-1">Google Review Link</label>
            <input value={settings.googleReviewLink} onChange={(e) => update('googleReviewLink', e.target.value)} className={fieldCls('googleReviewLink')} placeholder="https://g.page/r/..." />
          </div>
          <div>
            <label className="text-xs text-ink/50 block mb-1">UPI ID</label>
            <input value={settings.upiId} onChange={(e) => update('upiId', e.target.value)} className="input-field w-full" placeholder="example@okicici" />
          </div>
          <div>
            <label className="text-xs text-ink/50 block mb-1">UPI Number</label>
            <input value={settings.upiNumber} onChange={(e) => update('upiNumber', e.target.value)} inputMode="numeric" className="input-field w-full" placeholder="9XXXXXXXXX" />
          </div>
        </section>

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-ink">§3 Channel Overrides</h3>
            <p className="text-xs text-ink/40 mt-0.5">Leave blank to use §1 defaults</p>
          </div>
          {SHARE_CHANNELS.map((ch) => {
            const ov = settings.channelOverrides[ch.id] ?? { websiteUrl: '', orderFormUrl: '' }
            return (
              <div key={ch.id}>
                <p className="text-xs font-semibold text-ink/60 mb-1.5">{ch.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={ov.websiteUrl}
                    onChange={(e) => updateChannel(ch.id, 'websiteUrl', e.target.value)}
                    placeholder="Website URL override"
                    className={fieldCls(`${ch.id}_web`)}
                  />
                  <input
                    value={ov.orderFormUrl}
                    onChange={(e) => updateChannel(ch.id, 'orderFormUrl', e.target.value)}
                    placeholder="Order form URL override"
                    className={fieldCls(`${ch.id}_order`)}
                  />
                </div>
              </div>
            )
          })}
        </section>

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
          <h3 className="text-sm font-bold text-ink">§4 URL Shortener API</h3>
          <div>
            <label className="text-xs text-ink/50 block mb-1">API Base URL</label>
            <input value={settings.shortenerApiBaseUrl} onChange={(e) => update('shortenerApiBaseUrl', e.target.value)} className={fieldCls('shortenerApiBaseUrl')} placeholder="https://dietswad-api.azurewebsites.net/api" />
          </div>
          <p className="text-xs text-ink/40">Auth is handled by JWT — no API key needed.</p>
        </section>

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-3">
          <h3 className="text-sm font-bold text-ink">§5 Preferences</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Push notifications</p>
              <p className="text-xs text-ink/40">
                {!pushSupported ? 'Not supported in this browser' : subscription ? 'Subscribed on this device' : 'Enable order alerts'}
              </p>
            </div>
            <button
              type="button"
              disabled={!pushSupported}
              onClick={() => (subscription ? pushUnsubscribe() : pushSubscribe())}
              className={`relative inline-flex w-10 h-6 rounded-full transition-colors disabled:opacity-40 ${subscription ? 'bg-gold' : 'bg-surface'}`}
              role="switch"
              aria-checked={!!subscription}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${subscription ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          <Link to="/settings/utm-summary" className="flex items-center gap-1.5 text-sm text-espresso hover:underline">
            <ExternalLink size={14} /> UTM Channel Summary
          </Link>
          <Link to="/guide" className="flex items-center gap-1.5 text-sm text-espresso hover:underline">
            <BookOpen size={14} /> Team User Guide — how to use this app
          </Link>
        </section>

        <section className="bg-cream rounded-xl border border-surface p-4 space-y-1.5">
          <h3 className="text-sm font-bold text-ink mb-2">§6 About</h3>
          {[
            ['Version', `v${APP_VERSION}`],
            ['Company', 'Radiant Twins Enterprise'],
            ['Contact', '+91 8910725854'],
            ['Backend', 'dietswad-api.azurewebsites.net'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-ink/50">{label}</span>
              <span className="text-ink font-medium">{value}</span>
            </div>
          ))}
        </section>

        <div className="flex gap-3 pb-6">
          <button onClick={onSave} className="flex-1 py-3 bg-espresso text-on-dark rounded-xl font-semibold text-sm hover:bg-espresso-light transition-colors">
            Save Settings
          </button>
          <button onClick={onReset} className="px-5 py-3 bg-surface text-ink rounded-xl font-semibold text-sm hover:bg-surface/80">
            Reset
          </button>
        </div>
      </main>
    </div>
  )
}
