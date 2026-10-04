import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { CartItemRow } from './CartItemRow'
import { CartSummary } from './CartSummary'
import { useCart } from '../../hooks/useCart'
import { Button } from '../ui/Button'

export function CartPageContent() {
  const { lines, isLoading, error, retry } = useCart()

  if (isLoading) {
    return (
      <div className="cart-empty-state" role="status">
        <div className="cart-loading-spinner" />
        <p className="eyebrow">Your Cart</p>
        <h2>Syncing your cart...</h2>
        <p>Connecting with store catalog.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cart-empty-state" role="alert">
        <p className="eyebrow">Connection Notice</p>
        <h2>Unable to sync cart.</h2>
        <p>{error}</p>
        <Button variant="secondary" onClick={retry}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="cart-empty-card">
        <div className="cart-empty-icon">
          <ShoppingBag size={38} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">Your Selection</p>
        <h2>Your cart is currently empty.</h2>
        <p>Discover raw cards, graded slabs, and precision preservation gear curated for collectors.</p>
        <Link className="button button-primary" to="/shop">
          Explore Collection <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-layout">
      <section className="cart-items">
        <div className="cart-items-heading">
          <h1>Your Cart</h1>
          <span>{lines.length} {lines.length === 1 ? 'item' : 'items'} in bag</span>
        </div>
        <div className="cart-items-list">
          <AnimatePresence>
            {lines.map((line) => (
              <motion.div
                key={line.lineItemId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CartItemRow
                  product={line.product}
                  quantity={line.quantity}
                  unitPrice={line.unitPrice}
                  currencyCode={line.currencyCode}
                  variantTitle={line.variantTitle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <div className="cart-summary-sticky-wrap">
        <CartSummary />
      </div>
    </div>
  )
}
