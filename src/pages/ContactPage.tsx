import emailjs from '@emailjs/browser'
import { AlertCircle, ArrowRight, Box, ChevronDown, RotateCcw, X } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { PageIntro } from '../components/ui/PageIntro'

const EMAILJS_SERVICE_ID = 'service_ozo9wjf'
const CONTACT_TEMPLATE_ID = 'template_0rwlbxm'
const REPORT_ISSUE_TEMPLATE_ID = 'template_a2crnm3'
const EMAILJS_PUBLIC_KEY = 'EOVWqgKt9C7QPNxsL'
const TRACK_ORDER_SERVICE_ID = 'service_wphgcob'
const TRACK_ORDER_REQUEST_TEMPLATE_ID = 'template_mot71xw'
const TRACK_ORDER_RECEIVED_TEMPLATE_ID = 'template_fsgs5wh'
const TRACK_ORDER_PUBLIC_KEY = 'DoIKCRAgtVouqnzNC'
const RETURN_ORDER_SERVICE_ID = 'service_axhv4np'
const RETURN_ORDER_TEMPLATE_ID = 'template_1uotb2a'
const RETURN_ORDER_PUBLIC_KEY = 'r_xQqeSv4DSoQIcvj'
const CANCEL_ORDER_SERVICE_ID = 'service_axhv4np'
const CANCEL_ORDER_TEMPLATE_ID = 'template_fr89duj'
const CANCEL_ORDER_PUBLIC_KEY = 'r_xQqeSv4DSoQIcvj'
const TRACK_ORDER_REQUEST_TYPES = ['Track my order', 'Previous order information', 'Shipping / delivery question', 'Other order question']
const RETURN_REASON_OPTIONS = ['Damaged product', 'Wrong product received', 'Product not as expected', 'Product arrived damaged', 'Changed my mind', 'Other']
const CANCEL_REASON_OPTIONS = ['Ordered by mistake', 'Changed my mind', 'Ordered the wrong product', 'Duplicate order', 'Found a better option', 'Other']
type HelpAction = 'track' | 'return' | 'cancel' | 'issue'
type RequestStatus = 'idle' | 'success' | 'error'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const faqs = [
  ['How do I choose the right SlabGuardz product?', 'Browse product details and specifications on each product page, or contact our team if you need help choosing.'],
  ['How do I track my order?', 'Use Track Order below and enter your details. If lookup is unavailable, our team can help with your request.'],
  ['What is your shipping policy?', 'Shipping details are shown during checkout and in the order information provided for your purchase.'],
  ['What is your return and refund policy?', 'Submit a return request below with your order details and our team will review it with you.'],
  ['How do I cancel an order?', 'Send a cancellation request as soon as possible. Requests are reviewed and are not automatically confirmed.'],
  ['What should I do if my order arrives damaged?', 'Use Report an Issue and include your order number, issue type, and a clear description.'],
]
const actionCards: Array<{ id: HelpAction; title: string; description: string; icon: typeof Box }> = [
  { id: 'track', title: 'Track order', description: 'Check your order status', icon: Box },
  { id: 'return', title: 'Return order', description: 'Request a return review', icon: RotateCcw },
  { id: 'cancel', title: 'Cancel order', description: 'Request an order cancellation', icon: X },
  { id: 'issue', title: 'Report an issue', description: 'Tell us what went wrong', icon: AlertCircle },
]

export function ContactPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedAction = searchParams.get('help') as HelpAction | null
  const [activeAction, setActiveAction] = useState<HelpAction | null>(() => {
    if (location.pathname === '/track-order') return 'track'
    return actionCards.some((card) => card.id === requestedAction) ? requestedAction : null
  })

  const openAction = (action: HelpAction) => { setActiveAction(action); setSearchParams({ help: action }) }
  const closeAction = () => {
    setActiveAction(null)
    setSearchParams({})
    if (location.pathname === '/track-order') {
      navigate('/contact')
    }
  }

  return <div className="contact-help-page">
    <div className="contact-page-intro">
      <nav className="collection-breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact & Help</span></nav>
      <PageIntro eyebrow="Support center" title="Contact & Help" description="Need help with an order or your collection? We are here to make the next step simple." />
    </div>
    <section className="help-actions-section" aria-labelledby="help-actions-title"><div className="help-container"><div className="help-section-heading"><p className="eyebrow">Order support</p><h2 id="help-actions-title">What can we help with?</h2></div><div className="help-action-grid">{actionCards.map(({ id, title, description, icon: Icon }) => <button className="help-action-card" key={id} type="button" onClick={() => openAction(id)}><Icon size={26} strokeWidth={1.6} /><strong>{title}</strong><span>{description}</span><ArrowRight className="help-action-arrow" size={18} strokeWidth={1.8} /></button>)}</div></div></section>
    <section className="help-faq-section" aria-labelledby="help-faq-title"><div className="help-container help-faq-layout"><div><p className="eyebrow">Answers, first</p><h2 id="help-faq-title">Frequently asked questions</h2><p>Find a quick starting point, or reach out to our team for something more specific.</p></div><div className="help-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div></section>
    <ContactForm />
    {activeAction && <HelpDialog action={activeAction} onClose={closeAction} />}
  </div>
}

function HelpDialog({ action, onClose }: { action: HelpAction; onClose: () => void }) {
  return <div className="help-dialog-layer"><button className="help-dialog-backdrop" type="button" aria-label="Close help form" onClick={onClose} /><section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-dialog-title"><button className="help-dialog-close" type="button" aria-label="Close help form" onClick={onClose}><X size={20} /></button>{action === 'track' ? <TrackForm onClose={onClose} /> : action === 'issue' ? <IssueForm onClose={onClose} /> : <RequestForm action={action} onClose={onClose} />}</section></div>
}

function TrackForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [customerName, setCustomerName] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return

    const formData = new FormData(formRef.current)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const orderNumber = String(formData.get('order_number') ?? '').trim()
    const requestType = String(formData.get('request_type') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !isValidEmail(email)) {
      setStatus('error')
      setErrorMessage('Please enter your full name and a valid email address.')
      return
    }

    if (orderNumber && orderNumber.length < 2) {
      setStatus('error')
      setErrorMessage('Please provide a valid order number, if you have one.')
      return
    }

    if (message && message.length > 2000) {
      setStatus('error')
      setErrorMessage('Your message is a bit long. Please shorten it to 2,000 characters or fewer.')
      return
    }

    setIsSending(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await emailjs.send(
        TRACK_ORDER_SERVICE_ID,
        TRACK_ORDER_REQUEST_TEMPLATE_ID,
        {
          name,
          email,
          order_number: orderNumber,
          request_type: requestType,
          message: message || '',
        },
        { publicKey: TRACK_ORDER_PUBLIC_KEY },
      )

      try {
        await emailjs.send(
          TRACK_ORDER_SERVICE_ID,
          TRACK_ORDER_RECEIVED_TEMPLATE_ID,
          {
            name,
            email,
            order_number: orderNumber,
          },
          { publicKey: TRACK_ORDER_PUBLIC_KEY },
        )
      } catch {
        // Ignore the customer confirmation failure so the support request is still processed.
      }

      setCustomerName(name)
      formRef.current.reset()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('We could not send your request right now. Please try again in a moment or contact us directly.')
    } finally {
      setIsSending(false)
    }
  }

  if (status === 'success') {
    return <div className="help-form help-track-success"><p className="eyebrow">Request received</p><h2 id="help-dialog-title">Request received</h2><p>Thanks, {customerName}. We've received your order support request. Our team will verify your details and contact you at the email address provided.</p><p className="help-form-security-note">Please do not send passwords, OTPs, card numbers, CVV, UPI PINs, or other confidential payment information.</p><button className="button button-primary" type="button" onClick={onClose}>Back to Support</button></div>
  }

  return <form ref={formRef} className="help-form" onSubmit={handleSubmit}><p className="eyebrow">Order support</p><h2 id="help-dialog-title">Track my order</h2><p>Share the details and our support team will review your order request manually.</p><div className="help-form-row"><label>Full name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label></div><label>Order number<span className="help-form-help">Optional, if you have it</span><input name="order_number" placeholder="e.g. SLB-12345" /></label><label>Request type<select name="request_type" required><option value="">Select a request</option>{TRACK_ORDER_REQUEST_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Message<span className="help-form-help">Optional, but recommended</span><textarea name="message" rows={5} placeholder="Add any delivery, shipping, or order questions you want reviewed." /></label><button className="button button-primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Submit request'}</button>{status === 'error' && <p className="help-form-note help-form-error" role="alert">{errorMessage || 'Something went wrong while sending your request. Please try again.'}</p>}</form>
}

function RequestForm({ action, onClose }: { action: 'return' | 'cancel'; onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [customerName, setCustomerName] = useState('')
  const isReturn = action === 'return'

  const handleReturnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return

    const form = formRef.current
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const orderNumber = String(formData.get('order_number') ?? '').trim()
    const returnReason = String(formData.get('return_reason') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !isValidEmail(email) || !orderNumber || !returnReason) {
      setStatus('error')
      setErrorMessage('Please complete the required fields: full name, valid email, order number, and reason for return.')
      return
    }

    setIsSending(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await emailjs.send(
        RETURN_ORDER_SERVICE_ID,
        RETURN_ORDER_TEMPLATE_ID,
        {
          name,
          email,
          order_number: orderNumber,
          return_reason: returnReason,
          message: message || '',
        },
        { publicKey: RETURN_ORDER_PUBLIC_KEY },
      )

      setCustomerName(name)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('We could not send your return request right now. Please try again in a moment.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCancelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || isSending) return

    const form = formRef.current
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const orderNumber = String(formData.get('order_number') ?? '').trim()
    const cancelReason = String(formData.get('cancel_reason') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !isValidEmail(email) || !orderNumber || !cancelReason) {
      setStatus('error')
      setErrorMessage('Please complete the required fields: full name, valid email, order number, and reason for cancellation.')
      return
    }

    setIsSending(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await emailjs.send(
        CANCEL_ORDER_SERVICE_ID,
        CANCEL_ORDER_TEMPLATE_ID,
        {
          name,
          email,
          order_number: orderNumber,
          cancel_reason: cancelReason,
          message,
        },
        { publicKey: CANCEL_ORDER_PUBLIC_KEY },
      )

      setCustomerName(name)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('We could not send your cancellation request right now. Please try again in a moment.')
    } finally {
      setIsSending(false)
    }
  }

  if (isReturn && status === 'success') {
    return <div className="help-form help-track-success"><p className="eyebrow">Return request received</p><h2 id="help-dialog-title">Return request received</h2><p>Thanks, {customerName}. We've received your return request. Our Orders team will review your request and contact you at the email address provided.</p><p className="help-form-security-note">Please note that submitting a return request does not automatically approve a return or refund. Our team will verify the order and applicable return policy before processing it.</p><button className="button button-primary" type="button" onClick={onClose}>Back to Support</button></div>
  }

  if (!isReturn) {
    if (status === 'success') {
      return <div className="help-form help-track-success"><p className="eyebrow">Cancellation request received</p><h2 id="help-dialog-title">Cancellation request received</h2><p>Thanks, {customerName}. We've received your cancellation request. Our Orders team will verify your order and contact you at the email address provided.</p><p className="help-form-security-note">Please note that submitting a cancellation request does not automatically cancel your order. Our Orders team will verify the order status and eligibility before processing the cancellation.</p><button className="button button-primary" type="button" onClick={onClose}>Back to Support</button></div>
    }

    return <form ref={formRef} className="help-form" onSubmit={handleCancelSubmit}><p className="eyebrow">Order request</p><h2 id="help-dialog-title">Request cancellation</h2><p>Send your request as soon as possible. Cancellation is not confirmed until reviewed.</p><div className="help-form-row"><label>Full name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label></div><label>Order number<input name="order_number" required /></label><label>Reason for cancellation<select name="cancel_reason" required><option value="">Select a reason</option>{CANCEL_REASON_OPTIONS.map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select></label><label>Additional message<span className="help-form-help">Optional</span><textarea name="message" rows={5} /></label><button className="button button-primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Submit cancellation request'}</button>{status === 'error' && <p className="help-form-note help-form-error" role="alert">{errorMessage || 'We could not send your cancellation request right now. Please try again in a moment.'}</p>}</form>
  }

  return <form ref={formRef} className="help-form" onSubmit={handleReturnSubmit}><p className="eyebrow">Order return</p><h2 id="help-dialog-title">Return order</h2><p>Tell us about the item you would like to return and our Orders team will review your request.</p><div className="help-form-row"><label>Full name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label></div><label>Order number<input name="order_number" required /></label><label>Reason for return<select name="return_reason" required><option value="">Select a reason</option>{RETURN_REASON_OPTIONS.map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select></label><label>Additional message<span className="help-form-help">Optional</span><textarea name="message" rows={5} placeholder="Add any details about the item or issue." /></label><button className="button button-primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Submit return request'}</button>{status === 'error' && <p className="help-form-note help-form-error" role="alert">{errorMessage || 'Something went wrong while sending your return request. Please try again.'}</p>}</form>
}

function IssueForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [isSending, setIsSending] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!formRef.current || isSending) return
    setIsSending(true); setStatus('idle')
    const form = formRef.current
    try { await emailjs.sendForm(EMAILJS_SERVICE_ID, REPORT_ISSUE_TEMPLATE_ID, form, { publicKey: EMAILJS_PUBLIC_KEY }); form.reset(); setStatus('success') } catch { setStatus('error') } finally { setIsSending(false) }
  }
  return <form ref={formRef} className="help-form" onSubmit={handleSubmit}><p className="eyebrow">We are listening</p><h2 id="help-dialog-title">Report an issue</h2><p>Tell us what happened and our team will contact you shortly.</p><div className="help-form-row"><label>Customer name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label></div><label>Order number<input name="order_number" required /></label><label>Issue type<select name="issue_type" required><option value="">Select an issue</option>{['Damaged Product', 'Wrong Product', 'Missing Item', 'Delivery Problem', 'Payment Problem', 'Product Quality Issue', 'Other'].map((issue) => <option key={issue}>{issue}</option>)}</select></label><label>Issue description<textarea name="message" rows={5} required /></label><button className="button button-primary" type="submit" disabled={isSending}>{isSending ? 'Submitting...' : 'Submit issue'}</button>{status === 'success' && <p className="help-form-note help-form-success" role="status">Thank you. Your issue has been submitted successfully. Our team will contact you shortly.</p>}{status === 'error' && <p className="help-form-note help-form-error" role="alert">Something went wrong while submitting your issue. Please try again.</p>}{status === 'success' && <button className="button button-secondary" type="button" onClick={onClose}>Done</button>}</form>
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!formRef.current || isSending) return; setIsSending(true); setStatus('idle'); try { await emailjs.sendForm(EMAILJS_SERVICE_ID, CONTACT_TEMPLATE_ID, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY }); formRef.current.reset(); setStatus('success') } catch { setStatus('error') } finally { setIsSending(false) } }
  return <section className="contact-form-section" aria-labelledby="contact-form-title"><div className="contact-form-container"><div className="contact-form-intro"><p className="eyebrow">Still need help?</p><h2 id="contact-form-title">Contact our team.</h2><p>Tell us what you need and the SlabGuardz team will get back to you.</p></div><form ref={formRef} className="contact-form" onSubmit={handleSubmit}><div className="contact-form-row"><label>Name<input name="name" type="text" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div><label>Message<textarea name="message" rows={6} required /></label><div className="contact-form-footer"><button className="button button-primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send message'}</button>{status === 'success' && <p className="contact-form-status contact-form-status-success" role="status">Thank you! Your message has been sent successfully.</p>}{status === 'error' && <p className="contact-form-status contact-form-status-error" role="alert">Something went wrong. Please try again.</p>}</div></form></div></section>
}
