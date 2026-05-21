import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!installEvent || dismissed) return null

  async function handleInstall() {
    if (!installEvent) return
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === 'accepted') setInstallEvent(null)
    else setDismissed(true)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-espresso text-on-dark rounded-2xl shadow-xl px-4 py-3.5 flex items-center gap-3">
        <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download size={18} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Install app</p>
          <p className="text-xs text-on-dark/60 leading-tight mt-0.5">Add to home screen for faster access</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleInstall} className="text-xs font-semibold bg-gold text-espresso px-3 py-1.5 rounded-lg hover:bg-gold/90 transition-colors">Install</button>
          <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="text-on-dark/50 hover:text-on-dark transition-colors"><X size={16} /></button>
        </div>
      </div>
    </div>
  )
}
