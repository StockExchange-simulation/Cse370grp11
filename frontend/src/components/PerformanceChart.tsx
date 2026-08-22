import { useId, useMemo } from 'react'

/*
  Lightweight inline SVG area chart — no chart library needed.
  Pass a numeric series (e.g. daily portfolio value from
  GET /api/portfolio/history). It auto-scales to the data.
*/
export function PerformanceChart({
  series,
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
}: {
  series: number[]
  labels?: string[]
}) {
  const gradientId = useId()
  const W = 760
  const H = 200

  const { linePath, areaPath, yTicks } = useMemo(() => {
    const min = Math.min(...series)
    const max = Math.max(...series)
    const pad = (max - min) * 0.15 || 1
    const lo = min - pad
    const hi = max + pad
    const x = (i: number) => (i / (series.length - 1)) * W
    const y = (v: number) => H - ((v - lo) / (hi - lo)) * H

    const points = series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    const line = `M ${points.join(' L ')}`
    const area = `${line} L ${W},${H} L 0,${H} Z`

    const ticks = [hi, lo + (hi - lo) * 0.66, lo + (hi - lo) * 0.33, lo].map(
      (v) => `$${(v / 1000).toFixed(1)}k`,
    )
    return { linePath: line, areaPath: area, yTicks: ticks }
  }, [series])

  return (
    <div className="grid grid-cols-[45px_1fr] grid-rows-[1fr_20px] h-[190px]">
      <div className="flex flex-col justify-between pb-4 text-[10px] text-muted/70">
        {yTicks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <svg
        className="h-[170px] w-full overflow-visible border-b border-line [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_41px,var(--line)_42px)]"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Portfolio value over the last six months"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={3}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="col-start-2 flex justify-between pt-2 text-[10px] text-muted/70">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}
