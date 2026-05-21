import { BarChart2, ClipboardList, PlusCircle, Layers, Share2, Link2, Settings, Package } from 'lucide-react'
import Nav from '../components/Nav'
import Card from '../components/Card'

const NAV_CARDS = [
  { to: '/dashboards',  icon: BarChart2,    label: 'Dashboards',    caption: 'Sales & inventory' },
  { to: '/orders',      icon: ClipboardList, label: 'Orders',        caption: 'View all orders' },
  { to: '/orders/new',  icon: PlusCircle,   label: 'Manual Order',  caption: 'Create single order' },
  { to: '/orders/bulk', icon: Layers,       label: 'Bulk Entry',    caption: 'Import multiple orders' },
  { to: '/share',       icon: Share2,       label: 'Share Link',    caption: 'Product share pages' },
  { to: '/shortener',   icon: Link2,        label: 'URL Shortener', caption: 'Manage short links' },
  { to: '/products',    icon: Package,      label: 'Products',      caption: 'Catalog & stock' },
  { to: '/settings',    icon: Settings,     label: 'Settings',      caption: 'Preferences' },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Diet Swad — Internal" />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-ink">Dashboard</h2>
          <p className="text-sm text-ink/50 mt-0.5">Team access — Radiant Twins Enterprise</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NAV_CARDS.map((card) => <Card key={card.to} {...card} />)}
        </div>
      </main>
    </div>
  )
}
