import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Nav from '../../components/Nav'
import CopyButton from '../../components/CopyButton'
import { useShortenUrl } from '../../hooks/useShortener'
import { useToast } from '../../components/ToastProvider'
import { SHORTENER_CHANNELS, buildUtmUrl } from '../../utils/channels'
import { ShortenUrlSchema, type ShortenUrlFormValues } from '../../utils/zodSchemas'
import { getSettings } from '../../utils/settings'
import type { ShortUrl } from '../../api/shortener'

function buildFinalUrl(values: ShortenUrlFormValues): string {
  const { long_url, utm_source, utm_medium, utm_campaign } = values
  if (!utm_source && !utm_medium && !utm_campaign) return long_url
  try {
    return buildUtmUrl(long_url, {
      source: utm_source ?? '',
      medium: utm_medium ?? '',
      campaign: utm_campaign ?? '',
    })
  } catch {
    return long_url
  }
}

export default function ShortenerNewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success: toastSuccess, error: toastError } = useToast()
  const shortenMut = useShortenUrl()
  const [showUtm, setShowUtm] = useState(false)
  const [result, setResult] = useState<ShortUrl | null>(null)

  const channelId = searchParams.get('channel')
  const presetChannel = channelId
    ? SHORTENER_CHANNELS.find((c) => c.id === channelId)
    : undefined

  const settings = getSettings()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShortenUrlFormValues>({
    resolver: zodResolver(ShortenUrlSchema),
    defaultValues: {
      long_url: settings.websiteUrl || 'https://dietswad.in',
      custom_code: '',
      utm_source: presetChannel?.utm_source ?? '',
      utm_medium: presetChannel?.utm_medium ?? '',
      utm_campaign: presetChannel?.default_campaign ?? '',
    },
  })

  useEffect(() => {
    if (presetChannel) {
      setValue('utm_source', presetChannel.utm_source)
      setValue('utm_medium', presetChannel.utm_medium)
      setValue('utm_campaign', presetChannel.default_campaign)
      setShowUtm(true)
    }
  }, [presetChannel, setValue])

  const longUrl = watch('long_url')
  const utmSource = watch('utm_source')
  const utmMedium = watch('utm_medium')
  const utmCampaign = watch('utm_campaign')

  const previewUrl = (() => {
    try {
      return buildFinalUrl({ long_url: longUrl, utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign })
    } catch {
      return longUrl
    }
  })()

  async function onSubmit(values: ShortenUrlFormValues) {
    const finalUrl = buildFinalUrl(values)
    try {
      const res = await shortenMut.mutateAsync({
        long_url: finalUrl,
        custom_code: values.custom_code || undefined,
      })
      setResult(res)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      if (status === 409) toastError('That alias is already taken — try a different one.')
      else if (status === 400) toastError('Invalid or reserved alias — change and retry.')
      else toastError('Failed to create short link. Try again.')
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-dvh bg-linen">
        <Nav title="Link Created" />
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-ink/10 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <p className="text-xs text-ink/40 mb-1">Your short link</p>
            <p className="font-mono text-xl font-bold text-espresso mb-5 break-all">
              {result.short_url}
            </p>

            <div className="flex justify-center mb-6 p-4 bg-linen rounded-xl">
              <QRCodeSVG value={result.short_url} size={160} bgColor="#F5EDE0" fgColor="#2C1A0A" />
            </div>

            <div className="flex gap-2 mb-3">
              <CopyButton
                value={result.short_url}
                label="Copy link"
                className="flex-1 justify-center border border-espresso/30 rounded-xl py-2.5 text-espresso"
              />
              {typeof navigator.share === 'function' && (
                <button
                  onClick={() => navigator.share({ url: result.short_url })}
                  className="flex-1 py-2.5 rounded-xl border border-ink/10 text-sm text-ink"
                >
                  Share
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setResult(null); shortenMut.reset() }}
                className="flex-1 py-2.5 rounded-xl border border-ink/10 text-sm text-ink"
              >
                Create another
              </button>
              <button
                onClick={() => navigate(`/shortener/${result.short_code}`)}
                className="flex-1 py-2.5 rounded-xl bg-espresso text-linen text-sm font-medium"
              >
                View details
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-linen">
      <Nav title={presetChannel ? `New — ${presetChannel.label}` : 'New Short Link'} />

      <main className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-5"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {presetChannel && (
          <div className="bg-espresso/5 border border-espresso/20 rounded-xl px-4 py-3 mb-5 text-sm text-espresso">
            Channel: <strong>{presetChannel.label}</strong> — UTM parameters pre-filled below.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Destination URL */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Destination URL</label>
            <input
              {...register('long_url')}
              type="url"
              placeholder="https://dietswad.in/..."
              className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30"
            />
            {errors.long_url && (
              <p className="text-xs text-red-500 mt-1">{errors.long_url.message}</p>
            )}
          </div>

          {/* Custom alias */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Custom alias{' '}
              <span className="text-ink/40 font-normal">(optional)</span>
            </label>
            <div className="flex border border-ink/10 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-espresso/30">
              <span className="px-3 py-2.5 text-sm text-ink/40 bg-ink/5 border-r border-ink/10 whitespace-nowrap select-none">
                dietswad.in/
              </span>
              <input
                {...register('custom_code')}
                placeholder="ig-bio"
                className="flex-1 px-3 py-2.5 text-sm font-mono bg-transparent focus:outline-none"
              />
            </div>
            {errors.custom_code && (
              <p className="text-xs text-red-500 mt-1">{errors.custom_code.message}</p>
            )}
            <p className="text-xs text-ink/40 mt-1">
              Leave blank to auto-generate. Allowed: a–z, 0–9, hyphens (2–30 chars).
            </p>
          </div>

          {/* UTM builder */}
          <div>
            <button
              type="button"
              onClick={() => setShowUtm((v) => !v)}
              className="flex items-center gap-2 text-sm text-espresso font-medium"
            >
              {showUtm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              UTM tracking parameters
            </button>

            {showUtm && (
              <div className="mt-3 space-y-3 pl-1 border-l-2 border-espresso/20 ml-1">
                {(
                  [
                    { name: 'utm_source' as const,   label: 'Source',   placeholder: 'instagram', locked: !!presetChannel },
                    { name: 'utm_medium' as const,   label: 'Medium',   placeholder: 'bio',       locked: !!presetChannel },
                    { name: 'utm_campaign' as const, label: 'Campaign', placeholder: 'bio_instagram', locked: false },
                  ] as const
                ).map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs text-ink/60 mb-1">{f.label}</label>
                    <input
                      {...register(f.name)}
                      placeholder={f.placeholder}
                      readOnly={f.locked}
                      className={`w-full px-3 py-2 rounded-lg border border-ink/10 text-sm focus:outline-none focus:ring-2 focus:ring-espresso/30 ${
                        f.locked ? 'bg-ink/5 text-ink/50 cursor-default' : 'bg-white'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live preview */}
          {previewUrl && previewUrl !== (longUrl || '') && (
            <div className="bg-espresso/5 rounded-xl px-3 py-2.5 text-xs text-ink/60 break-all">
              <span className="font-medium text-ink/80">Full destination:</span> {previewUrl}
            </div>
          )}

          <button
            type="submit"
            disabled={shortenMut.isPending}
            className="w-full py-3 bg-espresso text-linen rounded-xl font-medium text-sm hover:bg-espresso/90 disabled:opacity-50 transition-colors"
          >
            {shortenMut.isPending ? 'Creating…' : 'Create Short Link'}
          </button>
        </form>
      </main>
    </div>
  )
}
