import { createContext } from 'react'
import type { Product } from '../data/products'

export type CartItem = {
  productId: string
  quantity: number
  lineItemId: string
  variantId?: string
}

export type CartLine = {
  product: Product
  quantity: number
  lineItemId: string
  variantId?: string
  variantTitle?: string
  unitPrice: number
  currencyCode: string
  lineTotal: number
}

export type CartContextValue = {
  shippingTotal: number
  taxTotal: number
  total: number
  currencyCode: string

  items: CartItem[]
  lines: CartLine[]
  itemCount: number
  subtotal: number

  isDrawerOpen: boolean
  isLoading: boolean
  isCheckoutLoading: boolean
  error: string | null

  retry: () => void
  checkout: () => void

  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void

  openDrawer: () => void
  closeDrawer: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)