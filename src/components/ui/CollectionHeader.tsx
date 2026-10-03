import { Link } from 'react-router-dom'

type CollectionHeaderProps = {
  eyebrow: string
  title: string
  breadcrumb?: string
}

export function CollectionHeader({ eyebrow, title, breadcrumb = title }: CollectionHeaderProps) {
  return (
    <>
      <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{breadcrumb}</span>
      </nav>
      <section className="collection-header" aria-labelledby="collection-title">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="collection-title">{title}</h1>
      </section>
    </>
  )
}