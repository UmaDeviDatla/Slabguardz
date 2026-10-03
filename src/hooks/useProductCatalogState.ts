import { useContext } from 'react'
import { ProductCatalogContext } from './productCatalogContext'

export function useProductCatalogState() {
  const context = useContext(ProductCatalogContext)
  if (!context) throw new Error('useProductCatalogState must be used within ProductCatalogProvider')
  return context
}