import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Topbar from '../components/Topbar';
import api from '../services/api';
import RevenueChart from "../components/RevenueChart";


const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const badgeColor = (status) =>
({
  delivered: 'bg-green-500/10 text-green-400',
  shipped: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
}[status] || 'bg-yellow-500/10 text-yellow-400');

const paymentStatus = (order) => order.paymentStatus || (order.isPaid ? 'paid' : 'pending');

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(null);

  const load = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get("/orders", {
          params: {
            limit: 50,
            status: filter || undefined,
            search: search || undefined,
          },
        }),
        api.get("/orders/stats/dashboard"),
      ]);

      setOrders(ordersRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, [filter, search]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Topbar title="Orders" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search order number or customer..."
        className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg mb-6 w-full max-w-md"
      />

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
      {/* Dashboard Cards */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
        />

        <StatCard
          title="Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Customers"
          value={stats?.totalCustomers ?? 0}
        />

        <StatCard
          title="Avg Order"
          value={`₹${(stats?.avgOrderValue ?? 0).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Showing"
          value={orders.length}
        />

        <StatCard
          title="Filter"
          value={filter ? filter.replaceAll("_", " ") : "All"}
        />

      </div>

      {/* Revenue Chart */}

      {stats && (
        <div className="mb-6">
          <RevenueChart data={stats.revenueTrend} />
        </div>
      )}

      <h2 className="text-lg font-bold mb-4 mt-8">Recent Orders</h2>

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
              <th className="text-left py-3 px-6">
                Date
              </th>
              <th className="text-left py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-white/[0.03]">
                <td className="py-3 px-6">{o.orderNumber}</td>
                <td className="py-3 px-6">{o.user?.name}</td>
                <td className="py-3 px-6">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-6 capitalize text-white/50"><div>

                  <div className="capitalize">
                    {o.paymentMethod}
                  </div>

                  <div
                    className={`text-xs mt-1 ${paymentStatus(o) === 'paid'
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {paymentStatus(o).replaceAll('_', ' ')}
                  </div>

                </div></td>
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
                <td className="py-3 px-6">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      console.log(o._id);
                      navigate(`/orders/${o._id}`);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-wider text-white/50">
      {title}
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {value}
    </h2>
  </div>
);

export default Orders;
