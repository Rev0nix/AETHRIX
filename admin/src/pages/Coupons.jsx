import { useCallback, useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

const emptyForm = { code: '', type: 'percent', value: '', minOrderValue: '', maxDiscount: '', usageLimit: '' };

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(() => {
    api.get('/coupons').then((r) => setCoupons(r.data.data));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', {
        ...form,
        value: Number(form.value),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: Number(form.usageLimit) || 0,
      });
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    await api.delete(`/coupons/${c._id}`);
    load();
  };

  const toggleActive = async (c) => {
    await api.put(`/coupons/${c._id}`, { isActive: !c.isActive });
    load();
  };

  return (
    <div>
      <Topbar
        title="Coupons"
        action={
          <button onClick={() => setShowForm(true)} className="bg-white text-black text-[11px] font-bold tracking-wider uppercase px-6 py-2.5">
            + Create Coupon
          </button>
        }
      />

      <div className="bg-base-900 border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
              <th className="text-left py-3 px-6">Code</th>
              <th className="text-left py-3 px-6">Discount</th>
              <th className="text-left py-3 px-6">Used</th>
              <th className="text-left py-3 px-6">Limit</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-white/[0.03]">
                <td className="py-3 px-6 font-mono">{c.code}</td>
                <td className="py-3 px-6">{c.type === 'percent' ? `${c.value}% off` : `₹${c.value} off`}</td>
                <td className="py-3 px-6">{c.usedCount}</td>
                <td className="py-3 px-6">{c.usageLimit || '∞'}</td>
                <td className="py-3 px-6">
                  <span className={`text-[10px] uppercase px-2.5 py-1 rounded ${c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6 flex gap-3">
                  <button onClick={() => toggleActive(c)} className="text-xs text-accent-glow">
                    {c.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDelete(c)} className="text-xs text-red-400/70">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-base-900 border border-white/10 p-8 w-full max-w-md">
            <h3 className="font-display text-2xl tracking-wider mb-6">New Coupon</h3>
            <Field label="Code">
              <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="input" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type">
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input">
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </Field>
              <Field label="Value">
                <input required type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="input" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min Order (₹)">
                <input type="number" value={form.minOrderValue} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))} className="input" />
              </Field>
              <Field label="Max Discount (₹)">
                <input type="number" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} className="input" />
              </Field>
            </div>
            <Field label="Usage Limit (0 = unlimited)">
              <input type="number" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className="input" />
            </Field>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="flex-1 bg-accent hover:bg-accent-dim text-sm font-semibold py-3">
                Create Coupon
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/15 text-sm py-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`.input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);padding:10px 14px;font-size:13px;outline:none}.input:focus{border-color:#3b82f6}`}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{label}</label>
    {children}
  </div>
);

export default Coupons;
