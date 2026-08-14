import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Wire this up to your FastAPI /auth/login endpoint, e.g.:
      // const res = await fetch(`${API_BASE}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).detail ?? 'Login failed');
      // const data = await res.json();
      // localStorage.setItem('access_token', data.access_token);
      // navigate('/dashboard');
      console.log('login submit', { email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <button className="login__back" onClick={() => navigate('/')}>
          ← Back
        </button>

        <h1 className="login__title">Welcome back</h1>
        <p className="login__sub">Log in to your paper trading account.</p>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              minLength={8}
            />
          </label>

          {error && <p className="login__error">{error}</p>}

          <button className="btn btn--primary login__submit" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="login__footer">
          No account yet? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
