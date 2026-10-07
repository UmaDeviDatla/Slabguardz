import { Check, ChevronDown, Heart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'

type ProductPurchasePanelProps = {
  product: Product
}

const colorOptions = [
  { name: 'Gold', hex: '#f4e39c', soldOut: false },
  { name: 'Silver', hex: '#bfc3c9', soldOut: false },
]

function formatGradedPrice(price: number, currencyCode = 'INR') {
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  if (currencyCode.toUpperCase() === 'INR') {
    return `Rs. ${formattedNumber} INR`
  }
  return `${formattedNumber} ${currencyCode}`
}

function getCleanDescriptionParagraphs(product: Product): string[] {
  if (product.description && product.description.trim()) {
    const plain = product.description
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>?/gm, '')
      .trim()
    const parts = plain
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    if (parts.length >= 2) return parts
    if (parts.length === 1) {
      return [
        parts[0],
        'SlabGuardz offers an unparalleled aesthetic while maintaining functionality and a lightweight, premium feel - the perfect companion for your collection.',
      ]
    }
  }

  if (product.category === 'pokemon-cards') {
    return [
      'Authenticated and preserved in collector-grade condition, this prized TCG collectible is inspected for authenticity, centering, and surface quality to make your collection shine.',
      'SlabGuardz offers an unparalleled aesthetic while maintaining archival protection and a heavyweight, museum-ready presentation - the perfect centerpiece for your collection.',
    ]
  }

  return [
    'Designed for a wide range of graded cards, the SlabGuardz protection line is the first of its kind. Featuring an all-new matte, fingerprint-resistant finish, these cases are sure to make your collection shine.',
    'SlabGuardz offers an unparalleled aesthetic while maintaining functionality and a lightweight, premium feel - the perfect companion for your collection.',
  ]
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Silver')
  const [justAdded, setJustAdded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<'compatibility' | 'box' | null>(null)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.priceUnavailable
  const maxQuantity = product.stockQuantity ?? Number.POSITIVE_INFINITY
  const isAtStockLimit = quantity >= maxQuantity
  const isSaved = isInWishlist(product.id)

  const eyebrowLabel =
    product.category === 'slabguardz-protection'
      ? 'MATTE'
      : product.category.replaceAll('-', ' ').toUpperCase()

  const paragraphs = getCleanDescriptionParagraphs(product)

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product, quantity)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  const toggleSection = (section: 'compatibility' | 'box') => {
    setOpenAccordion((prev) => (prev === section ? null : section))
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://slabguardz.in'
  const shareText = encodeURIComponent(product.name)

  return (
    <section className="gg-purchase-panel">
      {/* Eyebrow */}
      <p className="gg-eyebrow">{eyebrowLabel}</p>

      {/* Product Title */}
      <h1 className="gg-product-title">{product.name}</h1>

      {/* Price */}
      <div className="gg-price-row">
        <span className="gg-price">
          {product.priceUnavailable ? 'Price unavailable' : formatGradedPrice(product.price, product.currencyCode)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <del className="gg-compare-price">
            {formatGradedPrice(product.compareAtPrice, product.currencyCode)}
          </del>
        )}
      </div>

      {/* Tax & Shipping Notice */}
      <p className="gg-tax-note">
        Tax included. <Link to="/faq">Shipping</Link> calculated at checkout.
      </p>

      {/* Star Rating */}
      <div className="gg-stars" aria-label="Rated 5.0 out of 5 stars">
        <span>★★★★★</span>
      </div>

      {/* Description Paragraphs */}
      <div className="gg-description">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Color Swatch Selector */}
      <div className="gg-color-block">
        <p className="gg-field-label">
          <strong>Color:</strong> {selectedColor}
        </p>
        <div className="gg-color-swatches" role="radiogroup" aria-label="Select color">
          {colorOptions.map((option) => {
            const active = selectedColor === option.name
            return (
              <button
                key={option.name}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Color ${option.name}`}
                className={`gg-color-swatch${active ? ' is-active' : ''}`}
                onClick={() => setSelectedColor(option.name)}
              >
                <span
                  className="gg-swatch-inner"
                  style={{ backgroundColor: option.hex }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="gg-quantity-block">
        <label className="gg-field-label" htmlFor="gg-qty-display">
          <strong>Quantity</strong>
        </label>
        <div className="gg-quantity-box" aria-label="Quantity selector">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus size={14} strokeWidth={1.8} />
          </button>
          <span id="gg-qty-display" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isOutOfStock || isAtStockLimit}
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
          >
            <Plus size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Add to Cart + Wishlist Row */}
      <div className="gg-cta-row">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          className={`gg-add-to-cart-btn${justAdded ? ' is-added' : ''}`}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {justAdded ? (
            <>
              <Check size={17} strokeWidth={2.2} />
              <span>Added to cart</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold out</span>
          ) : (
            <span>Add to cart</span>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className={`gg-wishlist-btn${isSaved ? ' is-active' : ''}`}
          aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`}
          aria-pressed={isSaved}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={19} strokeWidth={1.9} fill={isSaved ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Accordion Sections: Compatibility & What's in the box? */}
      <div className="gg-accordions">
        <div className="gg-accordion-item">
          <button
            type="button"
            className="gg-accordion-trigger"
            aria-expanded={openAccordion === 'compatibility'}
            onClick={() => toggleSection('compatibility')}
          >
            <span>Compatibility</span>
            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className={`gg-accordion-icon${openAccordion === 'compatibility' ? ' is-open' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openAccordion === 'compatibility' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="gg-accordion-content"
              >
                <div className="gg-accordion-inner">
                  {product.category === 'pokemon-cards' ? (
                    <p>
                      Encapsulated in a standard tamper-evident graded slab. Compatible with all SlabGuardz precision TPU bumpers, acrylic display stands, and multi-slab wall cabinets.
                    </p>
                  ) : (
                    <p>
                      Precision-engineered to fit standard PSA, BGS, and CGC graded card slabs with a snug, drop-absorbing TPU inner frame and raised polycarbonate bezel.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="gg-accordion-item">
          <button
            type="button"
            className="gg-accordion-trigger"
            aria-expanded={openAccordion === 'box'}
            onClick={() => toggleSection('box')}
          >
            <span>What&apos;s in the box?</span>
            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className={`gg-accordion-icon${openAccordion === 'box' ? ' is-open' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openAccordion === 'box' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="gg-accordion-content"
              >
                <div className="gg-accordion-inner">
                  <ul>
                    <li>1× {product.name}</li>
                    <li>1× Archival dust-free protective poly sleeve</li>
                    <li>Armored shock-resistant collector shipping box</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share Row */}
      <div className="gg-share-row">
        <span className="gg-share-label">Share:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="gg-share-icon"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="gg-share-icon"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Pinterest"
          className="gg-share-icon"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </section>
  )
}
