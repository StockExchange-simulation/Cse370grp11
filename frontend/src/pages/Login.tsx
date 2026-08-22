import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()
  const handleGoogleLogin = () => {
    // TODO FastAPI: Replace this demo redirect with your Google OAuth start endpoint.
    // Example: window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen bg-surface text-ink lg:grid-cols-[1fr_.86fr]">
      <section className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-32 top-24 h-[460px] w-[460px] rounded-full bg-accent/25 blur-3xl" />
        <div className="relative"><Link to="/" className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.04em]"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent text-sm">T</span>Trade<span className="text-[#a9b9ff]">Sphere</span></Link></div>
        <div className="relative max-w-[540px]"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a9b9ff]">Invest with intention</p><h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-[-.06em] xl:text-6xl">The market is always moving. Stay ready.</h1><p className="mt-6 max-w-[430px] text-base leading-7 text-white/65">Your portfolio, watchlist, and next opportunity — all in one place built for clear decisions.</p><div className="mt-10 flex flex-col gap-4 text-sm text-white/75"><span className="flex items-center gap-3"><Check className="text-[#8ea3ff]" size={17} /> Real-time market insights</span><span className="flex items-center gap-3"><Check className="text-[#8ea3ff]" size={17} /> Simple, transparent investing</span><span className="flex items-center gap-3"><Check className="text-[#8ea3ff]" size={17} /> Secure account protection</span></div></div>
        <p className="relative text-xs text-white/45">TradeSphere is for informational purposes only. Investing involves risk.</p>
      </section>

      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between lg:justify-end"><Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-[-.04em] lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent text-sm text-white">T</span>Trade<span className="text-accent">Sphere</span></Link><Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"><ArrowLeft size={15} /> Back to home</Link></div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Welcome back</p><h2 className="mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">Log in to TradeSphere.</h2><p className="mt-4 text-sm leading-6 text-muted">Access your portfolio and pick up where you left off.</p></div><button type="button" onClick={handleGoogleLogin} className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-sm font-bold text-ink shadow-sm transition hover:border-accent/40 hover:bg-canvas"><span className="grid h-5 w-5 place-items-center text-base font-bold">G</span> Continue with Google <ArrowRight className="ml-auto text-muted" size={17} /></button><div className="mt-7 flex items-start gap-3 rounded-xl bg-canvas p-4 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 shrink-0 text-teal" size={17} /><span>We use Google to securely verify your identity. TradeSphere never sees your Google password.</span></div><p className="mt-8 text-center text-xs leading-5 text-muted">By continuing, you agree to TradeSphere&apos;s <a href="#terms" className="font-semibold text-ink underline underline-offset-2">Terms of Service</a> and <a href="#privacy" className="font-semibold text-ink underline underline-offset-2">Privacy Policy</a>.</p></div>
        <p className="mx-auto w-full max-w-[420px] pb-2 text-center text-xs text-muted">Need help? <a href="mailto:support@tradesphere.example" className="font-semibold text-accent">Contact support</a></p>
      </main>
    </div>
  )
}
