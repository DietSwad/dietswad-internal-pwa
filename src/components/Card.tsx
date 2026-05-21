import { type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CardProps {
  to: string
  icon: LucideIcon
  label: string
  caption?: string
}

export default function Card({ to, icon: Icon, label, caption }: CardProps) {
  return (
    <Link to={to} className="group flex flex-col items-center justify-center gap-2.5 bg-cream rounded-2xl p-5 shadow-sm border border-surface hover:shadow-md hover:border-gold/40 active:scale-[0.97] transition-all duration-150">
      <div className="w-12 h-12 bg-espresso/8 rounded-xl flex items-center justify-center group-hover:bg-espresso group-hover:text-gold transition-colors">
        <Icon size={22} strokeWidth={1.75} className="text-espresso group-hover:text-gold transition-colors" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-ink leading-tight">{label}</p>
        {caption && <p className="text-xs text-ink/45 mt-0.5 leading-tight">{caption}</p>}
      </div>
    </Link>
  )
}
