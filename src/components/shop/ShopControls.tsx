import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import type { ProductCategory } from '../../data/products'
import { shopCategories, sortOptions, type SortOption } from '../../data/shop'

type ShopControlsProps = {
  category: ProductCategory | 'all'
  search: string
  sort: SortOption
  onCategoryChange: (category: ProductCategory | 'all') => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: SortOption) => void
}

export function ShopControls({ category, search, sort, onCategoryChange, onSearchChange, onSortChange }: ShopControlsProps) {
  return (
    <div className="shop-controls">
      <nav className="shop-category-nav" aria-label="Shop categories">
        {shopCategories.map((item) => <button className={category === item.value ? 'is-active' : ''} key={item.value} type="button" onClick={() => onCategoryChange(item.value)}>{item.label}</button>)}
      </nav>
      <div className="shop-toolbar">
        <label className="shop-search">
          <Search size={17} strokeWidth={1.8} />
          <span className="sr-only">Search products</span>
          <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products" />
        </label>
        <label className="shop-sort">
          <SlidersHorizontal size={16} strokeWidth={1.8} />
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      <details className="shop-mobile-filters">
        <summary><Filter size={16} /> Filter by category</summary>
        <div>{shopCategories.map((item) => <button className={category === item.value ? 'is-active' : ''} key={item.value} type="button" onClick={() => onCategoryChange(item.value)}>{item.label}</button>)}</div>
      </details>
    </div>
  )
}
