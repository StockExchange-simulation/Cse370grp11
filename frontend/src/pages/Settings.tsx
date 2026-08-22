import { useState } from 'react'
import { Card, PageTitle } from '../components/ui'

const toggles = [
  { key: 'email', label: 'Email notifications', desc: 'Order fills, price alerts, and statements' },
  { key: 'push', label: 'Push notifications', desc: 'Real-time alerts on your devices' },
  { key: 'marketing', label: 'Product updates', desc: 'Occasional news about new features' },
]

export function Settings() {
  // TODO FastAPI: GET/PATCH /api/me/preferences to load and persist these.
  const [state, setState] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    marketing: false,
  })

  return (
    <>
      <PageTitle
        eyebrow="Preferences"
        title="Settings"
        subtitle="Control how TradeSphere works for you."
      />

      <Card>
        <h2 className="mb-1 text-[17px] font-semibold tracking-tight">Notifications</h2>
        <div className="mt-2 divide-y divide-line/60">
          {toggles.map((t) => {
            const on = state[t.key]
            return (
              <div key={t.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <b className="text-sm text-ink">{t.label}</b>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={t.label}
                  onClick={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    on ? 'bg-accent' : 'bg-line'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      on ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}
