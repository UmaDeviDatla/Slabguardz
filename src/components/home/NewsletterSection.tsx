import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '../ui/Container'
import { AnimateOnScroll } from '../ui/AnimateOnScroll'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
    }, 4000)
  }

  return (
    <section className="home-newsletter">
      <Container className="home-newsletter-inner">
        <AnimateOnScroll>
          <div>
            <p className="eyebrow">Stay in the loop</p>
            <h2>Good things for your collection, occasionally.</h2>
            <p>New drops, collector insights, and exclusive subscriber perks. Zero noise.</p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.15}>
          <div className="newsletter-card">
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  className="newsletter-success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="newsletter-success-icon">
                    <Check size={20} strokeWidth={2.4} />
                  </div>
                  <h3>You're on the list!</h3>
                  <p>Thanks for subscribing. We'll only reach out when something worthy drops.</p>
                </motion.div>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubmit}>
                  <label htmlFor="newsletter-email">Email address</label>
                  <div className="newsletter-input-group">
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      aria-label="Subscribe to newsletter"
                    >
                      <span>Join</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                  <small>By subscribing, you agree to receive SlabGuardz drops & collector updates.</small>
                </form>
              )}
            </AnimatePresence>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  )
}
