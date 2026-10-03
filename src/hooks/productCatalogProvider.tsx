import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { listHostingerProducts } from '../lib/hostingerApi'
import { ProductCatalogContext } from './productCatalogContext'

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Awaited<ReturnType<typeof listHostingerProducts>>['products']>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    listHostingerProducts(controller.signal)
      .then((result) => {
        setProducts(result.products)
        setTotal(result.total)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load products.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [requestKey])

  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRequestKey((currentKey) => currentKey + 1)
  }, [])
  const getProductById = useCallback((idOrSlug: string) => products.find((product) => product.id === idOrSlug || product.slug === idOrSlug), [products])
  const value = useMemo(() => ({ products, total, isLoading, error, retry, getProductById }), [error, getProductById, isLoading, products, retry, total])

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>
}