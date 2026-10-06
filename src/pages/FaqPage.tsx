import { useState } from 'react'
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { AnimateOnScroll } from '../components/ui/AnimateOnScroll'
import { ButtonLink } from '../components/ui/Button'

type FaqCategory = 'all' | 'orders' | 'shipping' | 'authenticity' | 'protection'

type FaqItem = {
  id: string
  question: string
  answer: string
  category: FaqCategory
}

const faqs: FaqItem[] = [
  {
    id: 'f1',
    category: 'orders',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods via our secure Razorpay gateway: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, and select digital wallets. Cash on Delivery (COD) is also available on eligible pin codes across India.',
  },
  {
    id: 'f2',
    category: 'orders',
    question: 'How do I know my order is confirmed?',
    answer: 'Immediately upon completing your checkout, you will see an on-screen Order Confirmation receipt with your payment ID and order details. You will also receive an automated email and SMS notification confirming your order reference.',
  },
  {
    id: 'f3',
    category: 'shipping',
    question: 'How fast is dispatch and what are delivery timelines?',
    answer: 'Orders are processed and dispatched from our facility within 24 to 48 business hours. Delivery to major metro cities typically takes 2–4 business days, while other regions take 4–6 business days via our express courier partners (Delhivery, BlueDart, DTDC).',
  },
  {
    id: 'f4',
    category: 'shipping',
    question: 'How are card slabs packaged to prevent transit damage?',
    answer: 'We treat every card like a museum piece. Your items are sealed in waterproof sleeves, cushioned inside multi-layer bubble wrap, placed between rigid reinforced cardboard protectors, and shipped inside heavy-duty armor corrugated boxes.',
  },
  {
    id: 'f5',
    category: 'authenticity',
    question: 'Are all graded cards and collectibles 100% authentic?',
    answer: 'Yes, absolutely. We have a zero-tolerance policy for counterfeits. All graded slabs (PSA, CGC, BGS) have tamper-evident serial numbers and verification barcodes verifiable directly on the respective grading company databases.',
  },
  {
    id: 'f6',
    category: 'protection',
    question: 'Which slab brands are SlabGuardz bumpers compatible with?',
    answer: 'Our SlabGuardz protective bumpers are engineered for exact precision fits on standard PSA, CGC, and BGS graded card slabs. They snugly frame the acrylic edges to prevent perimeter chips, scuffs, and impact cracks without obscuring card art or labels.',
  },
  {
    id: 'f7',
    category: 'shipping',
    question: 'Is shipping free?',
    answer: 'Yes! We provide Free India-wide Express Delivery on all orders valued at ₹1,499 and above. For orders below ₹1,499, a flat shipping fee of ₹99 applies anywhere in India.',
  },
  {
    id: 'f8',
    category: 'orders',
    question: 'What is your return or replacement policy for damaged goods?',
    answer: 'In the rare circumstance that your package arrives damaged in transit, please record an unboxing video and contact us within 48 hours via our Contact page or support@slabguardz.in. We will arrange a replacement or full refund promptly under our Transit Guarantee.',
  },
]

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(faqs[0].id)

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <Container>
          <AnimateOnScroll>
            <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Frequently Asked Questions</span>
            </nav>
            <p className="eyebrow">Collector Help Desk</p>
            <h1>Frequently Asked Questions</h1>
            <p className="faq-hero-sub">
              Quick answers about orders, courier transit, slab compatibility, and card preservation.
            </p>

            {/* Search Bar */}
            <div className="faq-search-wrapper">
              <Search size={20} className="faq-search-icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., shipping, PSA, returns, payments)..."
                aria-label="Search FAQs"
              />
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Category Filter Pills */}
      <section className="faq-categories-section">
        <Container>
          <div className="faq-category-pills">
            {(
              [
                { label: 'All Questions', value: 'all' },
                { label: 'Orders & Payments', value: 'orders' },
                { label: 'Shipping & Delivery', value: 'shipping' },
                { label: 'Authenticity & Slabs', value: 'authenticity' },
                { label: 'Protection Gear', value: 'protection' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`faq-pill ${activeCategory === cat.value ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="faq-accordion-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id
                return (
                  <div key={faq.id} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="faq-answer-wrapper"
                        >
                          <div className="faq-answer-content">
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })
            ) : (
              <div className="faq-empty-search">
                <HelpCircle size={40} />
                <h3>No matching questions found</h3>
                <p>Try searching with different keywords or contact our support team directly.</p>
                <ButtonLink to="/contact" variant="secondary">
                  Contact Support
                </ButtonLink>
              </div>
            )}
          </div>

          {/* Need More Help Card */}
          <div className="faq-support-card">
            <div className="faq-support-text">
              <MessageCircle size={28} className="faq-support-icon" />
              <div>
                <h3>Still have questions?</h3>
                <p>Can't find what you're looking for? Our collector support team is available Monday to Saturday.</p>
              </div>
            </div>
            <ButtonLink to="/contact" variant="primary">
              Ask a Question
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  )
}
