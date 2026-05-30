import {
  BarChart2,
  ClipboardList,
  PlusCircle,
  Layers,
  Share2,
  Link2,
  Settings,
  Package,
  Home,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavCardItem {
  to: string
  icon: LucideIcon
  label: string
  caption: string
}

export interface BottomTabItem {
  to: string
  icon: LucideIcon
  label: string
}

export const NAV_CARDS: NavCardItem[] = [
  { to: '/dashboards', icon: BarChart2,    label: 'Dashboards',   caption: 'Sales & inventory' },
  { to: '/orders',     icon: ClipboardList, label: 'Orders',       caption: 'View all orders' },
  { to: '/orders/new', icon: PlusCircle,   label: 'Manual Order', caption: 'Create single order' },
  { to: '/orders/bulk',icon: Layers,       label: 'Bulk Entry',   caption: 'Import multiple orders' },
  { to: '/share-link', icon: Share2,       label: 'Share Link',   caption: 'UTM-tagged links for customers' },
  { to: '/shortener',  icon: Link2,        label: 'URL Shortener',caption: 'Manage short links' },
  { to: '/products',   icon: Package,      label: 'Products',     caption: 'Catalog & stock' },
  { to: '/settings',   icon: Settings,     label: 'Settings',     caption: 'Preferences' },
]

/** Five tabs shown in the fixed bottom nav bar. */
export const BOTTOM_TABS: BottomTabItem[] = [
  { to: '/',           icon: Home,          label: 'Home' },
  { to: '/orders',     icon: ClipboardList, label: 'Orders' },
  { to: '/share-link', icon: Share2,        label: 'Share' },
  { to: '/shortener',  icon: Link2,         label: 'Shortener' },
  { to: '/settings',   icon: Settings,      label: 'Settings' },
]
