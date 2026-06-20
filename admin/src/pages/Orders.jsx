import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const badgeColor = (status) =>
  ({
    delivered: 'bg-green-500/10 text-green-400',
    shipped: 'bg-blue-500/10 text-blue-400',
    cancelled: 'bg-red-500/10 text-red-400',
  }[status] || 'bg-yellow-500/10 text-yellow-400');

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    api.get('/orders', { params: { limit: 50, status: filter || undefined } }).then((r) => setOrders(r.data.data));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <Topbar title="Orders" />

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('')} className={`text-[10px] uppercase px-3 py-1.5 border ${!filter ? 'bg-white text-black border-white' : 'border-white/15 text-white/50'}`}>
          All
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`text-[10px] uppercase px-3 py-1.5 border ${filter === s ? 'bg-white text-black border-white' : 'border-white/15 text-white/50'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-base-900 border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
              <th className="text-left py-3 px-6">Order</th>
              <th className="text-left py-3 px-6">Customer</th>
              <th className="text-left py-3 px-6">Total</th>
              <th className="text-left py-3 px-6">Payment</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-white/[0.03]">
                <td className="py-3 px-6">{o.orderNumber}</td>
                <td className="py-3 px-6">{o.user?.name}</td>
                <td className="py-3 px-6">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-6 capitalize text-white/50">{o.paymentMethod}</td>
                <td className="py-3 px-6">
                  <span className={`text-[10px] uppercase px-2.5 py-1 rounded ${badgeColor(o.status)}`}>{o.status.replace('_', ' ')}</span>
                </td>
                <td className="py-3 px-6">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="bg-white/5 border border-white/10 text-xs px-2 py-1.5"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
