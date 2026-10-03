export type NavigationItem = {
  label: string
  to: string
  children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Shop',
    to: '/shop',
    children: [
      { label: 'All products', to: '/shop' },
      { label: 'Pokémon cards', to: '/category/pokemon-cards' },
      { label: 'SlabGuardz protection', to: '/category/slabguardz-protection' },
      { label: 'Accessories', to: '/category/accessories' },
    ],
  },
  { label: 'Pokémon cards', to: '/category/pokemon-cards' },
  { label: 'SlabGuardz protection', to: '/category/slabguardz-protection' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'New arrivals', to: '/new-arrivals' },
  { label: 'Best sellers', to: '/best-sellers' },
  { label: 'Contact', to: '/contact' },
]
