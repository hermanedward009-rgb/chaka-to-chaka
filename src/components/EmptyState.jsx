export default function EmptyState({ title, children }) {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-12 text-center">
      <h3 className="font-display text-4xl uppercase">{title}</h3>
      {children && <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{children}</p>}
    </div>
  )
}
