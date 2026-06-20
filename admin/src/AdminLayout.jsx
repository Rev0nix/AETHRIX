import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const AdminLayout = () => {
  const token = localStorage.getItem('aethrix_admin_token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-base-black">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
