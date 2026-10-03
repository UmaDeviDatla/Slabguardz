export type ProductCategory =
  | 'pokemon-cards'
  | 'slabguardz-protection'
  | 'accessories'

export type Product = {
  id: string
  name: string
  slug?: string
  variantId?: string
  variantTitle?: string
  category: ProductCategory
  categories?: ProductCategory[]
  collectionIds?: string[]
  price: number
  currencyCode?: string
  priceUnavailable?: boolean
  compareAtPrice?: number
  image: string
  badge?: string
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
  stockQuantity?: number
  gallery?: string[]
  rating?: number
  reviewCount?: number
  sku?: string
  condition?: string
  grade?: string
  description?: string
  specifications?: Array<{ label: string; value: string }>
  collectorInfo?: string
  shippingInfo?: string
  returnsInfo?: string
  updatedAt?: string
}
