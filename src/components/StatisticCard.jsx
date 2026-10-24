export default function StatisticCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-5 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
        {Icon ? <Icon size={18} className="text-flare" aria-hidden="true" /> : null}
      </div>
      <p className="mt-4 font-display text-5xl leading-none">{value}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </article>
  )
}
