import { Container } from '../ui/Container'
import { trustItems } from '../../data/home'

export function TrustSection() {
  return (
    <section className="home-section home-trust">
      <Container>
        <div className="trust-grid">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <div className="trust-item" key={title}>
              <Icon size={20} strokeWidth={1.7} />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
