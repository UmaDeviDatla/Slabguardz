type ShopResultsSummaryProps = {
  count: number
  total: number
}

export function ShopResultsSummary({ count, total }: ShopResultsSummaryProps) {
  return <p className="shop-results-summary">Showing <strong>{count}</strong> of <strong>{total}</strong> products</p>
}
