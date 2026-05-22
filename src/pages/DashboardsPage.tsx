import { useState } from 'react'
import Nav from '../components/Nav'
import RefreshButton from '../components/RefreshButton'
import OrdersDashboard from '../components/dashboard/OrdersDashboard'
import WebsiteDashboard from '../components/dashboard/WebsiteDashboard'
import MetaDashboard from '../components/dashboard/MetaDashboard'
import UnifiedDashboard from '../components/dashboard/UnifiedDashboard'

type Tab = 'orders' | 'website' | 'meta' | 'unified'

const TABS: { id: Tab; label: string }[] = [
  { id: 'orders',   label: 'Orders'   },
  { id: 'website',  label: 'Website'  },
  { id: 'meta',     label: 'Meta'     },
  { id: 'unified',  label: 'Unified'  },
]

export default function DashboardsPage() {
  const [tab, setTab] = useState<Tab>('orders')

  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="Dashboards" />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        {/* Tab bar + refresh */}
        <div className="flex items-center justify-between mb-5 gap-2">
          <div className="flex gap-1 bg-white border border-ink/10 rounded-xl p-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-espresso text-linen'
                    : 'text-ink/50 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <RefreshButton />
        </div>

        {tab === 'orders'  && <OrdersDashboard />}
        {tab === 'website' && <WebsiteDashboard />}
        {tab === 'meta'    && <MetaDashboard />}
        {tab === 'unified' && <UnifiedDashboard />}
      </main>
    </div>
  )
}
