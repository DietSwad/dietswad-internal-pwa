import { LogOut } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

interface NavProps { title?: string }

export default function Nav({ title = 'Diet Swad' }: NavProps) {
  const { logout } = useAuth()
  return (
    <header className="sticky top-0 z-50 bg-espresso text-on-dark shadow-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-espresso font-bold text-xs tracking-tight">DS</span>
          </div>
          <span className="font-semibold text-sm truncate">{title}</span>
        </div>
        <button onClick={logout} aria-label="Sign out" className="flex items-center gap-1.5 text-on-dark/70 hover:text-on-dark transition-colors text-sm py-1 px-2 rounded-lg hover:bg-white/10">
          <LogOut size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
