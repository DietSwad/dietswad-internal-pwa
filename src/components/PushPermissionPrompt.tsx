import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { usePush } from '../hooks/usePush'

export default function PushPermissionPrompt() {
  const { permission, isSupported, subscribe } = usePush()
  const [dismissed, setDismissed] = useState(false)

  if (!isSupported || permission !== 'default' || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-espresso text-on-dark rounded-2xl shadow-xl px-4 py-3.5 flex items-center gap-3">
        <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell size={18} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Order notifications</p>
          <p className="text-xs text-on-dark/60 leading-tight mt-0.5">
            Get notified when new orders arrive
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={subscribe}
            className="text-xs font-semibold bg-gold text-espresso px-3 py-1.5 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Enable
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-on-dark/50 hover:text-on-dark transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
