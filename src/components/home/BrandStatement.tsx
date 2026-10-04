import { ShieldCheck } from 'lucide-react'
import { AnimateOnScroll } from '../ui/AnimateOnScroll'

export function BrandStatement() {
  return (
    <section className="brand-statement-graded" aria-labelledby="brand-statement-tagline">
      <AnimateOnScroll duration={0.6}>
        <div className="brand-statement-inner">
          <div className="brand-badge-row">
            <ShieldCheck size={16} />
            <span>THE COLLECTOR'S ARMOR</span>
          </div>
          <h2 id="brand-statement-tagline">BUILT TO PROTECT. MADE TO DISPLAY.</h2>
          <p className="brand-statement-sub">
            Whether preserving PSA 10 holy grails or everyday collection favorites, SlabGuardz delivers precision TPU cases and display solutions designed to keep every edge pristine.
          </p>
        </div>
      </AnimateOnScroll>
    </section>
  )
}