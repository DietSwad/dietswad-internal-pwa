import axios from 'axios'
import { apiClient } from './client'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://dietswad-api.azurewebsites.net/api'

export interface Product {
  name: string
  price: number
  display_order: number
  IsActive: boolean
  ShowOnWebsite: boolean
  IsLegacy: boolean
}

export interface UpdateProductPayload {
  name: string
  price?: number
  IsActive?: boolean
  ShowOnWebsite?: boolean
}

export interface CreateProductPayload {
  name: string
  price: number
  display_order?: number
  IsActive?: boolean
  ShowOnWebsite?: boolean
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>(`${API_BASE}/products?channel=app`)
  return data
}

export async function updateProduct(payload: UpdateProductPayload): Promise<void> {
  await apiClient.patch('/manage/products', payload)
}

export async function createProduct(payload: CreateProductPayload): Promise<void> {
  await apiClient.post('/manage/products', payload)
}
