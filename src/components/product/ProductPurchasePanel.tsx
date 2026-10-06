import { Heart, Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
      <div className="product-detail-header-meta">
        <p className="eyebrow">{categoryLabel(product.category)}</p>
        {product.badge && <Badge tone="accent">{product.badge}</Badge>}
      </div>

      <h1>{product.name}</h1>

      <div className="product-rating" aria-label="Authentic product rating">
        <span className="stars">★★★★★</span>
        <span className="rating-score">5.0</span>
        <span className="rating-divider">·</span>
        <span className="rating-verified">Verified Authentic</span>
      </div>

      <div className="product-price-container">
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
        <span className={`product-stock-pill product-stock-${product.stockStatus ?? 'in-stock'}`}>
          {product.stockStatus === 'low-stock'
            ? 'Low Stock — Order Soon'
            : product.stockStatus === 'out-of-stock'
            ? 'Out of Stock'
            : 'In Stock & Ready to Ship'}
        </span>
      </div>

      <div className="product-specs-list">
        {product.condition && (
          <div className="product-detail-meta">
            <strong>Condition</strong>
            <span>{product.condition}</span>
          </div>
        )}
        {product.grade && (
          <div className="product-detail-meta">
            <strong>Grade</strong>
            <span>{product.grade}</span>
          </div>
        )}
        {product.sku && (
          <div className="product-detail-meta">
            <strong>SKU</strong>
            <span>{product.sku}</span>
          </div>
        )}
      </div>

      <div className="product-purchase-actions">
        <div className="quantity-selector" aria-label="Quantity selector">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity === 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus size={15} />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isOutOfStock || isAtStockLimit}
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
          >
            <Plus size={15} />
          </button>
        </div>

        <motion.div whileTap={{ scale: 0.97 }} className="action-btn-wrap">
          <Button disabled={isOutOfStock} onClick={() => addItem(product, quantity)} className="btn-add-cart">
            <ShoppingBag size={17} /> Add to Cart
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.97 }} className="action-btn-wrap">
          <Button
            variant="secondary"
            disabled={isOutOfStock}
            onClick={() => {
              addItem(product, quantity)
              navigate('/cart')
            }}
            className="btn-buy-now"
          >
            <Zap size={16} /> Buy Now
          </Button>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          className={`product-detail-wishlist${isSaved ? ' is-active' : ''}`}
          type="button"
          aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`}
          aria-pressed={isSaved}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={20} strokeWidth={2} fill={isSaved ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      <p className="product-purchase-note">
        Free India-wide express shipping on orders over ₹1,499 · Flat ₹99 below ₹1,499.
      </p>

      {/* Trust Badges Bar */}
      <div className="product-trust-badges">
        <div className="product-trust-badge-item">
          <ShieldCheck size={18} className="trust-icon" />
          <div>
            <strong>100% Genuine</strong>
            <p>Direct authentic sourcing</p>
          </div>
        </div>
        <div className="product-trust-badge-item">
          <Truck size={18} className="trust-icon" />
          <div>
            <strong>Express Shipping</strong>
            <p>Dispatched in 24-48 hrs</p>
          </div>
        </div>
        <div className="product-trust-badge-item">
          <RotateCcw size={18} className="trust-icon" />
          <div>
            <strong>Safe Delivery</strong>
            <p>Heavy duty armored packaging</p>
          </div>
        </div>
      </div>
    </section>
  )
}
