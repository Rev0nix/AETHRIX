import { NavLink, useNavigate } from 'react-router-dom';
import {
  TbLayoutDashboard,
  TbShoppingCart,
  TbShirt,
  TbUsers,
  TbTag,
  TbChartLine,
  TbArrowLeft,
} from 'react-icons/tb';

const NAV_ITEMS = [
  { to: '/', icon: TbLayoutDashboard, label: 'Dashboard' },
  { to: '/orders', icon: TbShoppingCart, label: 'Orders' },
  { to: '/products', icon: TbShirt, label: 'Products' },
  { to: '/customers', icon: TbUsers, label: 'Customers' },
  { to: '/coupons', icon: TbTag, label: 'Coupons' },
  { to: '/analytics', icon: TbChartLine, label: 'Analytics' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-[220px] bg-base-900 border-r border-white/5 py-8 flex flex-col">
      <div className="px-6 mb-8">
        <div className="font-display text-xl tracking-[0.2em]">AETHRIX</div>
        <div className="text-[10px] text-white/20 tracking-wider">Admin Panel</div>
      </div>
      <nav className="flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`
            }
          >
            <item.icon className="text-base" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem('aethrix_admin_token');
          navigate('/login');
        }}
        className="flex items-center gap-3 px-6 py-3 text-sm text-white/40 hover:text-white mt-4"
      >
        <TbArrowLeft /> Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
