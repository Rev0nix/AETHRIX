import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

const TABS = ['overview', 'orders', 'wishlist', 'addresses', 'settings'];

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { wishlist } = useWishlist();
  const { itemCount } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const [orders, setOrders] = useState([]);
  const [settingsForm, setSettingsForm] = useState({ name: user?.name || '', phone: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tab === 'orders') {
      orderService.getMyOrders().then(setOrders).catch(() => setOrders([]));
    }
  }, [tab]);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await authService.updateProfile(settingsForm);
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.message || 'Could not update profile');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
      <aside className="bg-base-900 border border-white/10 p-7 h-fit">
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-base-600 to-accent-dim flex items-center justify-center text-xl font-bold mx-auto mb-4">
          {initials}
        </div>
        <div className="text-center font-display text-2xl tracking-wider mb-1">{user?.name}</div>
        <div className="text-center text-xs text-white/35 mb-6">{user?.email}</div>
        <nav className="flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setSearchParams({ tab: t })}
              className={`text-left text-sm px-3 py-2.5 capitalize transition-colors border-l-2 ${
                tab === t ? 'text-white border-accent bg-white/5' : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
          <button onClick={logout} className="text-left text-sm px-3 py-2.5 text-red-400/70 hover:text-red-400 mt-4">
            Sign Out
          </button>
        </nav>
      </aside>

      <div className="bg-base-900 border border-white/10 p-8">
        {tab === 'overview' && (
          <div>
            <div className="eyebrow mb-2">My Account</div>
            <h2 className="font-display text-4xl tracking-wider mb-8">Welcome, {user?.name?.split(' ')[0]}</h2>
            <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
              <Stat value={itemCount} label="Bag Items" />
              <Stat value={wishlist.length} label="Wishlisted" />
              <Stat value={orders.length} label="Orders" />
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <div className="eyebrow mb-2">Order History</div>
            <h2 className="font-display text-4xl tracking-wider mb-8">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <p className="text-sm mb-4">No orders yet</p>
                <Link to="/shop" className="btn-primary">Shop Now</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((o) => (
                  <div key={o._id} className="border border-white/10 p-5 flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <div className="font-semibold text-sm">{o.orderNumber}</div>
                      <div className="text-xs text-white/35 mt-1">{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="text-sm font-bold">₹{o.totalPrice.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] uppercase tracking-wider bg-accent/15 text-accent-glow px-3 py-1.5 rounded">
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <div className="eyebrow mb-2">Saved Items</div>
            <h2 className="font-display text-4xl tracking-wider mb-8">Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-sm text-white/30">Nothing wishlisted yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {wishlist.map((p) => (
                  <div key={p._id} className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-14 h-[70px] bg-base-700 flex-shrink-0" />
                    <div className="flex-1">
                      <Link to={`/product/${p.slug}`} className="text-sm font-medium">{p.name}</Link>
                      <div className="text-sm text-white/40">₹{p.price?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'addresses' && (
          <div>
            <div className="eyebrow mb-2">Saved Addresses</div>
            <h2 className="font-display text-4xl tracking-wider mb-8">Addresses</h2>
            <p className="text-sm text-white/30">Manage delivery addresses from the checkout page — they'll appear here once saved.</p>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <div className="eyebrow mb-2">Account Settings</div>
            <h2 className="font-display text-4xl tracking-wider mb-8">Settings</h2>
            <form onSubmit={handleSettingsSave} className="max-w-sm">
              <div className="mb-4">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Full Name</label>
                <input
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Phone</label>
                <input
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="btn-primary">
                {saved ? 'Saved ✓' : 'Save Changes →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div className="bg-base-900 p-7 text-center">
    <div className="font-display text-5xl mb-1">{value}</div>
    <div className="text-xs tracking-wider uppercase text-white/40">{label}</div>
  </div>
);

export default Profile;
