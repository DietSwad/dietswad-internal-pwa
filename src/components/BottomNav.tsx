import { NavLink } from 'react-router-dom'
import { BOTTOM_TABS } from '../nav-items'

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-espresso border-t border-white/10 print:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-2xl mx-auto flex">
        {BOTTOM_TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-gold' : 'text-on-dark/60 hover:text-on-dark'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
