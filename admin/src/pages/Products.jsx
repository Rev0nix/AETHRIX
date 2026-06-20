import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import ProductTable from '../components/ProductTable';
import api from '../services/api';

const emptyForm = { name: '', description: '', category: 'electronics', price: '', compareAtPrice: '', stock: '', badge: '' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);

  const load = () => {
    api.get('/products', { params: { limit: 100, keyword: search || undefined } }).then((r) => setProducts(r.data.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      stock: p.stock,
      badge: p.badge || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice
        ? Number(form.compareAtPrice)
        : undefined,
      stock: Number(form.stock),
    };

    try {
      let response;

      if (editing) {
        response = await api.put(`/products/${editing._id}`, payload);
      } else {
        response = await api.post('/products', payload);
      }

      const productId = editing
        ? editing._id
        : response.data.data._id;

      if (images.length > 0) {
        const formData = new FormData();

        images.forEach((img) => {
          formData.append('images', img);
        });

        await api.post(
          `/products/${productId}/images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setImages([]);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await api.delete(`/products/${p._id}`);
    load();
  };

  return (
    <div>
      <Topbar
        title="Products"
        action={
          <button onClick={openCreate} className="bg-white text-black text-[11px] font-bold tracking-wider uppercase px-6 py-2.5">
            + Add Product
          </button>
        }
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="bg-white/5 border border-white/10 px-4 py-2.5 text-sm mb-6 w-full max-w-sm outline-none focus:border-accent"
      />

      <div className="bg-base-900 border border-white/5">
        <ProductTable products={products} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-base-900 border border-white/10 p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <h3 className="font-display text-2xl tracking-wider mb-6">{editing ? 'Edit Product' : 'New Product'}</h3>

            <Field label="Name">
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
            </Field>
            <Field label="Description">
              <textarea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input">
                {['electronics', 'fashion', 'smart-gadgets', 'home-decor', 'fitness', 'accessories'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)">
                <input required type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input" />
              </Field>
              <Field label="Compare At (₹)">
                <input type="number" value={form.compareAtPrice} onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))} className="input" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock">
                <input required type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input" />
              </Field>
              <Field label="Badge">
                <select value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="input">
                  <option value="">None</option>
                  {['NEW', 'SALE', 'BESTSELLER', 'LIMITED', 'TRENDING'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Product Images">
              <input
                type="file"
                multiple
                accept="image/*"
                className="input"
                onChange={(e) => setImages([...e.target.files])}
              />
            </Field>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="flex-1 bg-accent hover:bg-accent-dim text-sm font-semibold py-3">
                {editing ? 'Save Changes' : 'Create Product'}
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

export default Products;
