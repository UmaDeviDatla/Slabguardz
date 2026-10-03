type CollectionToolbarProps = {
  count: number
}

export function CollectionToolbar({ count }: CollectionToolbarProps) {
  return (
    <div className="collection-toolbar">
      <p className="eyebrow">All products</p>
      <span>{count} {count === 1 ? 'product' : 'products'}</span>
    </div>
  )
}