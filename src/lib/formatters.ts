export const formatPrice = (price: number, currency = 'INR') =>
  new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
