import type { LucideIcon } from 'lucide-react'
import { Archive, Layers3, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'

export type CategoryCard = {
  label: string
  description: string
  to: string
  accent: string
}

export const categoryCards: CategoryCard[] = [
  { label: 'Pokémon cards', description: 'Singles and collector favourites', to: '/category/pokemon-cards', accent: 'blue' },
  { label: 'SlabGuardz protection', description: 'Protection made for the long hold', to: '/category/slabguardz-protection', accent: 'navy' },
  { label: 'Accessories', description: 'The everyday collector kit', to: '/category/accessories', accent: 'green' },
]

export type TrustItem = {
  title: string
  description: string
  icon: LucideIcon
}

export const trustItems: TrustItem[] = [
  { title: 'Secure checkout', description: 'A straightforward, protected way to place your order.', icon: ShieldCheck },
  { title: 'Collector focused', description: 'Products selected around how real collections are kept.', icon: Layers3 },
  { title: 'Carefully packed', description: 'Every order gets the attention your cards deserve.', icon: PackageCheck },
  { title: 'India-wide shipping', description: 'Reliable delivery for collectors across the country.', icon: Archive },
  { title: 'New finds often', description: 'Fresh cards and essentials added to the edit regularly.', icon: Sparkles },
]
