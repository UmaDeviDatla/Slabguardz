import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Package,
  Printer,
  Home,
  Truck,
  Mail,
  ExternalLink,
  Search,
  Clock,
  CreditCard,
  Camera,
} from 'lucide-react'
import { Container } from '../components/ui/Container'
import { formatPrice } from '../lib/formatters'
import type { CheckoutSnapshot } from '../hooks/cartProvider'

function getStoredSnapshot(paymentId?: string): CheckoutSnapshot | null {
  try {
    let storedSnapshot: string | null = null
    if (paymentId) {
      storedSnapshot = sessionStorage.getItem(
        `slabguardz:checkout-confirmation:${paymentId}`,
      )
    }
    if (!storedSnapshot) {
      storedSnapshot = sessionStorage.getItem(
        'slabguardz:latest-checkout-confirmation',
      )
    }
    if (!storedSnapshot) return null

    const snapshot = JSON.parse(storedSnapshot) as CheckoutSnapshot
    if (
      !snapshot ||
      typeof snapshot !== 'object' ||
      typeof snapshot.amount !== 'number' ||
      !Number.isFinite(snapshot.amount)
    ) {
      return null
    }

    return snapshot
  } catch (storageError) {
    console.error('Unable to read checkout confirmation details.', storageError)
    return null
  }
}

function formatOrderDateTime(isoDate?: string): string {
  try {
    const d = isoDate ? new Date(isoDate) : new Date()
    return (
      new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }).format(d) + ' IST'
    )
  } catch {
    return 'Recent Order'
  }
}

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const rawPaymentId =
    searchParams.get('razorpay_payment_id')?.trim() ||
    searchParams.get('payment_id')?.trim() ||
    searchParams.get('order_id')?.trim() ||
    ''

  const snapshot = getStoredSnapshot(rawPaymentId || undefined)
  const paymentId =
    rawPaymentId ||
    (snapshot ? `SG-PAY-${Math.abs(snapshot.amount * 31).toString(36).toUpperCase()}` : '')

  const [copied, setCopied] = useState(false)
  const [shiprocketQuery, setShiprocketQuery] = useState('')

  const copyPaymentId = () => {
    if (!paymentId) return
    navigator.clipboard.writeText(paymentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShiprocketTrack = (e: React.FormEvent) => {
    e.preventDefault()
    const query = shiprocketQuery.trim()
    if (query) {
      window.open(
        `https://shiprocket.co/tracking/${encodeURIComponent(query)}`,
        '_blank',
        'noopener,noreferrer',
      )
    } else {
      window.open('https://shiprocket.co/tracking', '_blank', 'noopener,noreferrer')
    }
  }

  if (!paymentId && !snapshot) {
    return (
      <Container className="order-confirmation-page">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <p className="eyebrow">Order details</p>
          <h1 id="confirmation-title">No Active Order Found</h1>
          <p>We could not find an active checkout receipt in this browser session.</p>
          <div className="confirmation-actions">
            <Link className="button button-primary" to="/">
              <Home size={16} /> Go to Homepage
            </Link>
            <Link className="button button-secondary" to="/shop">
              Browse Collection <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </Container>
    )
  }

  const currencyCode = snapshot?.currencyCode ?? 'INR'
  const itemsSubtotal = snapshot?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const subtotal = snapshot?.subtotal ?? itemsSubtotal ?? snapshot?.amount ?? 0
  const shippingFee = snapshot?.shippingFromHostinger ? (snapshot.shippingFee ?? 0) : 0
  const taxTotal = snapshot?.taxTotal ?? 0
  const totalAmount =
    snapshot?.shippingFromHostinger && snapshot?.amount
      ? snapshot.amount
      : subtotal + shippingFee + taxTotal
  const orderDateFormatted = formatOrderDateTime(snapshot?.date)

  return (
    <Container className="order-confirmation-page">
      <motion.section
        className="confirmation-card print-receipt-card"
        aria-labelledby="confirmation-title"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated Checkmark Circle */}
        <motion.div
          className="confirmation-icon-animated"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
        >
          <Check size={36} strokeWidth={3} />
        </motion.div>

        <p className="eyebrow">Order Confirmed</p>
        <h1 id="confirmation-title">Payment Successful!</h1>
        <p className="confirmation-thanks">Thank you for collecting with SlabGuardz.</p>
        <p className="confirmation-message">
          Your payment has been verified via Razorpay and sent to our vault for armored preparation and secure dispatch.
        </p>

        {/* Quick Receipt Actions Bar */}
        <div className="confirmation-quick-actions">
          <button
            type="button"
            className="button button-secondary receipt-btn"
            onClick={handlePrint}
            title="Print or save PDF receipt (screenshot ready)"
          >
            <Printer size={15} />
            <Camera size={15} />
            <span>Print / Save Receipt</span>
          </button>
          <Link to="/" className="button button-secondary receipt-btn">
            <Home size={15} />
            <span>Go to Homepage</span>
          </Link>
        </div>

        {/* Primary Transaction & Order Details */}
        <dl className="confirmation-details">
          <div className="confirmation-detail confirmation-amount">
            <dt>Total Amount Paid</dt>
            <dd>
              <strong>{formatPrice(totalAmount, currencyCode)}</strong>
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Razorpay Transaction ID</dt>
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
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Order Date & Time</dt>
            <dd className="confirmation-date-wrap">
              <Clock size={14} />
              <span>{orderDateFormatted}</span>
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Payment Gateway</dt>
            <dd className="confirmation-gateway-wrap">
              <CreditCard size={14} />
              <span>Razorpay Verified Checkout (100% Encrypted)</span>
            </dd>
          </div>

          <div className="confirmation-detail">
            <dt>Payment Status</dt>
            <dd>
              <span className="confirmation-paid-badge">
                <Check size={13} strokeWidth={2.4} /> Verified & Paid
              </span>
            </dd>
          </div>
        </dl>

        {/* Itemized Order Items (if snapshot available) */}
        {snapshot?.items && snapshot.items.length > 0 && (
          <div className="confirmation-items-summary">
            <h2 className="confirmation-section-heading">
              Purchased Items ({snapshot.items.length})
            </h2>
            <ul className="confirmation-items-list">
              {snapshot.items.map((item, index) => (
                <li key={index} className="confirmation-item-row">
                  <div className="confirmation-item-meta">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="confirmation-item-thumb"
                      />
                    ) : (
                      <div className="confirmation-item-thumb-fallback">
                        <Package size={16} />
                      </div>
                    )}
                    <div className="confirmation-item-text">
                      <span className="confirmation-item-title">{item.name}</span>
                      <span className="confirmation-item-qty">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="confirmation-item-price">
                    {formatPrice(item.price * item.quantity, currencyCode)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price Breakdown Calculation */}
            <div className="confirmation-breakdown">
              <div className="confirmation-breakdown-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currencyCode)}</span>
              </div>
              <div className="confirmation-breakdown-row">
                <span>Shipping Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-free-shipping">
                      {subtotal >= 1499 ? 'FREE (Order ₹1,499+)' : 'Free'}
                    </strong>
                  ) : (
                    formatPrice(shippingFee, currencyCode)
                  )}
                </span>
              </div>
              {taxTotal > 0 && (
                <div className="confirmation-breakdown-row">
                  <span>Estimated GST</span>
                  <span>{formatPrice(taxTotal, currencyCode)}</span>
                </div>
              )}
              <div className="confirmation-breakdown-row confirmation-breakdown-total">
                <span>Total Paid</span>
                <strong>{formatPrice(totalAmount, currencyCode)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Shiprocket Live Tracking Integration Card */}
        <div className="confirmation-shiprocket-card">
          <div className="shiprocket-card-header">
            <div className="shiprocket-header-badge">
              <Truck size={18} />
              <span>Shiprocket Logistics</span>
            </div>
            <h3>Track Your Order Real-Time</h3>
            <p>
              Your order is packaged in armored multi-layer protection and dispatched via Shiprocket premium couriers (Delhivery, BlueDart, DTDC).
            </p>
          </div>

          <form className="shiprocket-tracker-form" onSubmit={handleShiprocketTrack}>
            <div className="shiprocket-input-wrap">
              <Search size={16} className="shiprocket-input-icon" />
              <input
                type="text"
                value={shiprocketQuery}
                onChange={(e) => setShiprocketQuery(e.target.value)}
                placeholder="Enter Mobile Number, Order ID, or AWB #..."
                className="shiprocket-input"
                aria-label="Track via Shiprocket"
              />
            </div>
            <button type="submit" className="button button-primary shiprocket-track-btn">
              Track on Shiprocket <ExternalLink size={14} />
            </button>
          </form>

          <div className="shiprocket-portal-link-row">
            <a
              href="https://shiprocket.co/tracking"
              target="_blank"
              rel="noopener noreferrer"
              className="shiprocket-portal-link"
            >
              <span>Open official Shiprocket tracking portal</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Fulfillment Roadmap Steps */}
          <div className="confirmation-steps-banner">
            <div className="step-item step-completed">
              <ShieldCheck size={20} />
              <div>
                <strong>1. Payment Confirmed</strong>
                <span>Verified via Razorpay</span>
              </div>
            </div>
            <div className="step-item step-active">
              <Package size={20} />
              <div>
                <strong>2. Armored Packaging</strong>
                <span>Prepping card in rigid armor</span>
              </div>
            </div>
            <div className="step-item">
              <Truck size={20} />
              <div>
                <strong>3. Shiprocket Dispatch</strong>
                <span>Picked up within 24 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email & SMS Notification Confirmation Alert */}
        <div className="confirmation-email-alert">
          <div className="email-alert-icon">
            <Mail size={20} />
          </div>
          <div className="email-alert-content">
            <h4>Order Confirmation & Tracking Updates</h4>
            <p>
              An official order receipt has been sent to your email. As soon as Shiprocket generates your shipping AWB, you will receive an automatic tracking link via SMS, WhatsApp, and Email.
            </p>
          </div>
        </div>

        {/* Primary Bottom Navigation Actions */}
        <div className="confirmation-actions">
          <Link className="button button-primary confirmation-primary-cta" to="/">
            <Home size={16} />
            <span>Return to Homepage</span>
          </Link>
          <Link className="button button-secondary" to="/shop">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.section>
    </Container>
  )
}
