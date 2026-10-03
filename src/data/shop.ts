import type { ProductCategory } from './products'

export type ShopCategory = {
  label: string
  value: ProductCategory | 'all'
}

export const shopCategories: ShopCategory[] = [
  { label: 'All products', value: 'all' },
  { label: 'Pokémon cards', value: 'pokemon-cards' },
  { label: 'SlabGuardz protection', value: 'slabguardz-protection' },
  { label: 'Accessories', value: 'accessories' },
]

export const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
] as const

export type SortOption = typeof sortOptions[number]['value']
