import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../data/products'
import { readWishlistIds, writeWishlistIds } from './wishlistStorage'
import { WishlistContext } from './wishlistContext'
import { useProductCatalogState } from './useProductCatalogState'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getProductById } = useProductCatalogState()
  const [productIds, setProductIds] = useState<string[]>(readWishlistIds)

  useEffect(() => {
    writeWishlistIds(productIds)
  }, [productIds])

  const value = useMemo(() => {
    const wishlistProducts = productIds.flatMap((productId) => {
      const product = getProductById(productId)
      return product ? [product] : []
    })
    const isInWishlist = (productId: string) => productIds.includes(productId)
    const addToWishlist = (product: Product) => {
      setProductIds((currentIds) => currentIds.includes(product.id) ? currentIds : [...currentIds, product.id])
    }
    const removeFromWishlist = (productId: string) => {
      setProductIds((currentIds) => currentIds.filter((currentId) => currentId !== productId))
    }
    const toggleWishlist = (product: Product) => {
      setProductIds((currentIds) => currentIds.includes(product.id) ? currentIds.filter((currentId) => currentId !== product.id) : [...currentIds, product.id])
    }

    return { productIds, products: wishlistProducts, count: wishlistProducts.length, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist }
  }, [getProductById, productIds])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
