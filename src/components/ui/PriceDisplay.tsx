import { formatPrice } from '../../lib/formatters'

type PriceDisplayProps = {
  price: number
  currencyCode?: string
  unavailable?: boolean
  compareAtPrice?: number
}

export function PriceDisplay({ price, currencyCode = 'INR', unavailable = false, compareAtPrice }: PriceDisplayProps) {
  return (
    <span className="price-display">
      <span>{unavailable ? 'Price unavailable' : formatPrice(price, currencyCode)}</span>
      {!unavailable && compareAtPrice && <del>{formatPrice(compareAtPrice, currencyCode)}</del>}
    </span>
  )
}
