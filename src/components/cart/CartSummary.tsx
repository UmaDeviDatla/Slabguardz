import { Link } from 'react-router-dom'
import { formatPrice } from '../../lib/formatters'
import { useCart } from '../../hooks/useCart'
import { ButtonLink, Button } from '../ui/Button'

type CartSummaryProps = {
  compact?: boolean
}

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

  return (
    <section
      className={`cart-summary${compact ? ' cart-summary-compact' : ''}`}
    >
      <div>
        <span>Subtotal</span>
        <strong>
          {formatPrice(subtotal, currencyCode)}
        </strong>
      </div>

      <div>
        <span>Shipping</span>
        <strong>
          {shippingTotal === 0
            ? 'Free'
            : formatPrice(shippingTotal, currencyCode)}
        </strong>
      </div>

      <div>
        <span>Tax</span>
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

      {!compact && (
        <Button
          className="cart-checkout-button"
          onClick={checkout}
          disabled={isCheckoutLoading}
        >
          {isCheckoutLoading ? 'Redirecting...' : 'Proceed to checkout'}
        </Button>
      )}

      {compact && (
        <ButtonLink
          to="/cart"
          variant="secondary"
          className="cart-checkout-button"
        >
          View full cart
        </ButtonLink>
      )}

      <Link
        className="cart-continue-link"
        to="/shop"
      >
        Continue shopping
      </Link>
    </section>
  )
}