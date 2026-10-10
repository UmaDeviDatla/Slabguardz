import { createContext } from 'react'
import type { Product } from '../data/products'

export type ProductCatalogContextValue = {
  products: Product[]
  total: number
  isLoading: boolean
  isRevalidating?: boolean
  error: string | null
  retry: () => void
  refresh?: () => Promise<void>
  getProductById: (idOrSlug: string) => Product | undefined
}

export const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(null)