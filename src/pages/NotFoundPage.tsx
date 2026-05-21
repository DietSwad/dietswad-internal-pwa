import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Nav from '../components/Nav'

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-linen">
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-[70dvh] px-4 text-center">
        <div className="text-6xl font-bold text-espresso/10 mb-4">404</div>
        <h1 className="text-xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-sm text-ink/50 mb-6">That route doesn't exist in the dashboard.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-espresso text-on-dark px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-espresso-light transition-colors">
          <Home size={16} />
          Back to Home
        </Link>
      </main>
    </div>
  )
}
