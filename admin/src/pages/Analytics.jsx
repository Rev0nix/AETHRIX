import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/orders/stats/dashboard').then((r) => setStats(r.data.data));
  }, []);

  return (
    <div>
      <Topbar title="Analytics" />

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard label="Conversion Rate" value="3.2%" change="↑ 0.4% vs last month" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? '—'} />
        <StatCard label="Avg. Order Value" value={`₹${stats?.avgOrderValue ?? 0}`} />
        <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} />
      </div>

      {stats?.revenueTrend?.length > 0 && (
        <div className="bg-base-900 border border-white/5 p-6">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">Orders Per Day — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueTrend}>
              <CartesianGrid stroke="#161c30" strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #222b46' }} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="text-xs text-white/20 mt-6">
        Connect Google Analytics or a product analytics tool (e.g. Mixpanel, PostHog) for deeper funnel and behavior insights.
      </p>
    </div>
  );
};

export default Analytics;
