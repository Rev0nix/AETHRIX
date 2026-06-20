import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/stats/dashboard').then((r) => setStats(r.data.data));
    api.get('/orders?limit=5').then((r) => setRecentOrders(r.data.data));
  }, []);

  return (
    <div>
      <Topbar title="Dashboard" />

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} change="Live data" />
        <StatCard label="Orders" value={stats?.totalOrders ?? '—'} />
        <StatCard label="Customers" value={stats?.totalCustomers ?? '—'} />
        <StatCard label="Avg. Order Value" value={`₹${stats?.avgOrderValue ?? 0}`} />
      </div>

      {stats?.revenueTrend?.length > 0 && (
        <div className="bg-base-900 border border-white/5 p-6 mb-10">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">Revenue — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.revenueTrend}>
              <CartesianGrid stroke="#161c30" strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #222b46' }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-base-900 border border-white/5">
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
          <span className="text-xs tracking-[0.15em] uppercase text-white/55">Recent Orders</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
              <th className="text-left py-3 px-6">Order ID</th>
              <th className="text-left py-3 px-6">Customer</th>
              <th className="text-left py-3 px-6">Amount</th>
              <th className="text-left py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id} className="border-b border-white/[0.03]">
                <td className="py-3 px-6">{o.orderNumber}</td>
                <td className="py-3 px-6">{o.user?.name}</td>
                <td className="py-3 px-6">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-6">
                  <span className="text-[10px] uppercase bg-accent/10 text-accent-glow px-2.5 py-1 rounded">{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
