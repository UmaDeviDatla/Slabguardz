import { Link } from 'react-router-dom'
import { ShieldCheck, Truck } from 'lucide-react'
import { formatPrice } from '../../lib/formatters'
import { useCart } from '../../hooks/useCart'
import { ButtonLink, Button } from '../ui/Button'

type CartSummaryProps = {
  compact?: boolean
}

const FREE_SHIPPING_THRESHOLD = 1499

export function CartSummary({ compact = false }: CartSummaryProps) {
  const {
    subtotal,
    shippingTotal,
    taxTotal,
    total,
    currencyCode,
    checkout,
    isCheckoutLoading,
  } = useCart()

  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <section
      className={`cart-summary${compact ? ' cart-summary-compact' : ''}`}
    >
      {/* Free shipping progress bar */}
      <div className="shipping-progress-container">
        <div className="shipping-progress-header">
          <Truck size={16} className="shipping-progress-icon" />
          <span>
            {amountNeeded > 0
              ? `Add ${formatPrice(amountNeeded, currencyCode)} for FREE shipping (Save ₹99)`
              : '🎉 You have unlocked FREE Express Shipping!'}
          </span>
        </div>
        <div className="shipping-progress-bar-bg">
          <div
            className="shipping-progress-bar-fill"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className="cart-summary-line">
        <span>Subtotal</span>
        <strong>
          {formatPrice(subtotal, currencyCode)}
        </strong>
      </div>

      <div className="cart-summary-line">
        <span>Shipping</span>
        <strong>
          {subtotal === 0
            ? '₹0.00'
            : subtotal >= FREE_SHIPPING_THRESHOLD
              ? 'Free'
              : formatPrice(shippingTotal || 99, currencyCode)}
        </strong>
      </div>
      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="cart-shipping-hint">
          Flat ₹99 courier · Free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD, currencyCode)}
        </p>
      )}
      {subtotal >= FREE_SHIPPING_THRESHOLD && (
        <p className="cart-shipping-hint cart-shipping-hint-free">
          ✓ Free Express Shipping Applied
        </p>
      )}

      <div className="cart-summary-line">
        <span>Estimated GST</span>
        <strong>
          {taxTotal === 0
            ? '₹0.00'
            : formatPrice(taxTotal, currencyCode)}
        </strong>
      </div>

      <div className="cart-total">
        <span>Total</span>
        <strong>
          {formatPrice(total, currencyCode)}
        </strong>
      </div>

      <Button
        className="cart-checkout-button"
        onClick={checkout}
        disabled={isCheckoutLoading}
      >
        {isCheckoutLoading ? 'Preparing Checkout...' : 'Proceed to Checkout'}
      </Button>

      {compact && (
        <ButtonLink
          to="/cart"
          variant="secondary"
          className="cart-view-button"
        >
          View Full Cart
        </ButtonLink>
      )}

      <Link
        className="cart-continue-link"
        to="/shop"
      >
        Continue shopping
      </Link>

      <div className="cart-security-badge">
        <ShieldCheck size={16} />
        <span>Secure encrypted checkout with Razorpay</span>
      </div>
    </section>
  )
}