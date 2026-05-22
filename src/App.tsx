import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './components/RequireAuth'
import InstallPrompt from './components/InstallPrompt'
import PushPermissionPrompt from './components/PushPermissionPrompt'
import { ToastProvider } from './components/ToastProvider'
import LoginPage from './auth/LoginPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// Stubs
import ProductsPage from './pages/stubs/ProductsPage'

// Session 3 pages — code-split
const DashboardsPage = lazy(() => import('./pages/DashboardsPage'))

// Shortener — code-split
const ShortenerListPage     = lazy(() => import('./pages/shortener/ShortenerListPage'))
const ShortenerNewPage      = lazy(() => import('./pages/shortener/ShortenerNewPage'))
const ShortenerDetailPage   = lazy(() => import('./pages/shortener/ShortenerDetailPage'))
const ShortenerChannelsPage = lazy(() => import('./pages/shortener/ShortenerChannelsPage'))

// Session 2 pages — code-split
const OrdersListPage   = lazy(() => import('./pages/OrdersListPage'))
const OrderDetailPage  = lazy(() => import('./pages/OrderDetailPage'))
const ManualOrderPage  = lazy(() => import('./pages/ManualOrderPage'))
const BulkEntryPage    = lazy(() => import('./pages/BulkEntryPage'))
const SettingsPage     = lazy(() => import('./pages/SettingsPage'))
const UtmSummaryPage   = lazy(() => import('./pages/UtmSummaryPage'))
const ShareLinkChannelSelectPage = lazy(() => import('./pages/share-link/ShareLinkChannelSelectPage'))
const ShareLinkDisplayPage       = lazy(() => import('./pages/share-link/ShareLinkDisplayPage'))

function PageLoader() {
  return (
    <div className="min-h-dvh bg-linen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-espresso/20 border-t-espresso rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <InstallPrompt />
        <PushPermissionPrompt />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboards" element={<DashboardsPage />} />

              {/* Orders */}
              <Route path="/orders" element={<OrdersListPage />} />
              <Route path="/orders/new" element={<ManualOrderPage />} />
              <Route path="/orders/bulk" element={<BulkEntryPage />} />
              <Route path="/orders/:pageId" element={<OrderDetailPage />} />

              {/* Share Link */}
              <Route path="/share-link" element={<ShareLinkChannelSelectPage />} />
              <Route path="/share-link/:channelId" element={<ShareLinkDisplayPage />} />
              {/* legacy redirect for any old /share bookmarks */}
              <Route path="/share" element={<ShareLinkChannelSelectPage />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/utm-summary" element={<UtmSummaryPage />} />

              {/* Shortener */}
              <Route path="/shortener" element={<ShortenerListPage />} />
              <Route path="/shortener/new" element={<ShortenerNewPage />} />
              <Route path="/shortener/channels" element={<ShortenerChannelsPage />} />
              <Route path="/shortener/:code" element={<ShortenerDetailPage />} />

              {/* Session 3+ stubs */}
              <Route path="/products" element={<ProductsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  )
}
