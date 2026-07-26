import { useSearchParams, Link } from 'react-router-dom';
import { TbCircleCheckFilled } from 'react-icons/tb';

const Orders = () => {
  const [searchParams] = useSearchParams();
  const placed = searchParams.get('placed');

  if (placed) {
    return (
      <div className="max-w-lg mx-auto py-28 px-6">
        <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-xl p-10 text-center">
          <TbCircleCheckFilled className="text-7xl text-brand-gold mx-auto mb-6" />
          <h1 className="font-display text-4xl tracking-wider mb-3">Thank You For Your Purchase!</h1>
          <p className="text-white/40 text-sm mb-2">Your payment has been received successfully. We've started preparing your order and will notify you once it's shipped.</p>
          <p className="text-lg font-mono bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-xl px-5 py-3 inline-block mt-3 mb-8">{placed}</p>
          <p className="text-white/50 text-sm mb-8">
            Estimated Delivery: <span className="text-white font-semibold">3–5 Business Days</span>
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to={`/track-order?order=${placed}`} className="btn-primary">Track Order</Link>
            <Link to="/profile?tab=orders" className="btn-outline">View All Orders</Link>
            <Link
              to="/shop"
              className="btn-outline"
            >
              Continue Shopping
            </Link>
          </div>
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
