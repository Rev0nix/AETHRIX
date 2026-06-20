import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import api from '../services/api';

const Customers = () => {
  const [users, setUsers] = useState([]);

  const load = () => {
    api.get('/users', { params: { limit: 100 } }).then((r) => setUsers(r.data.data));
  };

  useEffect(load, []);

  const toggleActive = async (u) => {
    await api.put(`/users/${u._id}`, { isActive: !u.isActive });
    load();
  };

  const customers = users.filter((u) => u.role === 'customer');

  return (
    <div>
      <Topbar title="Customers" />

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Customers" value={users.length} />
        <StatCard label="Active" value={users.filter((u) => u.isActive).length} />
        <StatCard label="Admins" value={users.filter((u) => u.role === 'admin').length} />
      </div>

      <div className="bg-base-900 border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Email</th>
              <th className="text-left py-3 px-6">Role</th>
              <th className="text-left py-3 px-6">Joined</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/[0.03]">
                <td className="py-3 px-6">{u.name}</td>
                <td className="py-3 px-6 text-white/50">{u.email}</td>
                <td className="py-3 px-6 capitalize">{u.role}</td>
                <td className="py-3 px-6 text-white/40">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="py-3 px-6">
                  <span className={`text-[10px] uppercase px-2.5 py-1 rounded ${u.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <button onClick={() => toggleActive(u)} className="text-xs text-accent-glow">
                    {u.isActive ? 'Disable' : 'Enable'}
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

export default Customers;
