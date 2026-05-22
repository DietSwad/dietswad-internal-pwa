import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://dietswad-api.azurewebsites.net/api'

export interface Product {
  name: string
  price: number
  display_order: number
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>(`${API_BASE}/products?channel=app`)
  return data
}
