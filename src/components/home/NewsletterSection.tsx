import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'

export function NewsletterSection() {
  return (
    <section className="home-newsletter">
      <Container className="home-newsletter-inner">
        <div>
          <p className="eyebrow">Stay in the loop</p>
          <h2>Good things for your collection, occasionally.</h2>
          <p>New arrivals, collector notes and considered offers. No noise.</p>
        </div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email">Email address</label>
          <div><input id="newsletter-email" type="email" placeholder="you@example.com" required /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={18} /></button></div>
          <small>By subscribing, you agree to receive SlabGuardz updates.</small>
        </form>
      </Container>
    </section>
  )
}
