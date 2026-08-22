import { Card, PageTitle, OutlineButton, StatusBadge } from '../components/ui'
import { currentUser } from '../lib/data'

const settings = [
  { title: 'Personal information', desc: 'Update your name, email, and phone number' },
  { title: 'Security', desc: 'Password, two-factor authentication, and sessions' },
  { title: 'Notifications', desc: 'Choose what updates you receive' },
  { title: 'Linked bank accounts', desc: 'Manage deposits and withdrawals' },
]

export function Profile() {
  // TODO FastAPI: GET /api/me for the profile; PATCH /api/me to save edits.
  return (
    <>
      <PageTitle
        eyebrow="Account"
        title="Profile"
        subtitle="Manage your TradeSphere account and preferences."
      />

      <Card className="mb-4 flex flex-wrap items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-lg font-bold text-accent">
          {currentUser.initials}
        </span>
        <div className="flex-1">
          <h2 className="text-[17px] font-semibold tracking-tight">{currentUser.name}</h2>
          <p className="text-sm text-muted">{currentUser.email}</p>
          {currentUser.verified ? (
            <span className="mt-1.5 inline-block">
              <StatusBadge status="Verified" />
            </span>
          ) : null}
        </div>
        <OutlineButton>Edit profile</OutlineButton>
      </Card>

      <Card>
        <h2 className="mb-1 text-[17px] font-semibold tracking-tight">Account settings</h2>
        <div className="mt-2 divide-y divide-line/60">
          {settings.map((s) => (
            <button
              key={s.title}
              className="flex w-full flex-col items-start gap-0.5 py-4 text-left transition hover:opacity-70"
            >
              <b className="text-sm text-ink">{s.title}</b>
              <span className="text-xs text-muted">{s.desc}</span>
            </button>
          ))}
        </div>
      </Card>
    </>
  )
}
