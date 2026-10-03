type PageIntroProps = {
  eyebrow?: string
  title: string
  description: string
}

export function PageIntro({ eyebrow = 'SlabGuardz', title, description }: PageIntroProps) {
  return (
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </section>
  )
}
