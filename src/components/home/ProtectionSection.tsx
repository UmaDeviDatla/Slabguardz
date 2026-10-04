import { ArrowUpRight, Shield, Layers, Eye, Smartphone } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { AnimateOnScroll } from '../ui/AnimateOnScroll'

const technicalFeatures = [
  {
    icon: Shield,
    title: 'High-Impact TPU Edge Armor',
    desc: 'Absorbs shock from drops and prevents corner cracking.',
  },
  {
    icon: Eye,
    title: 'Zero Obstruction Clarity',
    desc: 'Leaves certification labels and holo cards 100% visible.',
  },
  {
    icon: Layers,
    title: 'Precision Molded Fit',
    desc: 'Engineered specifically for PSA, CGC, and standard 35pt slabs.',
  },
  {
    icon: Smartphone,
    title: 'Stackable Non-Slip Grip',
    desc: 'Subtle bezel ridges prevent slabs from sliding off display shelves.',
  },
]

export function ProtectionSection() {
  return (
    <section className="home-protection" aria-labelledby="protection-heading">
      <Container className="home-protection-inner">
        <AnimateOnScroll y={20}>
          <div className="home-protection-art">
            <div className="protection-card-showcase">
              <img
                src="/slabs/slab-3.jpeg"
                alt="SlabGuardz precision bumper case installed on PSA slab"
                className="protection-slab-img"
              />
              <div className="protection-badge-float">
                <span className="dot" />
                <span>PSA & CGC Precision Fit</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll y={20} delay={0.15}>
          <div className="home-protection-copy">
            <p className="eyebrow">ENGINEERED FOR COLLECTORS</p>
            <h2 id="protection-heading">Protection that stays out of the way.</h2>
            <p className="protection-lead">
              Because your most prized grails should be showcased, not kept hidden in fear of drops or scratches. SlabGuardz cases snap on seamlessly to deliver armor-grade defense with zero bulk.
            </p>

            <div className="protection-features-grid">
              {technicalFeatures.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="protection-feature-item">
                  <div className="protection-feature-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="protection-actions">
              <ButtonLink to="/category/slabguardz-protection" variant="primary" className="btn-dark-solid">
                Shop Protection Gear <ArrowUpRight size={16} />
              </ButtonLink>
              <ButtonLink to="/shop" variant="secondary" className="btn-outline-clean">
                Browse All Cases
              </ButtonLink>
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  )
}
