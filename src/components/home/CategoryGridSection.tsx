import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryCards } from '../../data/home'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

export function CategoryGridSection() {
  return (
    <section className="home-section home-categories">
      <Container>
        <SectionHeading eyebrow="Find your next piece" title="Shop by category" description="From the card itself to the case around it, make every part of your collection count." />
        <div className="category-grid">
          {categoryCards.map((category) => (
            <Link className={`category-card category-card-${category.accent}`} key={category.to} to={category.to}>
              <span className="category-card-index">0{categoryCards.indexOf(category) + 1}</span>
              <span className="category-card-art"><span /></span>
              <span className="category-card-content">
                <strong>{category.label}</strong>
                <small>{category.description}</small>
              </span>
              <ArrowUpRight className="category-card-arrow" size={18} strokeWidth={1.8} />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
