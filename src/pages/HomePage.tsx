import Nav from '../components/Nav'
import Card from '../components/Card'
import { NAV_CARDS } from '../nav-items'

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
          {NAV_CARDS.map((card) => (
            <Card key={card.to} {...card} />
          ))}
        </div>
      </main>
    </div>
  )
}
