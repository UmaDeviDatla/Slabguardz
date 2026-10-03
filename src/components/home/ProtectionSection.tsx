import { ArrowUpRight, Check } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'

const protectionPoints = ['Defends against scratches and scuffs', 'Keeps slabs clear for display', 'Built for everyday collector handling']

export function ProtectionSection() {
  return (
    <section className="home-protection">
      <Container className="home-protection-inner">
        <div className="home-protection-art"><img src="/pokemon_banner.jpeg" alt="Featured Pokémon collection" /></div>
        <div className="home-protection-copy">
          <p className="eyebrow">Made for the long hold</p>
          <h2>Protection that stays out of the way.</h2>
          <p>Because your best cards should be seen, not constantly worried about. SlabGuardz protection gives your collection a clean, reliable layer of care.</p>
          <ul>{protectionPoints.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul>
          <ButtonLink to="/category/slabguardz-protection" variant="secondary">Shop protection <ArrowUpRight size={16} /></ButtonLink>
        </div>
      </Container>
    </section>
  )
}
