import type { Product, ProductCategory } from '../data/products'

const apiBaseUrl = import.meta.env.VITE_HOSTINGER_ECOMMERCE_API_URL ?? 'https://api-ecommerce.hostinger.com'
const salesChannelId = import.meta.env.VITE_HOSTINGER_SALES_CHANNEL_ID

type HostingerProduct = {
  id: string
  title: string | null
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  slug?: string | null
  ribbon_text?: string | null
  updated_at?: string | null
  type?: { value?: string | null } | null
  images?: Array<{ url: string; order?: number | null }> | null
  is_available: boolean
  purchasable?: boolean | null
  price?: {
    lowest_amount: number
    highest_amount: number
    currency_code: string | null
  } | null
  product_collections?: Array<{ collection_id: string; order?: number | null }> | null
}

type HostingerProductsResponse = {
  data: HostingerProduct[]
  count: number
  offset: number
  limit: number
}

type HostingerVariant = {
  id: string
  product_id: string
  title?: string | null
  sku?: string | null
  is_available: boolean
  prices?: Array<{
    amount: number | null
    sale_amount: number | null
    currency_code: string | null
  }> | null
}

type HostingerVariantsResponse = {
  data: HostingerVariant[]
  count: number
  offset: number
  limit: number
}

export const HOSTINGER_CATEGORY_CONFIG: Record<ProductCategory, { label: string; collectionIds: string[] }> = {
  'pokemon-cards': { label: 'Pokémon Cards', collectionIds: ['pcol_01M23BJ5KRJC9DZ2DAEYBP3TCS'] },
  'slabguardz-protection': { label: 'SlabGuardz Protection', collectionIds: [] },
  accessories: { label: 'Accessories', collectionIds: ['pcol_01M23BJK6CPNMDJM4N24JW082M'] },
}

function resolveProductCategories(product: HostingerProduct): { categories: ProductCategory[]; collectionIds: string[] } {
  const collectionIds = (product.product_collections ?? []).map((item) => item.collection_id)
  const categories = (Object.entries(HOSTINGER_CATEGORY_CONFIG) as Array<[ProductCategory, { label: string; collectionIds: string[] }]>).reduce<ProductCategory[]>((matches, [category, config]) => {
    if (config.collectionIds.length > 0 && config.collectionIds.some((id) => collectionIds.includes(id))) matches.push(category)
    return matches
  }, [])

  return { categories, collectionIds }
}

function getCategory(product: HostingerProduct): ProductCategory {
  const { categories } = resolveProductCategories(product)
  return categories[0] ?? 'accessories'
}

export function toMajorCurrencyAmount(amount: number | null, currencyCode: string | null): number | null {
  if (amount === null) return null
  const currency = (currencyCode ?? 'INR').toUpperCase()
  const decimalDigits = new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  return amount / (10 ** decimalDigits)
}

function mapProduct(product: HostingerProduct, variants: HostingerVariant[]): Product {
  const image = product.thumbnail ?? product.images?.[0]?.url ?? ''
  const fallbackPrice = product.price
  const fallbackCurrencyCode = fallbackPrice?.currency_code ?? 'INR'
  const resolvedCategory = getCategory(product)
  const { categories, collectionIds } = resolveProductCategories(product)
  const pricedVariants = variants
    .filter((variant) => variant.is_available)
    .flatMap((variant) => (variant.prices ?? []).map((price) => ({
      amount: toMajorCurrencyAmount(price.amount, price.currency_code ?? fallbackCurrencyCode),
      saleAmount: toMajorCurrencyAmount(price.sale_amount, price.currency_code ?? fallbackCurrencyCode),
      currencyCode: price.currency_code ?? fallbackCurrencyCode,
    })))
    .filter((price) => price.amount !== null)
  const lowestVariant = pricedVariants
    .filter((price) => price.amount !== null)
    .sort((first, second) => (first.saleAmount ?? first.amount!) - (second.saleAmount ?? second.amount!))[0]
  const selectedVariant = variants.find((variant) => variant.is_available && variant.prices?.some((price) => price.amount !== null && (price.sale_amount ?? price.amount) === (lowestVariant?.saleAmount ?? lowestVariant?.amount))) ?? variants.find((variant) => variant.is_available) ?? variants[0]
  const fallbackAmount = toMajorCurrencyAmount(fallbackPrice?.lowest_amount ?? null, fallbackCurrencyCode)
  const price = lowestVariant?.saleAmount ?? lowestVariant?.amount ?? fallbackAmount ?? 0
  const regularPrice = lowestVariant?.amount ?? fallbackAmount
  const currencyCode = lowestVariant?.currencyCode ?? fallbackCurrencyCode

  return {
    id: product.id,
    name: product.title ?? product.slug ?? product.id,
    slug: product.slug ?? undefined,
    variantId: selectedVariant?.id,
    variantTitle: selectedVariant?.title ?? undefined,
    category: resolvedCategory,
    categories: categories.length > 0 ? categories : [resolvedCategory],
    collectionIds,
    price,
    currencyCode,
    priceUnavailable: !lowestVariant && !fallbackPrice,
    compareAtPrice: regularPrice !== null && regularPrice > price ? regularPrice : undefined,
    image,
    badge: product.ribbon_text ?? undefined,
    stockStatus: product.is_available && product.purchasable !== false ? 'in-stock' : 'out-of-stock',
    gallery: product.images?.map((item) => item.url) ?? (image ? [image] : []),
    description: product.description ?? product.subtitle ?? undefined,
    updatedAt: product.updated_at ?? undefined,
  }
}

async function listHostingerVariants(productIds: string[], signal?: AbortSignal): Promise<Map<string, HostingerVariant[]>> {
  const variantsByProduct = new Map<string, HostingerVariant[]>()
  let offset = 0
  let total = 0

  do {
    const url = new URL(`/v2/channels/${encodeURIComponent(salesChannelId!)}/variants`, apiBaseUrl)
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('limit', '100')
    url.searchParams.set('product_ids', productIds.join(','))

    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error(`Hostinger variant prices request failed (${response.status}).`)
    }

    const payload = await response.json() as HostingerVariantsResponse
    total = payload.count
    payload.data.forEach((variant) => {
      const productVariants = variantsByProduct.get(variant.product_id) ?? []
      productVariants.push(variant)
      variantsByProduct.set(variant.product_id, productVariants)
    })
    offset += payload.data.length
    if (payload.data.length === 0) break
  } while (offset < total)

  return variantsByProduct
}

export async function listHostingerProducts(signal?: AbortSignal): Promise<{ products: Product[]; total: number }> {
  if (!salesChannelId) {
    throw new Error('VITE_HOSTINGER_SALES_CHANNEL_ID is not configured.')
  }

  const url = new URL(`/v2/channels/${encodeURIComponent(salesChannelId)}/products`, apiBaseUrl)
  url.searchParams.set('offset', '0')
  url.searchParams.set('limit', '200')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Hostinger products request failed (${response.status}).`)
  }

  const payload = await response.json() as HostingerProductsResponse
  const variantsByProduct = await listHostingerVariants(payload.data.map((product) => product.id), signal)
  return { products: payload.data.map((product) => mapProduct(product, variantsByProduct.get(product.id) ?? [])), total: payload.count }
}