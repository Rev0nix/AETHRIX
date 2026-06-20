import { useSearchParams, Link } from 'react-router-dom';
import { TbCircleCheckFilled } from 'react-icons/tb';

const Orders = () => {
  const [searchParams] = useSearchParams();
  const placed = searchParams.get('placed');

  if (placed) {
    return (
      <div className="max-w-md mx-auto text-center py-28 px-6">
        <TbCircleCheckFilled className="text-6xl text-accent-glow mx-auto mb-6" />
        <h1 className="font-display text-4xl tracking-wider mb-3">Order Confirmed</h1>
        <p className="text-white/40 text-sm mb-2">Your order has been placed successfully.</p>
        <p className="text-sm font-mono bg-white/5 inline-block px-4 py-2 rounded mt-2 mb-8">{placed}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to={`/track-order?order=${placed}`} className="btn-primary">Track Order</Link>
          <Link to="/profile?tab=orders" className="btn-outline">View All Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-28">
      <p className="text-white/40 mb-4">View your orders from your profile.</p>
      <Link to="/profile?tab=orders" className="btn-primary">Go to My Orders</Link>
    </div>
  );
};

export default Orders;
