import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Analytics from './pages/Analytics';
import Messages from './pages/Messages';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}

export default App;
