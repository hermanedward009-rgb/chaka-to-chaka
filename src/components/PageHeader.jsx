export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-12 pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-flare">{eyebrow}</p>
      <h1 className="mt-2 max-w-4xl font-display text-6xl uppercase leading-none sm:text-7xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-base leading-7 text-muted">{children}</div>}
    </header>
  )
}
