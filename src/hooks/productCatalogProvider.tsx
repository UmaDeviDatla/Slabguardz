import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { listHostingerProducts } from '../lib/hostingerApi'
import { ProductCatalogContext } from './productCatalogContext'
import type { Product } from '../data/products'

const CATALOG_CACHE_KEY = 'slabguardz:catalog-cache-v1'
const REVALIDATION_INTERVAL_MS = 60_000 // 60 seconds background sync

function getCachedCatalog(): { products: Product[]; total: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CATALOG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed.products) && typeof parsed.total === 'number') {
      return parsed
    }
  } catch {
    // Ignore cache read errors
  }
  return null
}

function setCachedCatalog(data: { products: Product[]; total: number }) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota errors
  }
}

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => getCachedCatalog()?.products ?? [])
  const [total, setTotal] = useState<number>(() => getCachedCatalog()?.total ?? 0)
  const [isLoading, setIsLoading] = useState<boolean>(() => getCachedCatalog() === null)
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  // Primary fetch and requestKey-driven refresh
  useEffect(() => {
    let isCancelled = false
    const controller = new AbortController()

    listHostingerProducts(controller.signal)
      .then((result) => {
        if (isCancelled) return
        setProducts(result.products)
        setTotal(result.total)
        setError(null)
        setCachedCatalog({ products: result.products, total: result.total })
      })
      .catch((requestError: unknown) => {
        if (isCancelled) return
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load products.')
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
          setIsRevalidating(false)
        }
      })

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [requestKey])

  const revalidate = useCallback(() => {
    setIsRevalidating(true)
    return listHostingerProducts()
      .then((result) => {
        setProducts(result.products)
        setTotal(result.total)
        setError(null)
        setCachedCatalog({ products: result.products, total: result.total })
      })
      .catch((syncError: unknown) => {
        if (import.meta.env.DEV) {
          console.warn('Background catalog sync failed:', syncError)
        }
      })
      .finally(() => {
        setIsRevalidating(false)
      })
  }, [])

  // Auto-revalidate on window focus & when returning online to detect newly published products promptly
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocus = () => {
      void revalidate()
    }
    const handleOnline = () => {
      void revalidate()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)

    // Periodic background sync interval
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void revalidate()
      }
    }, REVALIDATION_INTERVAL_MS)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
      window.clearInterval(intervalId)
    }
  }, [revalidate])

  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRequestKey((currentKey) => currentKey + 1)
  }, [])

  const refresh = useCallback(async () => {
    await revalidate()
  }, [revalidate])

  const getProductById = useCallback(
    (idOrSlug: string) => {
      const normalized = idOrSlug.trim()
      return products.find(
        (product) =>
          product.id === normalized ||
          (product.slug && product.slug.toLowerCase() === normalized.toLowerCase()),
      )
    },
    [products],
  )

  const value = useMemo(
    () => ({
      products,
      total,
      isLoading,
      isRevalidating,
      error,
      retry,
      refresh,
      getProductById,
    }),
    [error, getProductById, isLoading, isRevalidating, products, refresh, retry, total],
  )

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>
}