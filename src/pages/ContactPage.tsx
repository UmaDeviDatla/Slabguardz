import emailjs from '@emailjs/browser'
import {
  ArrowRight,
  ChevronDown,
  Mail,
  PackageSearch,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageIntro } from '../components/ui/PageIntro'
import { TrackOrderCard } from '../components/support/TrackOrderCard'
import { ImageUploadField, type UploadedImage } from '../components/support/ImageUploadField'

const EMAILJS_SERVICE_ID = 'service_ozo9wjf'
const CONTACT_TEMPLATE_ID = 'template_0rwlbxm'
const EMAILJS_PUBLIC_KEY = 'EOVWqgKt9C7QPNxsL'

const RETURN_ORDER_SERVICE_ID = 'service_axhv4np'
const RETURN_ORDER_TEMPLATE_ID = 'template_1uotb2a'
const RETURN_ORDER_PUBLIC_KEY = 'r_xQqeSv4DSoQIcvj'

const CANCEL_ORDER_SERVICE_ID = 'service_axhv4np'
const CANCEL_ORDER_TEMPLATE_ID = 'template_fr89duj'
const CANCEL_ORDER_PUBLIC_KEY = 'r_xQqeSv4DSoQIcvj'

const RETURN_REASON_OPTIONS = [
  'Damaged product / transit damage',
  'Wrong product received',
  'Product not as expected / description mismatch',
  'Missing item or seal issue',
  'Changed my mind',
  'Other',
]

const CANCEL_REASON_OPTIONS = [
  'Ordered by mistake',
  'Changed my mind',
  'Ordered the wrong product / slab type',
  'Duplicate order placement',
  'Found a better option',
  'Delivery address error',
  'Other',
]

type HelpAction = 'track' | 'return' | 'cancel' | 'issue'
type RequestStatus = 'idle' | 'success' | 'error'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const faqs = [
  [
    'How do I track my order?',
    'Click "Track Your Shipment" above and enter your Order ID or tracking docket. You can check live status or open official Shiprocket tracking instantly.',
  ],
  [
    'What is your return and replacement policy?',
    'Submit a return request above with your order details and photos of the item or damage. Our Orders team reviews requests within 24 hours.',
  ],
  [
    'How do I request an order cancellation?',
    'Submit a cancellation request as soon as possible before warehouse dispatch. Once processed, our team confirms status via email.',
  ],
  [
    'What should I do if my order arrives damaged?',
    'Use the Return & Replacement form above, select "Damaged product", and upload photos from your device for expedited replacement.',
  ],
  [
    'What is your shipping policy?',
    'Free express shipping across India on orders above ₹1,499. Orders are shipped via Shiprocket with verified tracking links sent via SMS and email.',
  ],
  [
    'How do I choose the right SlabGuardz bumper for my slab?',
    'Our precision bumpers are tailored for standard PSA, BGS, and CGC slabs. Contact our concierge team below if you need sizing guidance.',
  ],
]

const serviceHubCards = [
  {
    id: 'track' as HelpAction,
    icon: PackageSearch,
    title: 'Track Your Shipment',
    description: 'Get real-time courier tracking updates, docket numbers, and delivery timelines.',
    action: 'Track Order',
  },
  {
    id: 'return' as HelpAction,
    icon: RotateCcw,
    title: 'Returns & Replacements',
    description: 'Initiate a replacement or return request for transit-damaged items with photo proof.',
    action: 'Return Request',
  },
  {
    id: 'cancel' as HelpAction,
    icon: XCircle,
    title: 'Order Cancellations',
    description: 'Request cancellation of orders prior to courier warehouse dispatch.',
    action: 'Cancel Order',
  },
  {
    id: 'issue' as HelpAction,
    icon: Mail,
    title: 'Collector Concierge',
    description: 'Speak directly with our card authenticity, protection, and grading specialists.',
    action: 'Contact Concierge',
  },
]

export function ContactPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const contactFormRef = useRef<HTMLElement>(null)

  const requestedAction = searchParams.get('help') as HelpAction | null
  const [activeAction, setActiveAction] = useState<HelpAction | null>(() => {
    if (location.pathname === '/track-order') return 'track'
    return serviceHubCards.some((card) => card.id === requestedAction) ? requestedAction : null
  })

  const openAction = (action: HelpAction) => {
    if (action === 'issue') {
      // Scroll smoothly to the contact form for Collector Concierge
      contactFormRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setActiveAction(action)
    setSearchParams({ help: action })
  }

  const closeAction = () => {
    setActiveAction(null)
    setSearchParams({})
    if (location.pathname === '/track-order') {
      navigate('/contact')
    }
  }

  return (
    <div className="contact-help-page">
      <div className="contact-page-intro">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact & Help</span>
        </nav>
        <PageIntro
          eyebrow="Support center"
          title="Contact & Help"
          description="Need help with an order or your collection? We are here to make the next step simple."
        />
      </div>

      {/* Modern Order Services Section matching Screenshot 4 */}
      <section className="account-support-section" aria-labelledby="help-actions-title">
        <div className="help-container">
          <div className="account-support-header">
            <p className="eyebrow">ORDER SERVICES</p>
            <h2 id="help-actions-title">How can we assist you today?</h2>
            <p>
              Select a service below to connect with our dedicated team. We verify your order details
              immediately to expedite all inquiries.
            </p>
          </div>

          <div className="account-actions-grid" role="list">
            {serviceHubCards.map(({ id, icon: Icon, title, description, action }) => (
              <motion.div whileHover={{ y: -4 }} key={id}>
                <button
                  type="button"
                  onClick={() => openAction(id)}
                  className="account-action-card text-left w-full cursor-pointer"
                  role="listitem"
                  style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
                >
                  <div className="account-action-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="account-action-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="account-action-link">
                    {action} <ArrowRight size={15} />
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="help-faq-section" aria-labelledby="help-faq-title">
        <div className="help-container help-faq-layout">
          <div>
            <p className="eyebrow">Answers, first</p>
            <h2 id="help-faq-title">Frequently asked questions</h2>
            <p>Find a quick starting point, or reach out to our team for something more specific.</p>
          </div>
          <div className="help-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* General Contact Form */}
      <section ref={contactFormRef}>
        <ContactForm />
      </section>

      {/* Interactive Modal / Dialog */}
      {activeAction && <HelpDialog action={activeAction} onClose={closeAction} />}
    </div>
  )
}

function HelpDialog({ action, onClose }: { action: HelpAction; onClose: () => void }) {
  return (
    <div className="help-dialog-layer">
      <button
        className="help-dialog-backdrop"
        type="button"
        aria-label="Close help form"
        onClick={onClose}
      />
      <section
        className={`help-dialog${action === 'track' ? ' rezoni-dialog-style' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
      >
        <button
          className="help-dialog-close"
          type="button"
          aria-label="Close help form"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {action === 'track' ? (
          <TrackOrderCard onClose={onClose} />
        ) : action === 'return' ? (
          <ReturnForm onClose={onClose} />
        ) : action === 'cancel' ? (
          <CancelForm onClose={onClose} />
        ) : null}
      </section>
    </div>
  )
}

/**
 * Enhanced Return Form matching Screenshot 2 with Local Device Image Uploads
 */
function ReturnForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return

    const formData = new FormData(formRef.current)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const orderNumber = String(formData.get('order_number') ?? '').trim()
    const returnReason = String(formData.get('return_reason') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !isValidEmail(email) || !orderNumber || !returnReason) {
      setStatus('error')
      setErrorMessage(
        'Please complete the required fields: full name, valid email, order number, and reason for return.',
      )
      return
    }

    setIsSending(true)
    setStatus('idle')
    setErrorMessage('')

    const filesSummary =
      images.length > 0
        ? `\n\n[Uploaded Photos from Device: ${images.length} file(s) - ${images.map((img) => img.name).join(', ')}]`
        : ''

    try {
      await emailjs.send(
        RETURN_ORDER_SERVICE_ID,
        RETURN_ORDER_TEMPLATE_ID,
        {
          name,
          email,
          order_number: orderNumber,
          return_reason: returnReason,
          message: `${message}${filesSummary}`,
          // Pass compressed image data URLs for templates configured with attachment tags
          image_attachment_1: images[0]?.dataUrl ?? '',
          image_attachment_2: images[1]?.dataUrl ?? '',
          image_attachment_3: images[2]?.dataUrl ?? '',
          attachment_preview: images[0]?.dataUrl ?? '',
          has_attachments: images.length > 0 ? 'Yes' : 'No',
          attachments_count: images.length,
          attachments_summary: images.map((i) => i.name).join(', '),
        },
        { publicKey: RETURN_ORDER_PUBLIC_KEY },
      )

      setCustomerName(name)
      formRef.current.reset()
      setImages([])
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage(
        'We could not send your return request right now. Please try again in a moment.',
      )
    } finally {
      setIsSending(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="help-form help-track-success">
        <p className="eyebrow">RETURN REQUEST RECEIVED</p>
        <h2 id="help-dialog-title">Return request received</h2>
        <p>
          Thanks, {customerName}. We&apos;ve received your return request
          {images.length > 0 ? ' along with your uploaded photos' : ''}. Our Orders team will review
          your request and contact you at the email address provided.
        </p>
        <p className="help-form-security-note">
          Please note that submitting a return request does not automatically approve a return or
          refund. Our team will verify the order and applicable return policy before processing it.
        </p>
        <button className="button button-primary" type="button" onClick={onClose}>
          Back to Support
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="help-form" onSubmit={handleSubmit}>
      <p className="eyebrow">ORDER RETURN</p>
      <h2 id="help-dialog-title">RETURN ORDER</h2>
      <p>Tell us about the item you would like to return and our Orders team will review your request.</p>

      <div className="help-form-row">
        <label>
          Full name
          <input name="name" autoComplete="name" required placeholder="Enter your full name" />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
        </label>
      </div>

      <label>
        Order number
        <input name="order_number" required placeholder="e.g. SLB-10824" />
      </label>

      <label>
        Reason for return
        <select name="return_reason" required defaultValue="">
          <option value="" disabled>
            Select a reason
          </option>
          {RETURN_REASON_OPTIONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </label>

      {/* Image Upload Feature from Local Device Storage */}
      <ImageUploadField
        images={images}
        onImagesChange={setImages}
        maxImages={3}
        label="Attach Photos of Product / Damage"
        helperText="Upload photos from your device to help us quickly verify transit damage or incorrect items (PNG, JPG, WEBP)."
      />

      <label>
        Additional message
        <span className="help-form-help">Optional</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Add any details about the item or issue."
        />
      </label>

      <button className="button button-primary" type="submit" disabled={isSending}>
        {isSending ? 'Submitting request...' : 'Submit return request'}
      </button>

      {status === 'error' && (
        <p className="help-form-note help-form-error" role="alert">
          {errorMessage || 'Something went wrong while sending your return request. Please try again.'}
        </p>
      )}
    </form>
  )
}

/**
 * Enhanced Cancellation Form matching Screenshot 3 with Local Device Image Uploads
 */
function CancelForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return

    const formData = new FormData(formRef.current)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const orderNumber = String(formData.get('order_number') ?? '').trim()
    const cancelReason = String(formData.get('cancel_reason') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !isValidEmail(email) || !orderNumber || !cancelReason) {
      setStatus('error')
      setErrorMessage(
        'Please complete the required fields: full name, valid email, order number, and reason for cancellation.',
      )
      return
    }

    setIsSending(true)
    setStatus('idle')
    setErrorMessage('')

    const filesSummary =
      images.length > 0
        ? `\n\n[Uploaded Proof from Device: ${images.length} file(s) - ${images.map((img) => img.name).join(', ')}]`
        : ''

    try {
      await emailjs.send(
        CANCEL_ORDER_SERVICE_ID,
        CANCEL_ORDER_TEMPLATE_ID,
        {
          name,
          email,
          order_number: orderNumber,
          cancel_reason: cancelReason,
          message: `${message}${filesSummary}`,
          image_attachment_1: images[0]?.dataUrl ?? '',
          image_attachment_2: images[1]?.dataUrl ?? '',
          image_attachment_3: images[2]?.dataUrl ?? '',
          attachment_preview: images[0]?.dataUrl ?? '',
          has_attachments: images.length > 0 ? 'Yes' : 'No',
          attachments_count: images.length,
          attachments_summary: images.map((i) => i.name).join(', '),
        },
        { publicKey: CANCEL_ORDER_PUBLIC_KEY },
      )

      setCustomerName(name)
      formRef.current.reset()
      setImages([])
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage(
        'We could not send your cancellation request right now. Please try again in a moment.',
      )
    } finally {
      setIsSending(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="help-form help-track-success">
        <p className="eyebrow">CANCELLATION REQUEST RECEIVED</p>
        <h2 id="help-dialog-title">Cancellation request received</h2>
        <p>
          Thanks, {customerName}. We&apos;ve received your cancellation request
          {images.length > 0 ? ' and uploaded attachments' : ''}. Our Orders team will verify your
          order status and contact you at the email address provided.
        </p>
        <p className="help-form-security-note">
          Please note that submitting a cancellation request does not automatically cancel your order.
          Our Orders team will verify warehouse dispatch eligibility before processing cancellation.
        </p>
        <button className="button button-primary" type="button" onClick={onClose}>
          Back to Support
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="help-form" onSubmit={handleSubmit}>
      <p className="eyebrow">ORDER REQUEST</p>
      <h2 id="help-dialog-title">REQUEST CANCELLATION</h2>
      <p>Send your request as soon as possible. Cancellation is not confirmed until reviewed.</p>

      <div className="help-form-row">
        <label>
          Full name
          <input name="name" autoComplete="name" required placeholder="Enter your full name" />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
        </label>
      </div>

      <label>
        Order number
        <input name="order_number" required placeholder="e.g. SLB-10824" />
      </label>

      <label>
        Reason for cancellation
        <select name="cancel_reason" required defaultValue="">
          <option value="" disabled>
            Select a reason
          </option>
          {CANCEL_REASON_OPTIONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </label>

      {/* Image Upload Feature from Local Device Storage */}
      <ImageUploadField
        images={images}
        onImagesChange={setImages}
        maxImages={3}
        label="Attach Screenshots / Proof (Optional)"
        helperText="Upload screenshots from your device (e.g. duplicate payment or order details) to expedite cancellation."
      />

      <label>
        Additional message
        <span className="help-form-help">Optional</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Any additional details regarding your cancellation."
        />
      </label>

      <button className="button button-primary" type="submit" disabled={isSending}>
        {isSending ? 'Submitting request...' : 'Submit cancellation request'}
      </button>

      {status === 'error' && (
        <p className="help-form-note help-form-error" role="alert">
          {errorMessage || 'We could not send your cancellation request right now. Please try again in a moment.'}
        </p>
      )}
    </form>
  )
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<RequestStatus>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return
    setIsSending(true)
    setStatus('idle')

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        CONTACT_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      formRef.current.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="contact-form-section" aria-labelledby="contact-form-title">
      <div className="contact-form-container">
        <div className="contact-form-intro">
          <p className="eyebrow">Still need help?</p>
          <h2 id="contact-form-title">Contact our team.</h2>
          <p>Tell us what you need and the SlabGuardz team will get back to you.</p>
        </div>
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-row">
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" rows={6} required />
          </label>
          <div className="contact-form-footer">
            <button className="button button-primary" type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send message'}
            </button>
            {status === 'success' && (
              <p className="contact-form-status contact-form-status-success" role="status">
                Thank you! Your message has been sent successfully.
              </p>
            )}
            {status === 'error' && (
              <p className="contact-form-status contact-form-status-error" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
