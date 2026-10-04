import { AnimateOnScroll } from '../ui/AnimateOnScroll'

export function BrandStatement() {
  return (
    <section className="brand-statement" aria-labelledby="brand-statement-tagline">
      <AnimateOnScroll duration={0.8}>
        <div className="brand-statement-inner">
          <div className="brand-statement-logo-wrap">
            <img className="brand-statement-logo" src="/slabguardz_logo.png" alt="SlabGuardz" />
          </div>
          <h2 id="brand-statement-tagline">BUILT TO PROTECT. MADE TO DISPLAY.</h2>
        </div>
      </AnimateOnScroll>
    </section>
  )
}