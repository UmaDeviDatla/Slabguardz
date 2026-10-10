import { useMemo, useState } from 'react'
import type { Product, ProductCategory } from '../data/products'
import type { SortOption } from '../data/shop'

const PAGE_SIZE = 12

type UseProductCatalogOptions = {
  products: Product[]
  category: ProductCategory | 'all'
  search: string
  sort: SortOption
}

export function useProductCatalog({ products, category, search, sort }: UseProductCatalogOptions) {
  const queryKey = `${category}:${search}:${sort}`
  const [pagination, setPagination] = useState({ page: 1, queryKey })

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const matchingProducts = products.filter((product) => {
      const assignedCategories = Array.isArray(product.categories)
        ? product.categories
        : [product.category]
      const matchesCategory = category === 'all' || assignedCategories.includes(category)
      const searchableText = `${product.name} ${assignedCategories.join(' ')} ${product.category} ${product.description ?? ''} ${product.badge ?? ''}`.toLowerCase()
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch))
    })

    return [...matchingProducts].sort((first, second) => {
      if (sort === 'price-low') return first.price - second.price
      if (sort === 'price-high') return second.price - first.price
      if (sort === 'newest') return (second.updatedAt ?? '').localeCompare(first.updatedAt ?? '')
      return Number(second.badge === 'Best seller') - Number(first.badge === 'Best seller')
    })
  }, [category, products, search, sort])

  const currentPage = pagination.queryKey === queryKey ? pagination.page : 1
  const visibleProducts = filteredProducts.slice(0, currentPage * PAGE_SIZE)

  return {
    products: visibleProducts,
    total: filteredProducts.length,
    hasMore: visibleProducts.length < filteredProducts.length,
    loadMore: () => setPagination({ page: currentPage + 1, queryKey }),
  }
}
