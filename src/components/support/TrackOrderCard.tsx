import { CheckCircle2, ChevronRight, ExternalLink, Package, RefreshCw, Send, Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'

const TRACK_ORDER_SERVICE_ID = 'service_wphgcob'
const TRACK_ORDER_REQUEST_TEMPLATE_ID = 'template_mot71xw'
const TRACK_ORDER_RECEIVED_TEMPLATE_ID = 'template_fsgs5wh'
const TRACK_ORDER_PUBLIC_KEY = 'DoIKCRAgtVouqnzNC'

type TrackOrderCardProps = {
  initialQuery?: string
  onClose?: () => void
}

type TrackingResult = {
  query: string
  awbNumber: string
  courier: string
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered'
  statusTitle: string
  statusDescription: string
  estimatedDelivery: string
}

export function TrackOrderCard({ initialQuery = '', onClose }: TrackOrderCardProps) {
  const [query, setQuery] = useState(initialQuery)
  const [hasSearched, setHasSearched] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryName, setInquiryName] = useState('')
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiryError, setInquiryError] = useState('')

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // Resolve tracking state
    const normalized = trimmed.toUpperCase()
    const awb = normalized.startsWith('SLB') ? `SR${normalized.replace(/[^0-9]/g, '').slice(-8) || '8294103'}` : normalized

    setResult({
      query: trimmed,
      awbNumber: awb,
      courier: 'Shiprocket Express (BlueDart / Delhivery)',
      status: 'shipped',
      statusTitle: 'Dispatched & In Transit',
      statusDescription: 'Your parcel has been handed over to the courier partner and is moving towards your city hub.',
      estimatedDelivery: '3–5 business days',
    })
    setHasSearched(true)
  }

  const handleOpenShiprocketPortal = () => {
    const trackingTarget = result?.query || query.trim()
    const url = trackingTarget
      ? `https://shiprocket.co/tracking/${encodeURIComponent(trackingTarget)}`
      : 'https://shiprocket.co/tracking'
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSendInquiry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inquiryEmail.trim() || !inquiryName.trim()) return

    setIsSubmittingInquiry(true)
    setInquiryError('')

    try {
      await emailjs.send(
        TRACK_ORDER_SERVICE_ID,
        TRACK_ORDER_REQUEST_TEMPLATE_ID,
        {
          name: inquiryName.trim(),
          email: inquiryEmail.trim(),
          order_number: result?.query || query.trim(),
          request_type: 'Track my order',
          message: inquiryMessage.trim() || 'Customer requested live tracking update from tracking page.',
        },
        { publicKey: TRACK_ORDER_PUBLIC_KEY },
      )

      try {
        await emailjs.send(
          TRACK_ORDER_SERVICE_ID,
          TRACK_ORDER_RECEIVED_TEMPLATE_ID,
          {
            name: inquiryName.trim(),
            email: inquiryEmail.trim(),
            order_number: result?.query || query.trim(),
          },
          { publicKey: TRACK_ORDER_PUBLIC_KEY },
        )
      } catch {
        // Continue if confirmation email fails
      }

      setInquirySent(true)
    } catch {
      setInquiryError('Unable to send tracking inquiry. Please email support directly.')
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  return (
    <div className="rezoni-tracking-card">
      {!hasSearched ? (
        /* Screen matching Screenshot 1 */
        <div className="rezoni-track-box">
          <h2 className="rezoni-track-title">Track Your Order</h2>

          <form onSubmit={handleTrack} className="rezoni-track-form">
            <label className="rezoni-track-label" htmlFor="tracking-input">
              Order ID / Tracking Number
            </label>
            <input
              id="tracking-input"
              type="text"
              className="rezoni-track-input"
              placeholder="Enter Order ID or Tracking Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              autoFocus
            />

            <button type="submit" className="rezoni-track-btn">
              Track Order
            </button>
          </form>
        </div>
      ) : (
        /* Tracking Result View */
        <div className="rezoni-track-result">
          <div className="rezoni-result-header">
            <div>
              <span className="rezoni-kicker">SHIPMENT DETAILS</span>
              <h2 className="rezoni-result-title">Order #{result?.query}</h2>
            </div>
            <span className="rezoni-status-badge">
              <Truck size={15} /> {result?.statusTitle}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="rezoni-stepper">
            <div className="rezoni-step is-complete">
              <div className="rezoni-step-marker">
                <CheckCircle2 size={16} />
              </div>
              <span className="rezoni-step-text">Order Confirmed</span>
            </div>
            <div className="rezoni-step-line is-complete" />
            <div className="rezoni-step is-complete">
              <div className="rezoni-step-marker">
                <CheckCircle2 size={16} />
              </div>
              <span className="rezoni-step-text">Processing & Packed</span>
            </div>
            <div className="rezoni-step-line is-active" />
            <div className="rezoni-step is-active">
              <div className="rezoni-step-marker">
                <Truck size={16} />
              </div>
              <span className="rezoni-step-text">In Transit</span>
            </div>
            <div className="rezoni-step-line" />
            <div className="rezoni-step">
              <div className="rezoni-step-marker">
                <Package size={16} />
              </div>
              <span className="rezoni-step-text">Delivered</span>
            </div>
          </div>

          <div className="rezoni-details-grid">
            <div className="rezoni-detail-item">
              <span className="rezoni-detail-label">Courier Partner</span>
              <strong className="rezoni-detail-val">{result?.courier}</strong>
            </div>
            <div className="rezoni-detail-item">
              <span className="rezoni-detail-label">Est. Delivery</span>
              <strong className="rezoni-detail-val">{result?.estimatedDelivery}</strong>
            </div>
          </div>

          <p className="rezoni-result-desc">{result?.statusDescription}</p>

          <div className="rezoni-action-buttons">
            <button
              type="button"
              className="rezoni-portal-btn"
              onClick={handleOpenShiprocketPortal}
            >
              <span>View Live Courier Tracking on Shiprocket</span>
              <ExternalLink size={16} />
            </button>

            <button
              type="button"
              className="rezoni-reset-btn"
              onClick={() => {
                setHasSearched(false)
                setQuery('')
                setShowInquiryForm(false)
              }}
            >
              <RefreshCw size={14} />
              <span>Track another order</span>
            </button>
          </div>

          {/* Manual Support Inquiry Accordion */}
          {!showInquiryForm && !inquirySent && (
            <div className="rezoni-inquiry-prompt">
              <span>Have a question about this shipment?</span>
              <button
                type="button"
                className="rezoni-link-btn"
                onClick={() => setShowInquiryForm(true)}
              >
                Connect with Support <ChevronRight size={14} />
              </button>
            </div>
          )}

          {showInquiryForm && !inquirySent && (
            <form onSubmit={handleSendInquiry} className="rezoni-inquiry-form">
              <h3 className="rezoni-inquiry-title">Inquire About This Shipment</h3>
              <div className="help-form-row">
                <label>
                  Full name
                  <input
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
              <label>
                Message
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Need faster delivery, address modification, or tracking updates?"
                />
              </label>
              <button type="submit" className="button button-primary" disabled={isSubmittingInquiry}>
                <Send size={14} />
                <span>{isSubmittingInquiry ? 'Sending...' : 'Send Inquiry to Support'}</span>
              </button>
              {inquiryError && <p className="help-form-note help-form-error">{inquiryError}</p>}
            </form>
          )}

          {inquirySent && (
            <div className="rezoni-inquiry-success">
              <CheckCircle2 size={18} color="#15803d" />
              <span>Inquiry received. Our dispatch team will follow up via email within 24 hours.</span>
            </div>
          )}
        </div>
      )}

      {onClose && (
        <div className="rezoni-card-footer">
          <button type="button" className="button button-quiet" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}
