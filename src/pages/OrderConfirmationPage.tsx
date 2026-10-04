import { Check } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { formatPrice } from '../lib/formatters'

type CheckoutSnapshot = {
  amount: number
  currencyCode: string
}

function getCheckoutSnapshot(paymentId: string): CheckoutSnapshot | null {
  try {
    const storedSnapshot = sessionStorage.getItem(
      `slabguardz:checkout-confirmation:${paymentId}`,
    )
    if (!storedSnapshot) return null

    const snapshot: unknown = JSON.parse(storedSnapshot)
    if (
      !snapshot ||
      typeof snapshot !== 'object' ||
      !('amount' in snapshot) ||
      typeof snapshot.amount !== 'number' ||
      !Number.isFinite(snapshot.amount) ||
      !('currencyCode' in snapshot) ||
      typeof snapshot.currencyCode !== 'string'
    ) {
      return null
    }

    return {
      amount: snapshot.amount,
      currencyCode: snapshot.currencyCode,
    }
  } catch (storageError) {
    console.error('Unable to read checkout confirmation details.', storageError)
    return null
  }
}

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('razorpay_payment_id')?.trim() ?? ''
  const snapshot = paymentId ? getCheckoutSnapshot(paymentId) : null

  if (!paymentId) {
    return (
      <Container className="order-confirmation-page">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <p className="eyebrow">Order details</p>
          <h1 id="confirmation-title">Confirmation details unavailable</h1>
          <p>
            Return to your cart to review your order or contact us for help.
          </p>
          <Link className="button button-primary" to="/cart">
            Return to cart
          </Link>
        </section>
      </Container>
    )
  }

  return (
    <Container className="order-confirmation-page">
      <section className="confirmation-card" aria-labelledby="confirmation-title">
        <div className="confirmation-icon" aria-hidden="true">
          <Check size={30} strokeWidth={2.5} />
        </div>
        <p className="eyebrow">SlabGuardz order update</p>
        <h1 id="confirmation-title">Payment Successful!</h1>
        <p className="confirmation-thanks">Thank you for your order.</p>
        <p className="confirmation-message">
          Your payment has been received successfully.
        </p>

        <dl className="confirmation-details">
          <div className="confirmation-detail confirmation-amount">
            <dt>Amount paid</dt>
            <dd>
              {snapshot
                ? formatPrice(snapshot.amount, snapshot.currencyCode)
                : 'Unavailable'}
            </dd>
          </div>
          <div className="confirmation-detail">
            <dt>Razorpay Payment ID</dt>
            <dd className="confirmation-payment-id">{paymentId}</dd>
          </div>
          <div className="confirmation-detail">
            <dt>Payment method</dt>
            <dd>Razorpay</dd>
          </div>
          <div className="confirmation-detail">
            <dt>Payment status</dt>
            <dd><span className="confirmation-paid">Paid</span></dd>
          </div>
        </dl>

        <p className="confirmation-email-note">
          Order details and shipping updates will be sent to your email.
        </p>
        <Link className="button button-primary" to="/shop">
          Continue shopping
        </Link>
      </section>
    </Container>
  )
}
