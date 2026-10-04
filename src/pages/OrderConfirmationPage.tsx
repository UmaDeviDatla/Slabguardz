import { Check, Copy, ArrowRight, ShieldCheck, Package } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const [copied, setCopied] = useState(false)

  const copyPaymentId = () => {
    if (!paymentId) return
    navigator.clipboard.writeText(paymentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!paymentId) {
    return (
      <Container className="order-confirmation-page">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <p className="eyebrow">Order details</p>
          <h1 id="confirmation-title">Confirmation details unavailable</h1>
          <p>Return to your cart to review your order or contact us for help.</p>
          <Link className="button button-primary" to="/cart">
            Return to Cart
          </Link>
        </section>
      </Container>
    )
  }

  return (
    <Container className="order-confirmation-page">
      <motion.section
        className="confirmation-card"
        aria-labelledby="confirmation-title"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated Checkmark Circle */}
        <motion.div
          className="confirmation-icon-animated"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.15 }}
        >
          <Check size={36} strokeWidth={3} />
        </motion.div>

        <p className="eyebrow">Order Confirmed</p>
        <h1 id="confirmation-title">Payment Successful!</h1>
        <p className="confirmation-thanks">Thank you for collecting with SlabGuardz.</p>
        <p className="confirmation-message">
          Your payment has been verified and your order has been sent to our fulfillment vault for armored packaging.
        </p>

        <dl className="confirmation-details">
          <div className="confirmation-detail confirmation-amount">
            <dt>Amount Paid</dt>
            <dd>
              {snapshot
                ? formatPrice(snapshot.amount, snapshot.currencyCode)
                : 'Confirmed'}
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Razorpay Reference</dt>
            <dd className="confirmation-payment-id-wrap">
              <span className="confirmation-payment-id">{paymentId}</span>
              <button
                type="button"
                className="copy-ref-btn"
                onClick={copyPaymentId}
                title="Copy reference ID"
                aria-label="Copy reference ID"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Payment Gateway</dt>
            <dd>Razorpay Verified Checkout</dd>
          </div>

          <div className="confirmation-detail">
            <dt>Status</dt>
            <dd>
              <span className="confirmation-paid-badge">
                <Check size={13} strokeWidth={2.4} /> Verified & Paid
              </span>
            </dd>
          </div>
        </dl>

        <div className="confirmation-steps-banner">
          <div className="step-item">
            <Package size={20} />
            <div>
              <strong>Armored Packing</strong>
              <span>Prepping cards in rigid cases</span>
            </div>
          </div>
          <div className="step-item">
            <ShieldCheck size={20} />
            <div>
              <strong>Dispatch Notice</strong>
              <span>Tracking details sent via SMS & Email</span>
            </div>
          </div>
        </div>

        <p className="confirmation-email-note">
          Keep your Razorpay Reference ID handy for any queries with our support concierge.
        </p>

        <div className="confirmation-actions">
          <Link className="button button-primary" to="/shop">
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link className="button button-secondary" to="/account">
            View Account Hub
          </Link>
        </div>
      </motion.section>
    </Container>
  )
}
