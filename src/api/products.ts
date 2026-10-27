import axios from 'axios'
import { apiClient } from './client'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://api.dietswad.in/api'

/** Active products for order-form pickers (`channel=app`): name, price, display_order only. */
export interface Product {
  name: string
  price: number
  display_order: number
}

/** Every product, including inactive ones, with the flags the Products screen edits (`channel=admin`). */
export interface AdminProduct extends Product {
  is_active: boolean
  show_on_website: boolean
  is_legacy: boolean
}

// Field names match what /manage/products reads. These used to be IsActive/ShowOnWebsite,
// which the backend never read, so the toggles silently did nothing.
export interface UpdateProductPayload {
  name: string
  price?: number
  is_active?: boolean
  show_on_website?: boolean
}

export interface CreateProductPayload {
  name: string
  price: number
  display_order?: number
  is_active?: boolean
  show_on_website?: boolean
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>(`${API_BASE}/products?channel=app`)
  return data
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data } = await axios.get<AdminProduct[]>(`${API_BASE}/products?channel=admin`)
  return data
}

export async function updateProduct(payload: UpdateProductPayload): Promise<void> {
  await apiClient.patch('/manage/products', payload)
}

export async function createProduct(payload: CreateProductPayload): Promise<void> {
  await apiClient.post('/manage/products', payload)
}

// ── COD fees (config partition; what we CHARGE) ───────────────────────────────

export interface Fees {
  full_cod: number
  partial_cod: number
  partial_cod_online_pct: number
}

export async function getFees(): Promise<Fees> {
  // JWT-gated (apiClient), unlike the public product reads.
  const { data } = await apiClient.get<Fees>('/manage/fees')
  return data
}

export async function updateFees(payload: Partial<Fees>): Promise<Fees> {
  const { data } = await apiClient.patch<Fees>('/manage/fees', payload)
  return data
}
