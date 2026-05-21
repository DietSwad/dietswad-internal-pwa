import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './components/RequireAuth'
import InstallPrompt from './components/InstallPrompt'
import LoginPage from './auth/LoginPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardsPage from './pages/stubs/DashboardsPage'
import OrdersListPage from './pages/stubs/OrdersListPage'
import ManualOrderPage from './pages/stubs/ManualOrderPage'
import BulkEntryPage from './pages/stubs/BulkEntryPage'
import ShareLinkPage from './pages/stubs/ShareLinkPage'
import ShortenerPage from './pages/stubs/ShortenerPage'
import SettingsPage from './pages/stubs/SettingsPage'
import ProductsPage from './pages/stubs/ProductsPage'

export default function App() {
  return (
    <AuthProvider>
      <InstallPrompt />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/new" element={<ManualOrderPage />} />
          <Route path="/orders/bulk" element={<BulkEntryPage />} />
          <Route path="/share" element={<ShareLinkPage />} />
          <Route path="/shortener/*" element={<ShortenerPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
