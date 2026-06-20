import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);

      console.log("FULL RESPONSE:", res.data);

      const data = res.data.data;
      if (data.role !== 'admin') {
        setError('This account does not have admin access');
        return;
      }
      localStorage.setItem('aethrix_admin_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-base-900 border border-white/10 p-10 w-full max-w-sm">
        <div className="font-display text-3xl tracking-[0.2em] mb-1">AETHRIX</div>
        <p className="text-xs text-white/30 tracking-wider mb-8">ADMIN PANEL</p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-dim text-sm font-semibold py-3 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-white/20 mt-6 text-center">Seeded admin: admin@aethrix.in / admin12345</p>
      </div>
    </div>
  );
};

export default AdminLogin;
