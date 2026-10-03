import { Heart, Minus, Plus, ShoppingBag, Zap } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../../data/products'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PriceDisplay } from '../ui/PriceDisplay'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../../hooks/useWishlist'

type ProductPurchasePanelProps = {
  product: Product
}

const categoryLabel = (category: Product['category']) => category.replaceAll('-', ' ')

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  const isOutOfStock = product.stockStatus === 'out-of-stock'
  const maxQuantity = product.stockQuantity ?? Number.POSITIVE_INFINITY
  const isAtStockLimit = quantity >= maxQuantity
  const isSaved = isInWishlist(product.id)

  return (
    <section className="product-purchase-panel">
      <p className="eyebrow">{categoryLabel(product.category)}</p>
      <div className="product-detail-badges">{product.badge && <Badge tone="accent">{product.badge}</Badge>}</div>
      <h1>{product.name}</h1>
      <div className="product-rating" aria-label={`${product.rating ?? 0} out of 5 stars from ${product.reviewCount ?? 0} reviews`}><span>★★★★★</span> <a href="#reviews">{product.rating?.toFixed(1) ?? 'New'} ({product.reviewCount ?? 0} reviews)</a></div>
      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
      <p className={`product-availability product-availability-${product.stockStatus ?? 'in-stock'}`}>{product.stockStatus === 'low-stock' ? 'Low stock' : product.stockStatus === 'out-of-stock' ? 'Out of stock' : 'In stock and ready to ship'}</p>
      {product.condition && <p className="product-detail-meta"><strong>Condition</strong>{product.condition}</p>}
      {product.grade && <p className="product-detail-meta"><strong>Grade</strong>{product.grade}</p>}
      {product.sku && <p className="product-detail-meta"><strong>SKU</strong>{product.sku}</p>}
      <div className="product-purchase-actions">
        <div className="quantity-selector" aria-label="Quantity selector"><button type="button" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button><span aria-live="polite">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={isOutOfStock || isAtStockLimit} onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}><Plus size={15} /></button></div>
        <Button disabled={isOutOfStock} onClick={() => addItem(product, quantity)}><ShoppingBag size={17} /> Add to Cart</Button>
        <Button variant="secondary" disabled={isOutOfStock} onClick={() => { addItem(product, quantity); navigate('/cart') }}><Zap size={16} /> Buy Now</Button>
        <button className={`product-detail-wishlist${isSaved ? ' is-active' : ''}`} type="button" aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`} aria-pressed={isSaved} onClick={() => toggleWishlist(product)}><Heart size={19} fill={isSaved ? 'currentColor' : 'none'} /></button>
      </div>
      <p className="product-purchase-note">Taxes and shipping calculated at checkout. Checkout integration coming soon.</p>
    </section>
  )
}
