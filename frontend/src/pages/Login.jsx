import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/profile');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="bg-base-900 border border-white/10 p-10 w-full max-w-sm">
        <h1 className="font-display text-4xl tracking-wider mb-2">SIGN IN</h1>
        <p className="text-sm text-white/35 mb-8">Welcome back. The drop waits for no one.</p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-6">
          New here? <Link to="/register" className="text-accent-glow">Create account →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
