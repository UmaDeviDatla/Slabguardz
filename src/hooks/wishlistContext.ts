import { createContext } from 'react'
import type { Product } from '../data/products'

export type WishlistContextValue = {
  productIds: string[]
  products: Product[]
  count: number
  isInWishlist: (productId: string) => boolean
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (product: Product) => void
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)
