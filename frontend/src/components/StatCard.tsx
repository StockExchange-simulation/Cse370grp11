import type { LucideIcon } from 'lucide-react'

const toneStyles: Record<string, string> = {
  blue: 'bg-accent-soft text-accent',
  teal: 'bg-teal/10 text-teal',
  violet: 'bg-violet-500/12 text-violet-500',
  amber: 'bg-amber-400/15 text-amber-500',
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'blue',
}: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone?: 'blue' | 'teal' | 'violet' | 'amber'
}) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{label}</span>
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg ${toneStyles[tone]}`}
        >
          <Icon size={16} />
        </span>
      </div>
      <strong className="mt-3.5 block text-[21px] font-bold tracking-tight text-ink">
        {value}
      </strong>
      <span className="mt-1 block text-[11px] text-muted">{detail}</span>
    </article>
  )
}
